import { expect } from "chai";
import { Pipeline } from "../src/pipeline";
const P = Pipeline;
const OldLog = console.log;
let fakeLog: string = "";

describe("Pipeline naive input stream", () => {
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

  it("fake console log, used for testing output", () => {
    OldLog(process.env.NODE_ENV);
    console.log("it works");
    expect(fakeLog).to.equal("it works\n");
  });
  it("stdin and stdout properly write to the log when chained", () => {
    ["1", "2", "3"].map(P.stdinSource(P.stdoutSink()));
    expect(fakeLog).to.equal("> 1\n1\n> 2\n2\n> 3\n3\n");
  });
  it("when stdout is called twice, it prints twice", () => {
    ["1", "2", "3"].map(P.stdinSource(P.stdoutSink(P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n1\n1\n> 2\n2\n2\n> 3\n3\n3\n");
  });

  it("if filter predicate fails, don't pass on the value", () => {
    ["1", "2", "3"].map(
      P.stdinSource(
        P.filter((i) => {
          return i < 0;
        }, P.stdoutSink())
      )
    );
    expect(fakeLog).to.equal("> 1\n> 2\n> 3\n");
  });
  it("if filter predicate passes, pass on the vlaue and print the input along with the number", () => {
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
  it("fold median returns middle number if array length is odd", () => {
    expect(P.foldMedian([1, 2, 3, 4, 5, 6, 7])).to.equal(4);
  });
  it("fold median returns average of two middle numbers if array length is even", () => {
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
  it("fixed Event window + sum fold returns sum if size is met", () => {
    ["1", "2", "3"].map(P.stdinSource(P.fixedEventWindow(3, P.foldSum, P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n> 2\n> 3\n6\n");
  });
  it("fixed Event window + sum fold returns sum for each event window block", () => {
    ["1", "2", "3", "4", "5", "6"].map(P.stdinSource(P.fixedEventWindow(3, P.foldSum, P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n> 2\n> 3\n6\n> 4\n> 5\n> 6\n15\n");
  });
  it("fixed Event window + median fold returns median if size is met", () => {
    ["1", "2", "3"].map(P.stdinSource(P.fixedEventWindow(3, P.foldMedian, P.stdoutSink())));
    expect(fakeLog).to.equal("> 1\n> 2\n> 3\n2\n");
  });
  it("sum + median folds print expected outputs with a stdoutSink", () => {
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
