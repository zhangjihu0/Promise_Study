const PENDING = 'pending'//初始转态
const FULFILLED = 'fulfilled';//初始状态；
const REJECTED = 'rejected';
function Promise(executor){//执行器
  let self = this;//先缓存当前的promise实例
  self.status = PENDING;//状态设置
  //存放成功回调的数组
  self.onResolvedCallbacks = [];
  //存放失败回调的数组
  self.onRejectedCallbacks = [];
  function resolve(value){
    if(self.status==PENDING){
      self.status = FULFILLED;
      self.value = value;//成功后会的到一个值，这个值不能改；
      self.onResolvedCallbacks.forEach(cb=>cb(self.value))
    }
  }
  function reject(reason){
    if(self.status==PENDING){
      self.status = REJECTED;
      self.value = reason;//失败的原因
      self.onRejectedCallbacks.forEach(cb=>cb(self.value))
    }
  }
  try{
    //因为此函数执行可能会异常，所以需要捕获，如果出错，需要用错误对象 reject
   executor 
  }catch(e){
    //如果函数执行失败了，则用失败的原因reject这个promise
    reject(e)
  }
 
}
function resolvePromise(promise2,x,resolve,reject){
  if(promise2 === x){
    //let p2 = p1.then(function(data){console.log(data);return p2})
    //=>p2 promise2                                                 =>p2 x
    return reject(new TypeError('循环引用'))
  }
  if(x instanceof Promise){
    if(x.status == 'pending'){
      //.then()中继续使用promise做异步处理，
      x.then(function(y){//resolve(y) 参数
        resolvePromise(promise2,y,resolve,reject);
      },reject);

    }else{
      x.then(resolve,reject);
    }
    //x是一个thenable对象或者函数，只要有then方法的对象
  }else if(x!=null&&((typeof x=='object')||(typeof x =='function'))){
    //当我的promise和别人写的promise进行交互的时候，尽量的考虑兼容性，允许别人瞎写；
  }else{
    //如果x是一个普通的值，则
    resolve(x)
  }
}
Promise.prototype.then = function(onFulfilled,onRejected){
  //如果成功和失败的回调没有传，则表示这个then没有任何逻辑，只会把值往后抛
  //不传参数会默认添加value=>value函数向后抛
  onFulfilled = typeof onFulfilled =='function'?onFulfilled:value=>value;
  onRejected = typeof onRejected =='function'?onRejected:reason=>{throw reason};
  //如果当前的promise状态变为成功 onFulfilled直接取值
 let self =this;
 let promise2;
 if(self.status == FULFILLED){
  return promise2 = new Promise(function(resolve,reject){//链式调用过程中如果.then(params)params不是函数则直接沿用上一个promise resolve（params）中的结果
    try{
      let x = onFulfilled(self.value);
      //如果获取到了返回值x,会走解析promise的过程
      resolvePromise(promise2,xresolve,reject);
    }catch(e){
      //如果执行成功的回调过程中出错了，用错误原因把promise2
      reject(e)
    }  
  })
 }
  // if(self.status == FULFILLED){//同步任务在promise中用resolve('xxx')接下来调用.then()是时状态已经修改为
  //   let x = onFulfilled(self.value);
  // }
  if(self.status == REJECTED){
    try{
      let x = onRejected(self.value);
      resolvePromise(promise2,xresolve,reject);
    }catch(e){
      reject(e)
    }
  
  }
  if(self.status == PENDING){//.then()直接被调用时执行。将失败和成功回调放到对应数组
   self.onResolvedCallbacks.push(function(){
     try{
      let x = onFulfilled(self.value); 
      resolvePromise(promise2,xresolve,reject);
     }catch(e){
      reject(e)
     }

   })
   self.onRejectedCallbacks.push(function(){
     try{
      let x = onRejected(self.value);
      resolvePromise(promise2,xresolve,reject);
     }catch(e){reject(e)}

   })
  }
}