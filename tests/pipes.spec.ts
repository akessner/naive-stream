import { expect } from "chai"
import { Pipeline } from "../src/pipeline"

// API
/*  
stdin-source: reads one number from stdin, prints ‘> ‘ and the number afterward, for example: if the user entered 1, it will print ‘> 1’. 
filter: only passes events that match a predicate (a function that returns true or false given a number). The predicate is given during the initialization time of the filter.
fixed-event-window: aggregates events into a fixed-size array, pass it forward when full. The size of the fixed array is defined during the initialization of fixed-event-window.
fold-sum: sums the value of the events in the array, and passes forward the sum.
fold-median: calculate the median (חציון) value of the events in the array, and pass forward the median.
stdout-sink: prints the number to stdout and pass forward the number.

From these 6 building blocks, any pipeline can be built, here is one for example:
stdin-source → filter(i=>i>0) → fixed-event-window(2) → fold-sum →  fixed-event-window(3) →  fold-median → stdout-sink

An example of input by the user:
> 1
> 2
> -5
> 3
> 4
> 5
> 6
7 ← printed by stdout-sink
> 10
> 11
> 12
> 13
> 14
> 15
??? ← what would be the value here?


*/
const P = Pipeline
const OldLog = console.log
let fakeLog : string = "";

describe("Pipeline input", ()=> {
    beforeEach(()=> {
        fakeLog = "";
        console.log = (...args: any[]):void => {
            fakeLog = fakeLog.concat(...args);
            fakeLog += '\n';
        }
    });
    afterEach(()=>{
        console.log = OldLog;
        fakeLog = "";
    });

    it ('fake console works', ()=> {
        console.log("it works");
        expect(fakeLog).to.equal("it works\n")
    })
    it('stdin and stdout properly when chained', ()=>{

        ["1", "2", "3"].map(P.stdinSource(P.stdoutSink()))
        expect(fakeLog).to.equal("> 1\n1\n> 2\n2\n> 3\n3\n")
    })
    it('stdout called twice, prints twice', ()=>{

        ["1", "2", "3"].map(P.stdinSource(P.stdoutSink(P.stdoutSink())))
        expect(fakeLog).to.equal("> 1\n1\n1\n> 2\n2\n2\n> 3\n3\n3\n")
    })
  
    it.skip('passes the final acceptance test of a sample pipeline', ()=>{
        ["1", "2", "-5", "3", "4", "5", "6", "10", "11", "12", "13", "14", "15"].map(
            P.stdinSource(
                P.filter((i)=>{return i>0}, 
                    P.fixedEventWindow(2, 
                        P.foldSum(
                            P.fixedEventWindow(3, 
                                P.foldMedian(
                                    P.stdoutSink()
                                )
                            )
                        )
                    )
                )
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
25`);
    })
})


 