import { expect } from "chai";
import { Pipeline } from "../src/pipeline";

// API
/*  
stdin-source: reads one number from stdin, prints ‘> ‘ and the number afterward, for example: if the user entered 1, it will print ‘> 1’. 
fixed-event-window: aggregates events into a fixed-size array, pass it forward when full. The size of the fixed array is defined during the initialization of fixed-event-window.
from these 6 building blocks, any pipeline can be built, here is one for example:
stdin-source → filter(i=>i>0) → fixed-event-window(2) → fold-sum →  fixed-event-window(3) →  fold-median → stdout-sink

*/
const P = Pipeline;
const OldLog = console.log;
let fakeLog: string = "";

describe("Pipeline input", () => {
  beforeEach(() => {
    fakeLog = "";
    console.log = (...args: any[]): void => {
      fakeLog = fakeLog.concat(...args);
      fakeLog += "\n";
    };
  });
  afterEach(() => {
    console.log = OldLog;
    fakeLog = "";
  });

  it("fake console works", () => {
      OldLog(process.env.NODE_ENV)
    console.log("it works");
    expect(fakeLog).to.equal("it works\n");
  });
  it("stdin and stdout properly when chained", () => {
    ["1", "2", "3"].map(P.stdinSource(P.stdoutSink()));
    expect(fakeLog).to.equal("> 1\n1\n> 2\n2\n> 3\n3\n");
  });
  it("stdout called twice, prints twice", () => {
    ["1", "2", "3"].map(P.stdinSource(P.stdoutSink(P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n1\n1\n> 2\n2\n2\n> 3\n3\n3\n");
  });

  it("if filter fails, only print input", () => {
    ["1", "2", "3"].map(
      P.stdinSource(
        P.filter((i) => {
          return i < 0;
        }, P.stdoutSink())
      )
    );
    expect(fakeLog).to.equal("> 1\n> 2\n> 3\n");
  });
  it("if filter passes, print input and number", () => {
    ["1", "2", "3"].map(
      P.stdinSource(
        P.filter((i) => {
          return i > 0;
        }, P.stdoutSink())
      )
    );
    expect(fakeLog).to.equal("> 1\n1\n> 2\n2\n> 3\n3\n");
  });

  it("foldSum returns 0 if array is empty", () => {
    expect(P.foldSum([])).to.equal(0);
  });

  it("foldSum returns sum of array", () => {
    expect(P.foldSum([1, 2, 3])).to.equal(6);
  });

  it("fold median returns 0 if array is empty", () => {
    expect(P.foldMedian([])).to.equal(0);
  });
  it("fold median returns middle number if array is length is odd", () => {
    expect(P.foldMedian([1, 2, 3, 4, 5, 6, 7])).to.equal(4);
  });
  it("fold median returns average of two middle numbers if array is length is even", () => {
    expect(P.foldMedian([1, 2, 3, 4, 5, 6, 7, 8])).to.equal(4.5);
  });

  it("fixed Event window returns nothing if size not met", () => {
    ["1", "2"].map(P.stdinSource(P.fixedEventWindow(3, (arr) => arr, P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n> 2\n");
  });
  it("fixed Event window returns array if size is met", () => {
    ["1", "2", "3"].map(P.stdinSource(P.fixedEventWindow(3, (arr) => arr, P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n> 2\n> 3\n1,2,3\n");
  });
  it("fixed Event window  + sum fold returns sum if size is met", () => {
    ["1", "2", "3"].map(P.stdinSource(P.fixedEventWindow(3, P.foldSum, P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n> 2\n> 3\n6\n");
  });
  it("fixed Event window  + sum fold returns sum for each event window block", () => {
    ["1", "2", "3", "4", "5", "6"].map(P.stdinSource(P.fixedEventWindow(3, P.foldSum, P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n> 2\n> 3\n6\n> 4\n> 5\n> 6\n15\n");
  });
  it("fixed Event window  + median fold returns median if size is met", () => {
    ["1", "2", "3"].map(P.stdinSource(P.fixedEventWindow(3, P.foldMedian, P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n> 2\n> 3\n2\n");
  });
  it("sum + median folds return correct result", () => {
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
      P.fixedEventWindow(3, P.foldSum, P.stdoutSink(P.fixedEventWindow(3, P.foldMedian, P.stdoutSink())))
    );
    expect(fakeLog).to.equal("6\n15\n24\n15\n");
  });

  it("passes the final acceptance test of a sample pipeline", () => {
    ["1", "2", "-5", "3", "4", "5", "6", "10", "11", "12", "13", "14", "15"].map(
      P.stdinSource(
        P.filter((i) => {
          return i > 0;
        }, P.fixedEventWindow(2, P.foldSum, P.fixedEventWindow(3, P.foldMedian, P.stdoutSink())))
      )
    );
    expect(fakeLog).to.equal(
      `> 1
> 2
> -5
> 3
> 4
> 5
> 6
7
> 10
> 11
> 12
> 13
> 14
> 15
25\n`
    );
  });
});
