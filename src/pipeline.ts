
export class Pipeline {
    static filter(predicate: (i: any) => boolean, fn:any): (i: any) => void {
        return (i)=>{
           if (predicate(i)) {
                fn(i);
            }
            
        }
       
    }
    static foldSum(fn: any): any {
        return (i)=>{
            fn(i);
        }
        
    }
    
    static fixedEventWindow(winSize: number, fn: any): any {
        return (i)=>{
            fn(i);
        }
       
    }
    static foldMedian(fn: (i: any) => void): any {
        return (i)=>{
            fn(i);
        }
    }  

    static stdoutSink(fn: (i)=>void = (i)=>{}) {
        
        return (i)=>{
            console.log(i);
            fn(i);
        }
    }
    static stdinSource(fn: (i)=>void) {
       
        return (i)=>{
            console.log(`> ${i}`);
            fn(i);
        }
    }
    
}




