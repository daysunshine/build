import axios from 'axios';
import {message} from 'antd';
import {observable} from 'mobx';
import history from '../components/common/history';

class PostService {
    @observable postlist = [];
    @observable pathlist = [];
    @observable build_loading = '';

list() {
    axios({ 
      url:'/api/docker/list',
      method:'get',
      auth: {
        username: sessionStorage.getItem('mspa_token')
      },
    }) 
    .then(response => {
      this.postlist = response.data.posts;
      // this.status = true
    }).catch( error => {
      if(error.response.status === 401){
        message.error('认证过期,请重新登录！',0.8);
        setTimeout(function() {history.push({pathname:'/login'});}, 1000);
      }
      console.log('-error-message-',error);
    });
  }

  chgpwd(pwd) {
    axios({ 
      url:'/api/user/repwd',
      method:'post',
      data:{
      'pwd':pwd
      },
      auth: {
        username: sessionStorage.getItem('mspa_token')
      },
    }) 
    .then(response => {
      message.success('修改成功',1.0);
      setTimeout(function() {history.push({pathname:'/login'});}, 1000);
      // this.postlist = response.data.posts;
      // this.status = true
    }).catch( error => {
      if(error.response.status === 401){
        message.error('认证过期,请重新登录！',0.8);
        setTimeout(function() {history.push({pathname:'/login'});}, 1000);
      }
      console.log('-error-message-',error);
    });
  }

  surl() {
    axios({ 
      url:'/api/paths',
      method:'get',
      auth: {
        username: sessionStorage.getItem('mspa_token')
      },
    }) 
    .then(response => {
      this.pathlist = response.data.path;
      // this.status = true
    }).catch( error => {
      if(error.response.status === 401){
        message.error('认证过期,请重新登录！',0.8);
        setTimeout(function() {history.push({pathname:'/login'});}, 1000);
      }
      console.log('-error-message-',error);
    });
  }

  // test(url) {
  //   axios({ 
  //     url:url,
  //     method:'get',
  //     auth: {
  //       username: localStorage.getItem('mspa_token')
  //     },
  //   }) 
  //   .then(response => {
  //     this.pathlist = response.data.path;
  //     // this.status = true
  //   }).catch( error => {
  //     if(error.response.status === 401){
  //       message.error('认证过期,请重新登录！',0.8);
  //       setTimeout(function() {history.push({pathname:'/login'});}, 1000);
  //     }
  //     console.log('-error-message-',error);
  //   });
  // }

 // docker images build
  // build(p_uid) {
  //   axios({
  //   method:'post',
  //   url:'/api/docker/build',
  //   data:{
  //     'p_uid':p_uid
  //   },
  //   auth: {
  //     username: localStorage.getItem('mspa_token')
  //   },
  // }).then(response => { 
  //     message.success('镜像已成功创建！',0.8);
  //   }).catch( error => { 
  //   });
  // }

  container(action,container_id) {
    axios({
      method:'post',
      url:'/api/post/images'+'?'+'action='+action +'&'+'ctrid='+container_id,
      // data:{
      //   'container_id':container_id
      // },
      auth: {
        username: sessionStorage.getItem('mspa_token')
      },
    }).then(response => {
      this.list() 
      this.ctrsuccMsg = response.data.post['message'];
      }).catch( error => { 
        // console.log(error);
        this.ctrerrMsg = error.response.data.post['message'];
      });
  }

}

const postService = new PostService();
export default postService;