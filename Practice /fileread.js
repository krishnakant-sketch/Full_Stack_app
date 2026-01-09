const fs=require('fs');
// fs.appendFile('input.txt',"Krishna is here\n",(error,data)=>{
//     if (error) throw error;
   
// })
console.log(fs.readFileSync('input.txt','utf-8'))

