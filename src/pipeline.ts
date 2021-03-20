
export class Pipeline {
    static filter(predicate: (i: any) => boolean, fn:(i: any) => void): (i: any) => void {
        return (i)=>{
           if (predicate(i)) {
                fn(i);
            }
            
        }
       
    }
    
    static foldMedian(arr: number[], fn?: (i: any) => void): any {
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
    static foldSum(arr: number[], fn?: (i: any) => void): any {     
        return (i)=>{     
           const sum = arr.reduce((prev, i,)=>prev+i,0)
           fn(sum);
       }
       
   }
    static fixedEventWindow(winSize: number, fn: (arr: number[], i?)=> void, arr: number[]=[]): any {
   
        return (i)=>{
            arr.push(i)
            if (arr.length < winSize) {
                return this.fixedEventWindow(winSize, fn, arr)
            }
            fn(arr);
        }
       
    }
    

    static stdoutSink(fn: (i)=>void = (i)=>{}) {
        
        return (i)=>{
            process.stdout.write(`${i}\n`);
            console.log(i)
            fn(i);
        }
    }
    static stdinSource(fn: (i)=>void) {
        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                process.stdout.write(`> ${chunk}\n`);
                fn(parseInt(chunk));
            }
        });
        return (i)=>{
            console.log(`> ${i}`);
            fn(i);
        }
    }
    
}




