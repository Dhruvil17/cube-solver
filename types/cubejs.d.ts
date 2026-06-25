declare module 'cubejs' {
  class Cube {
    static initSolver(): void;
    static random(): Cube;
    static fromString(faceletString: string): Cube;

    constructor();
    asString(): string;
    move(notation: string): Cube;
    solve(): string;
    clone(): Cube;
    identity(): Cube;
    isSolved(): boolean;
  }

  export default Cube;
}
