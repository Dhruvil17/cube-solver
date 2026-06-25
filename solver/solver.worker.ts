import Cube from 'cubejs';

// Flags to trace solver state
let isInitialized = false;

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'init') {
    if (isInitialized) {
      self.postMessage({ type: 'ready' });
      return;
    }
    try {
      // cubejs table generation is CPU intensive
      Cube.initSolver();
      isInitialized = true;
      self.postMessage({ type: 'ready' });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      self.postMessage({ type: 'error', error: errorMsg });
    }
  }

  if (type === 'solve') {
    const { faceletString } = payload;
    try {
      if (!isInitialized) {
        Cube.initSolver();
        isInitialized = true;
      }
      const cube = Cube.fromString(faceletString);
      const solution = cube.solve();
      
      // Parse solution string like "F2 U' L2 B2" into array of clean moves
      const moves = solution
        .split(/\s+/)
        .map((m) => m.trim())
        .filter((m) => m.length > 0);

      self.postMessage({ type: 'solution', moves });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      self.postMessage({ type: 'error', error: errorMsg });
    }
  }
};
