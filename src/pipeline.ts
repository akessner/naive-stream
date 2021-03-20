
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
    static foldMedian(fn: (i: any) => void, arr: number[]=[]): any {
        return (i)=>{
            const len = arr.length;
            let median = 0
            if (len%2===0) {
               const midSum = arr[len/2] + arr[len/2-1] || 0
               median = midSum/2
                
            } else {
                median =arr[(len-1)/2]
            }
           
            fn(median);
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




