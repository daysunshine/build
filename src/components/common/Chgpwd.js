import React, { Component } from 'react';
import BreadcrumbCustom from "./BreadcrumbCustom";
import { Form, Input, Button, Icon ,message} from 'antd';
import inject from '../../service/inject';
import postService from '../../service/post';

const service = postService;

// @observer
@inject({service})
class NomalChgpwd extends Component{
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            (!err && values.pwd === values.rpwd ) ? (values.pwd.length >= 6)? this.props.service.chgpwd(values.pwd):message.error('密码至少6位',1.0) : message.error('密码不一致',1.0)
        });
      };
    
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <BreadcrumbCustom paths={['首页','密码修改']}/>
                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
                    <Form.Item label="输入密码">
                    {getFieldDecorator('pwd', {
                        rules: [{ required: true, message: '输入密码!' }],
                    })(<Input size='default'  prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />)}
                    </Form.Item>
                    <Form.Item label="确认密码">
                    {getFieldDecorator('rpwd', {
                        rules: [{ required: true, message: '确认密码!' }],
                    })(<Input size='default'  prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请确认密码" />)}
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                    <Button type="primary" htmlType="submit">
                        确认修改
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        );
            {/* localStorage.getItem("mspa_user")===null?
            <Redirect to="/login"/>:<Redirect to="/app"/>  //如果登录跳转到/app下*/}
             
    }
}

const Chgpwd = Form.create()(NomalChgpwd);
export default Chgpwd












