import React, { Component } from 'react';
import './form.less';

import BreadcrumbCustom from '../common/BreadcrumbCustom';
import { Select, Form,Divider,  Button ,message,notification,Input,Spin,Modal} from 'antd';
import 'antd/lib/form/style';
import 'antd/lib/layout/style';
import 'antd/lib/button/style';
// import inject from '../../service/inject';
import axios from 'axios';
// import postService from '../../service/post';

// const service = postService;

const { Option } = Select;
const { TextArea } = Input;
const confirm = Modal.confirm;

// @inject({service})
class UForms extends Component{
    state={
      value:"",
      build_loading:false,
    };
    setStatus() {
      this.setState({build_loading:true});
    };
    handleSubmit = e => {
        e.preventDefault();
        confirm({
          title: '项目构建确认',
          content: '',
          onOk: () => {  //使用箭头函数
            // console.log(this)
            this.setState({build_loading:true});
            this.props.form.validateFields((err, values) => {
              if (!err) {
                axios({
                method:'post',
                url:'/api/post/build',
                data:{
                  address:values.ip_address,
                  buildname:values.build_name
                },
                auth: {
                  username: sessionStorage.getItem('mspa_token')
                },
                }).then(response => { 
                    notification["success"]({message: 'Success',description:'构建并发布成功',duration: 0,top:50,})
                    this.setState({build_loading:false}); //成功后去掉加载框
                    this.setState({value:response.data});
                }).catch(error => {
                  if(error.response.status === 401){
                    message.error('认证过期,请重新登录！');
                    let that = this;
                    setTimeout(function() {
                      that.props.history.push({pathname:'/login'});
                    }, 1000)}else{if(error.response.status === 500){
                    message.error("构建失败！",1.5)
                    notification["error"]({message: 'Failed!',description:'构建失败',duration: 0,top:50,})
                  }else{if(error.response.status === 501){
                    message.error("发布失败！",1.5)
                    notification["error"]({message: 'Failed!',description:'发布失败',duration: 0,top:50,})
                  }}}
                  this.setState({build_loading:false});
                  this.setState({value:error.response.data});
                });
              }
            });
          },
          onCancel() {},
        });
      };
    
    handleTest (e) {
      e.preventDefault();
      let uri = ""
      let url = ""
      let ip = ""
      this.props.form.validateFields((err,values) => {
        // console.log(err)
        ip = values.ip_address
        if (!err) {
          if (values.build_name === 'jsm') {
            if (ip === '10.60.33.18') {
              uri = ":83/jsm/jtbtoln"
            }else {
              uri = "/jsm/jtbtoln"
            }
          };
          if (values.build_name === 'tgms') {
            uri = "" 
          };
          if (values.build_name === 'dltgms') {
            uri = ":82/login.action" 
          };
          if (values.build_name === 'findreport' ) {
            if (ip === '10.60.33.30') {
              uri = ":81/WebReport/ReportServer"
              ip = "10.60.33.24"
            }else {
              uri = "/WebReport/ReportServer"
            }
        };
        url = "http://" + ip + uri
      }
    });
    axios({ 
      url:"/api/post/testurl",
      method:'post',
      data:{
        testurl:url
      },
      auth: {
        username: sessionStorage.getItem('mspa_token')
      },
    }) 
    .then(response => {
      notification["success"]({message: 'Status:' + response.status ,description:'URL:'+url,duration: 0,top:50,})
    }).catch( error => {
      if(error.response.status === 401){
        message.error('认证过期,请重新登录！');
        let that = this;
        setTimeout(function() {
          that.props.history.push({pathname:'/login'});
        }, 1000)}
      notification["error"]({message: 'Status:' + error.response.status ,description:'URL:'+url,duration: 0,top:50,})
      });
  
  }
   

    render(){
        const { getFieldDecorator } = this.props.form;
        const { formLayout } = {formLayout: 'horizontal',};
        return(
            <div className="formBody">
                <BreadcrumbCustom paths={['首页','项目构建']}/>
                <Spin tip="构建中..." spinning={this.state.build_loading} size="large">
                  <div id='showpage' className="left" style={{ margin: '10px 10px',padding: 15, minHeight: 100,maxWidth:"500px"}}>
                  <Form  onSubmit={this.handleSubmit.bind(this)}>
                  <Form.Item label="选择发布环境" hasFeedback>
                        {getFieldDecorator('ip_address', {
                          rules: [{ required: true, message: 'please1' }],
                        })(
                          <Select placeholder="请选择部署环境">
                            <Option value="10.60.33.30" name="四期生产环境">四期正式环境</Option>
                            <Option value="10.60.32.175" name="便民服务jsm">JSM正式环境</Option>
                            <Option value="10.60.33.18" name="学习测试环境">18学习环境</Option>
                          </Select>,
                        )}
                    </Form.Item>
                    <Form.Item label="选择发布项目" hasFeedback>
                        {getFieldDecorator('build_name', {
                          rules: [{ required: true, message: 'please2' }],
                        })(
                          <Select placeholder="请选择构建项目">
                            <Option value="tgms" name="TGMS">TGMS</Option>
                            <Option value="findreport" name="FR">帆软</Option>
                            <Option value="jsm" name="JSM">JSM</Option>
                            <Option value="dltgms" name="DLTGMS">大连TGMS测试</Option>
                          </Select>,
                        )}
                    </Form.Item> 
                    <Form.Item wrapperCol={{ span: 12, offset: 0 }}>
                      <Button type="primary" htmlType="submit" >
                        构建并发布
                      </Button>
                      <Divider type="vertical" />
                      <Button type="primary" htmlType="submit" onClick={this.handleTest.bind(this)} >
                        点击进行测试
                      </Button>
                    </Form.Item>
                  </Form>
                  </div>
                
                  <div className="right">
                  <Form.Item>
                    <TextArea rows={4} value={this.state.value} type="textarea" style={{margin: '10px 10px',padding: 20,minHeight:"400px" ,maxWidth:"1000px"}} /> 
                  </Form.Item>
                  </div>
                </Spin>
            </div>
        )
    }
}
const UForm = Form.create()(UForms);
export default  UForm