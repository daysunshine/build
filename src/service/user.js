// 
// import store from 'store';
// import {observable} from 'mobx';

// /**用户登录、注册功能 */

// class UserService {
// //   @observable succeed = false; //增加观察的变量
// //   @observable reg_succeed = false;
// //   @observable errMsg = "";
// //   @observable reg_errMsg = "";

//     login(name, password) {
//         // console.log(email, password)
        
//         // 接下要在浏览器上通过axios异步去请求后端的Python服务，也可以使用jquery去实现
//         axios.post('/api/user/login', {
//             email: name,
//             password: password
//           })
//           .then(response => { //2xx才进入  返回一个response对象
//             console.log(response);
//             store.set('token',response.data.token) //存放到浏览器中的LocalStorge中，当有新的登录时会将原有的token替换
//             this.succeed = true; //在存储完token后将被观察的变量 改变，并在login中定义观察者，来进行动作
//             // TypeError: Cannot set property 'succeed' of undefined
//             // at user.js:20  是this的问题，转换成箭头函数就行了
//             // console.log(response.data);
//             // console.log(response.status);
//             // console.log(response.statusText);
//             // console.log(response.headers);
//             // console.log(response.config);
//           })
//           .catch( error => { //非2xx 进入
//             console.log(error);//后台发来的错误
//             this.errMsg = "登录错误，请检查用户名、密码";
//           });
//     }

//     reg(name, email, password) {
//       // console.log(email, password)
      
//       // 接下要在浏览器上通过axios异步去请求后端的Python服务，也可以使用jquery去实现
//       axios.post('/api/user/reg', {
//           name:name,
//           email: email,
//           password: password
//         })
//         .then(response => {// 箭头函数解决this问题 
//                           //2xx才进入  返回一个response对象
//           console.log(response);
//           store.set('token',response.data.token) //存放到浏览器中的LocalStorge中，当有新的登录时会将原有的token替换
//           this.reg_succeed = true; //在存储完token后将被观察的变量 改变，并在login中定义观察者，来进行动作
//         })
//         .catch( error => { //非2xx 进入
//           console.log(error);
//           this.reg_errMsg = "注册失败，请稍后重试";
//         });
//   }
// }

// const userService = new UserService();
// export default userService; // --> 导出的就是单个实例
// //因对于一个观察的变量需要在同一个实例下进行判断，否则用户通过注册后跳转到主页之后，在点击登录按
// //钮，登录的页面还是会出来，就是之前声明了多个实例，即使被观察量改变却不能使登录页面也跳转

