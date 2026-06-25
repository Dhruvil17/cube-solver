import { create } from 'zustand';
import {
  Cubie,
  createSolvedState,
  applyMove,
  generateScramble,
  toFaceletString,
  FACELET_MAPPING,
} from '@/lib/cube-core';
import { audio } from '@/lib/audio';
import Cube from 'cubejs';

// Reconstruct 27-cubie layout from a 54-character facelet string
export function fromFaceletString(faceletStr: string): Cubie[] {
  const state: Cubie[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        state.push({
          id: `cubie_${x}_${y}_${z}`,
          x,
          y,
          z,
          colors: { U: null, D: null, R: null, L: null, F: null, B: null }
        });
      }
    }
  }

  for (let i = 0; i < faceletStr.length; i++) {
    const mapping = FACELET_MAPPING[i];
    if (!mapping) continue;
    const cubie = state.find((c) => c.x === mapping.x && c.y === mapping.y && c.z === mapping.z);
    if (cubie) {
      cubie.colors[mapping.face] = faceletStr[i];
    }
  }

  return state;
}

interface CubeStore {
  cubies: Cubie[];
  history: string[];
  moveQueue: string[];
  animatingMove: string | null;

  isSolving: boolean;
  isSolverReady: boolean;
  playbackMoves: string[];
  playbackIndex: number;
  isPlaybackActive: boolean;
  playbackSpeed: number; // 0.5, 1, 2, 4
  isMuted: boolean;
  isOrbitEnabled: boolean;

  // Actions
  reset: () => void;
  scramble: () => void;
  queueMoves: (moves: string[]) => void;
  startAnimatingNext: () => void;
  finishAnimatingMove: () => void;
  solve: () => void;
  setMuted: (muted: boolean) => void;
  setSpeed: (speed: number) => void;
  togglePlayback: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setOrbitEnabled: (enabled: boolean) => void;
  
  // LocalStorage state helper
  loadPersistedState: () => void;
  savePersistedState: () => void;
}

// Instantiate Web Worker inside store safely
let solverWorker: Worker | null = null;
let isWorkerReady = false;

function getWorker(onReady: () => void, onSolution: (moves: string[]) => void, onError: (err: string) => void): Worker | null {
  if (typeof window === 'undefined') return null;
  if (!solverWorker) {
    try {
      solverWorker = new Worker(new URL('../solver/solver.worker.ts', import.meta.url));
      solverWorker.onmessage = (e: MessageEvent) => {
        const { type, moves, error } = e.data;
        if (type === 'ready') {
          isWorkerReady = true;
          onReady();
        } else if (type === 'solution') {
          onSolution(moves);
        } else if (type === 'error') {
          onError(error);
        }
      };
      solverWorker.postMessage({ type: 'init' });
    } catch (err) {
      console.warn('Worker instantiation failed. Falling back to main-thread solving.', err);
    }
  }
  return solverWorker;
}

export const useCubeStore = create<CubeStore>((set, get) => {
  // Setup worker listener bindings
  const workerReady = () => set({ isSolverReady: true });
  const workerSolution = (moves: string[]) => {
    set({ isSolving: false, playbackMoves: moves, playbackIndex: 0 });
    get().savePersistedState();
  };
  const workerError = (err: string) => {
    console.error('Web worker solver error:', err);
    set({ isSolving: false });
  };

  // Pre-initialize worker if on browser
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      getWorker(workerReady, workerSolution, workerError);
    }, 100);
  }

  return {
    cubies: createSolvedState(),
    history: [],
    moveQueue: [],
    animatingMove: null,
    isSolving: false,
    isSolverReady: false,
    playbackMoves: [],
    playbackIndex: -1,
    isPlaybackActive: false,
    playbackSpeed: 1,
    isMuted: false,
    isOrbitEnabled: true,

    reset: () => {
      audio.playTick(get().isMuted);
      set({
        cubies: createSolvedState(),
        history: [],
        moveQueue: [],
        animatingMove: null,
        isSolving: false,
        playbackMoves: [],
        playbackIndex: -1,
        isPlaybackActive: false,
      });
      get().savePersistedState();
    },

    scramble: () => {
      const { isMuted } = get();
      audio.playWhoosh(isMuted);
      const moves = generateScramble();
      set((state) => ({
        playbackMoves: [],
        playbackIndex: -1,
        isPlaybackActive: false,
        moveQueue: [...state.moveQueue, ...moves],
      }));
    },

    queueMoves: (moves: string[]) => {
      set((state) => ({
        moveQueue: [...state.moveQueue, ...moves],
      }));
    },

    startAnimatingNext: () => {
      const { moveQueue, animatingMove } = get();
      if (animatingMove || moveQueue.length === 0) return;

      const nextMove = moveQueue[0];
      set({
        animatingMove: nextMove,
        moveQueue: moveQueue.slice(1),
      });
    },

    finishAnimatingMove: () => {
      const { animatingMove, cubies, history, isMuted, isPlaybackActive, playbackMoves, playbackIndex } = get();
      if (!animatingMove) return;

      audio.playClick(isMuted);
      const updatedCubies = applyMove(cubies, animatingMove);

      let nextPlaybackIdx = playbackIndex;
      let nextPlaybackActive = isPlaybackActive;

      // Handle auto-solve steps progression
      if (isPlaybackActive && playbackMoves.length > 0) {
        nextPlaybackIdx = playbackIndex + 1;
        if (nextPlaybackIdx >= playbackMoves.length) {
          nextPlaybackActive = false;
          nextPlaybackIdx = -1;
          setTimeout(() => audio.playChime(get().isMuted), 150);
        }
      }

      set({
        cubies: updatedCubies,
        history: [...history, animatingMove],
        animatingMove: null,
        playbackIndex: nextPlaybackIdx,
        isPlaybackActive: nextPlaybackActive,
      });

      get().savePersistedState();

      // If playing back and more moves are in the solution list, schedule the next turn
      if (nextPlaybackActive && nextPlaybackIdx !== -1 && nextPlaybackIdx < playbackMoves.length) {
        const nextMove = playbackMoves[nextPlaybackIdx];
        set((state) => ({
          moveQueue: [...state.moveQueue, nextMove],
        }));
      }
    },

    solve: () => {
      audio.playTick(get().isMuted);
      const { cubies, isSolving } = get();
      if (isSolving) return;

      const faceletString = toFaceletString(cubies);
      
      // If it's already solved, don't trigger solver
      if (faceletString === 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB') {
        audio.playChime(get().isMuted);
        return;
      }

      set({ isSolving: true });
      const worker = getWorker(workerReady, workerSolution, workerError);

      if (worker && isWorkerReady) {
        worker.postMessage({ type: 'solve', payload: { faceletString } });
      } else {
        // Synchronous main-thread solver fallback
        setTimeout(() => {
          try {
            Cube.initSolver();
            const cube = Cube.fromString(faceletString);
            const solution = cube.solve();
            const moves = solution
              .split(/\s+/)
              .map((m) => m.trim())
              .filter((m) => m.length > 0);

            workerSolution(moves);
          } catch (err: unknown) {
            workerError(err instanceof Error ? err.message : String(err));
          }
        }, 50);
      }
    },

    setMuted: (muted) => {
      set({ isMuted: muted });
      audio.playTick(muted);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('rubiks_cube_muted', String(muted));
        } catch (err) {
          console.error('Error saving muted state to localStorage:', err);
        }
      }
    },

    setSpeed: (speed) => {
      set({ playbackSpeed: speed });
      audio.playTick(get().isMuted);
    },

    togglePlayback: () => {
      audio.playTick(get().isMuted);
      const { isPlaybackActive, playbackMoves, playbackIndex } = get();
      if (playbackMoves.length === 0) return;

      const nextActive = !isPlaybackActive;
      set({ isPlaybackActive: nextActive });

      if (nextActive) {
        const startIdx = playbackIndex === -1 ? 0 : playbackIndex;
        set({ playbackIndex: startIdx });
        const nextMove = playbackMoves[startIdx];
        set((state) => ({
          moveQueue: [...state.moveQueue, nextMove],
        }));
      }
    },

    stepForward: () => {
      audio.playTick(get().isMuted);
      const { playbackMoves, playbackIndex, animatingMove } = get();
      if (playbackMoves.length === 0 || animatingMove) return;

      // Disable autoplay when stepping manually
      const currentIdx = playbackIndex === -1 ? 0 : playbackIndex;
      if (currentIdx < playbackMoves.length) {
        const nextMove = playbackMoves[currentIdx];
        set({
          isPlaybackActive: false,
          playbackIndex: currentIdx + 1,
          moveQueue: [...get().moveQueue, nextMove],
        });
      }
    },

    stepBackward: () => {
      audio.playTick(get().isMuted);
      const { playbackMoves, playbackIndex, animatingMove } = get();
      if (playbackMoves.length === 0 || animatingMove || playbackIndex <= 0) return;

      set({ isPlaybackActive: false });

      // To step backward, we invert the last applied move
      const prevIdx = playbackIndex - 1;
      const lastMove = playbackMoves[prevIdx];
      
      // Construct the inverse notation move
      let invMove = lastMove;
      if (lastMove.includes("'")) {
        invMove = lastMove.replace("'", '');
      } else if (!lastMove.includes('2')) {
        invMove = `${lastMove}'`;
      }

      set({
        playbackIndex: prevIdx,
        moveQueue: [...get().moveQueue, invMove],
      });
    },

    setOrbitEnabled: (enabled) => {
      set({ isOrbitEnabled: enabled });
    },

    loadPersistedState: () => {
      if (typeof window === 'undefined') return;
      try {
        // Clear any residual hash to keep the URL clean as requested by the user
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        const savedState = localStorage.getItem('rubiks_cube_state');
        if (savedState && savedState.length === 54) {
          set({ cubies: fromFaceletString(savedState) });
        }

        const savedMuted = localStorage.getItem('rubiks_cube_muted');
        if (savedMuted !== null) {
          set({ isMuted: savedMuted === 'true' });
        }
      } catch (err) {
        console.error('Error loading state from localStorage:', err);
      }
    },

    savePersistedState: () => {
      if (typeof window === 'undefined') return;
      try {
        const stateStr = toFaceletString(get().cubies);
        if (stateStr === 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB') {
          localStorage.removeItem('rubiks_cube_state');
        } else {
          localStorage.setItem('rubiks_cube_state', stateStr);
        }
      } catch (err) {
        console.error('Error saving state to localStorage:', err);
      }
    },
  };
});
