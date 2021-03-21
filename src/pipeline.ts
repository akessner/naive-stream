export class Pipeline {
  static filter(predicate: (i: any) => boolean, fn: (i: any) => void): (i: any) => void {
    return (i) => {
      if (predicate(i)) {
        fn(i);
      }
    };
  }

  static foldMedian(arr: number[]): number {
    const len = arr.length;
    if (len % 2 === 0) {
      return sumTwoMiddleValues(arr, len) / 2;
    } else {
      const middleIndex = (len - 1) / 2;
      return arr[middleIndex];
    }
    function sumTwoMiddleValues(arr: number[], len: number) {
      return arr[len / 2] + arr[len / 2 - 1] || 0;
    }
  }
  static foldSum(arr: number[]): number {
    return arr.reduce((prev, i) => prev + i, 0);
  }

  static fixedEventWindow(
    windowLength: number,
    foldStrategy: (arr: number[]) => number | number[],
    fn: (i) => void,
    recursiveArray: number[] = []
  ): any {
    return (i) => {
      recursiveArray.push(parseInt(i));
      if (recursiveArray.length < windowLength) {
        return this.fixedEventWindow(windowLength, foldStrategy, fn, recursiveArray);
      }
      fn(foldStrategy(recursiveArray));
      recursiveArray = [];
    };
  }

  static stdoutSink(fn: (i) => void = (i) => {}) {
    return (i) => {
      if (process.env.NODE_ENV === "test") {
        console.log(i);
      } else {
        process.stdout.write(`${i}\n`);
      }
      fn(i);
    };
  }
  static stdinSource(fn: (i) => void) {
    if (process.env.NODE_ENV !== "test") {
      process.stdin.on("readable", () => {
        let chunk;
        while ((chunk = process.stdin.read()) !== null) {
          process.stdout.write(`> ${chunk}\n`);
          fn(parseInt(chunk));
        }
      });
    }
    return (i) => {
      console.log(`> ${i}`);
      fn(i);
    };
  }
}
