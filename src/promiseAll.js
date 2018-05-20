let p1 = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve(100);
    },1000);
});
let p2 = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve(100);
    },2000);
});
Promise.all([p1,p2]).then(function(data){
  
});
function gen(time,cb){
    let result = [],count=0;
    return function(i,data){
        result[i]=data;
        if(++count==times){
            cb(result);
        }
    }
}
Promise.all = function(promises){
    return new Promise(function(resolve,reject){
        let done = gen(promises.length,resolve);
        for(let i=0;i<promises.length;i++){
            promises[i].then(function(data){
                done(i,data)
            },reject)
        }
    })
}
Promise.race = function(promises){
    return new Promise(function(resolve,reject){
        for(let i=0;i<promises.length;i++){
            promises[i].then(resolve,reject)
        }
    })
}
Promise.resolve = function(value){
    return new Promise(function(resolve){
        resolve(value);
    })
}
Promise.reject = function(value){
    return new Promise(function(resolve){
        reject(value);
    })
}