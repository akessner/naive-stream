A simple naive stream Pipeline builder with six building blocks.

Start a stream with `Pipeline.stdinSource` which will read from the stdin stream when not in test mode.
When you want to output the calculated value within the stream, use `Pipeline.stdoutSink` which will write to stdout when not in test mode.

There are two building blocks, and 2 folding strategies (foldSum and foldMedian).
`Pipeline.filter` takes a predicate and if that predicate is true for the incoming value, will pass the value down to the rest of the pipeline, which is passed in as the second argument. ex: `Pipeline.filter((i)=>3, Pipeline.stdoutSink())`  

`Pipeline.fixedEventWindow` takes two main arguments, in addition to the rest of the pipleine. The first argument is the size of the window for which the fold function strategy should be applied. The second argument is desired folding function strategy. ex: `Pipeline.fixedEventWindow(2, Pipeline.foldSum, Pipeline.stdoutSink())`

To run the program using the stdinput and the default pipeline run `npm run start`
To run the tests run `npm run test`
You can replace the index.ts file with any constructed pipeline of your choosing.

For a cleaner look, the tests alias `Pipeline` to `P`
