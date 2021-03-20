
export class Pipeline {
    static filter(predicate: (i: any) => boolean, fn:any): (i: any) => void {
        return (i)=>{
           if (predicate(i)) {
                fn(i);
            }
            
        }
       
    }
    static foldSum(fn: any, arr: number[] = []): any {     
         return (i)=>{     
            const sum = arr.reduce((prev, i,)=>prev+i,0)
            fn(sum);
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




