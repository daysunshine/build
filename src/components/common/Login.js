import React, { Component } from 'react';
import '../../style/login.less';
import { Form, Icon, Input, Button, Checkbox, message, Spin } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;

class NormalLoginForm extends Component {
    state = {
        isLoding:false, //定义初始的登录状态
        // st:false
    };
    PatchUser(values) {
        axios.post('/api/user/login', {
            name: values.username,
            password: values.password
            })
            .then(response => { 
            // console.log(response);
            // store.set('mspa_token',response.token)
            sessionStorage.setItem('mspa_token',response.data.token)
            // this.setState({st:true});
            })
            .catch( error => { 
            // console.log(error);
            // this.setState({st:false});
            });     
    };

    handleSubmit = (e) => {
        e.preventDefault(); //拦截点击提交的行为
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                axios.post('/api/user/login', {
                    name: values.username,
                    password: values.password
                    })
                .then(response => { 
                    sessionStorage.setItem('mspa_token',response.data.token)
                    this.setState({
                        isLoding: true, //将登录状态置成true
                    });
                    sessionStorage.setItem('mspa_user',JSON.stringify(values.username));//将登录成功的信息存储到浏览器
                    message.success('login successed!',0.8); //成功信息-->提示
                    let that = this;
                    setTimeout(function() { //延迟进入
                        that.props.history.push({pathname:'/app',state:values}); // 通过history来进行跳转至登录后的页面，同时将登录表单信息放到values中（用户名、密码）
                    }, 1000);//设定延时2000ms
                })
                .catch( error => { 
                    // console.log(error);
                    message.error('login failed!'); //失败信息
                }); 
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;/*getFieldDecorator这个值的作用是帮助我们做表单封装这个方法接收两个参数，
                                                        第一个是表单的字段对象，第二个是验证规则。这个方法本身返回一个方法，
                                                        需要将需要获取值的标签包裹进去*/
        return (
            this.state.isLoding?<Spin size="large" className="loading" />:
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <div className="login-name">Test Web PlatForm</div>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input size='default'  defaultValue='admin' prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input size='default'  prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:'0'}}>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox  style={{float:'left'}}>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" href="" style={{float:'right'}}>忘记密码?</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            还未注册<a href="">现在就去注册!</a>
                        </FormItem>
                    </Form>
                    <a className="githubUrl" href="https://github.com"> </a>
                </div>
            </div>
        );
    }
}

const Login = Form.create()(NormalLoginForm);//经过包装getFieldDecorator才能好使
export default Login;