/**
 * Persisted, cross-session lesson completion, backed by localStorage. A
 * plain composable rather than Pinia/Vuex: this project ships fully static
 * (GitHub Pages, no server), has no existing state-library dependency, and
 * the entire feature is "read/write a small object to localStorage" — a
 * store would add setup/dependency cost for no functional gain at this
 * scale, and still needs the exact same SSR guard below either way.
 *
 * VitePress prerenders every page in Node at build time, where
 * `localStorage` doesn't exist — `inBrowser` (VitePress's own guard,
 * confirmed used internally by its default theme) is false during that
 * pass, so the persisted read/write below never runs during `vitepress
 * build`'s SSR step. Module-level singleton state (not a fresh ref per
 * useProgress() call) is intentional: every component that calls this
 * shares one reactive object, so a lesson completing is immediately
 * visible everywhere (sidebar checkmarks, etc.) with no event bus.
 */
import { inBrowser } from 'vitepress';
import { reactive, readonly, watch } from 'vue';

const STORAGE_KEY = 'syntaxia:progress:v1';

export interface ProgressState {
	completedLessons: Record<string, { completedAt: string }>;
	/** Ids of one-time migrations already applied to this saved state. */
	migrations?: string[];
}

const state = reactive<ProgressState>({ completedLessons: {} });

/**
 * Lessons whose slug changed after learners may already have completed them.
 * Completion is saved under "track/slug", so without this a renamed lesson
 * would suddenly show as not done. The old slugs here are the one place the
 * previous "capstone" naming is kept on purpose (along with the redirect
 * pages in public/lessons/), since saved progress still uses them.
 */
const SLUG_MIGRATIONS: { id: string; renames: Record<string, string> }[] = [
	{
		id: 'final-project-rename',
		renames: {
			'html/putting-it-all-together': 'html/final-project',
			'css/capstone': 'css/final-project',
			'javascript/capstone': 'javascript/final-project',
		},
	},
];

/**
 * Moves completion from old lesson keys to new ones. Runs each migration
 * once (its id is recorded in the saved state), and even if it ran again it
 * would change nothing: an old key is only ever moved to a new key that has
 * no entry yet, and is then removed.
 */
function migrateProgress(progress: ProgressState): void {
	const applied = new Set(progress.migrations ?? []);
	for (const migration of SLUG_MIGRATIONS) {
		if (applied.has(migration.id)) continue;
		for (const [oldKey, newKey] of Object.entries(migration.renames)) {
			const entry = progress.completedLessons[oldKey];
			if (!entry) continue;
			if (!(newKey in progress.completedLessons)) progress.completedLessons[newKey] = entry;
			delete progress.completedLessons[oldKey];
		}
		applied.add(migration.id);
	}
	progress.migrations = [...applied];
}

if (inBrowser) {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) Object.assign(state, JSON.parse(raw));
	} catch {
		// Corrupt/unreadable localStorage value: start fresh rather than crash.
	}
	migrateProgress(state);
	// The watcher below only sees changes made after it starts, so the
	// migrated state is saved here directly.
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Storage unavailable/full: the migration simply re-runs next visit.
	}
	watch(
		state,
		(value) => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			} catch {
				// Storage unavailable/full: progress just won't persist this session.
			}
		},
		{ deep: true },
	);
}

function key(trackSlug: string, lessonSlug: string): string {
	return `${trackSlug}/${lessonSlug}`;
}

export function useProgress() {
	return {
		completedLessons: readonly(state.completedLessons),
		isLessonComplete(trackSlug: string, lessonSlug: string): boolean {
			return key(trackSlug, lessonSlug) in state.completedLessons;
		},
		markLessonComplete(trackSlug: string, lessonSlug: string): void {
			const k = key(trackSlug, lessonSlug);
			if (!(k in state.completedLessons)) {
				state.completedLessons[k] = { completedAt: new Date().toISOString() };
			}
		},
		resetProgress(): void {
			for (const k of Object.keys(state.completedLessons)) delete state.completedLessons[k];
		},
	};
}
