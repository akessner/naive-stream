export class Pipeline {
  static stdinSource(nextTransformation: (input: number) => void) {
    if (process.env.NODE_ENV !== "test") {
      process.stdin.on("readable", () => printInputToStdOut(nextTransformation));
    }
    return (i) => {
      console.log(`> ${i}`);
      nextTransformation(i);
    };
    function printInputToStdOut(nextTransformation: (input: number) => void) {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        process.stdout.write(`> ${chunk}\n`);
        nextTransformation(parseInt(chunk));
      }
    }
  }

  static stdoutSink(nextTransformation: (input: number) => void = () => {}) {
    return (input) => {
      if (process.env.NODE_ENV === "test") {
        console.log(input);
      } else {
        process.stdout.write(`${input}\n`);
      }
      nextTransformation(input);
    };
  }

  static filter(
    predicate: (input: number) => boolean,
    nextTransformation: (input: number) => void
  ): (input: number) => void {
    return (input) => {
      if (predicate(input)) {
        nextTransformation(input);
      }
    };
  }

  static fixedEventWindow(
    windowLength: number,
    foldStrategy: (arr: number[]) => number | number[],
    nextTransformation: (input) => void,
    recursiveArray: number[] = []
  ): (input: any) => void {
    return (input) => {
      recursiveArray.push(parseInt(input));
      if (recursiveArray.length < windowLength) {
        return this.fixedEventWindow(windowLength, foldStrategy, nextTransformation, recursiveArray);
      }
      nextTransformation(foldStrategy(recursiveArray));
      recursiveArray = [];
    };
  }

  static foldSum(arr: number[]): number {
    return arr.reduce((prev, i) => prev + i, 0);
  }

  static foldMedian(arr: number[]): number {
    const length = arr.length;
    if (length % 2 === 0) {
      return sumTwoMiddleValues(arr, length) / 2;
    } else {
      const middleIndex = (length - 1) / 2;
      return arr[middleIndex];
    }
    function sumTwoMiddleValues(arr: number[], length: number) {
      return arr[length / 2] + arr[length / 2 - 1] || 0;
    }
  }
}
