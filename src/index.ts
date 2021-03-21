import { Pipeline } from "./pipeline";

const P = Pipeline;
P.stdinSource(
  P.filter((i) => {
    return i > 0;
  }, P.fixedEventWindow(2, P.foldSum, P.fixedEventWindow(3, P.foldMedian, P.stdoutSink())))
);
