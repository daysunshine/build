import React, {Component} from 'react';
import BreadcrumbCustom from "../common/BreadcrumbCustom";
// import { Row, Col } from 'antd';
// import L from "./L";
// import Qiniu from "./Qiniu";

import postService from '../../service/post';
import {observer} from 'mobx-react';
import inject from '../../service/inject';
import axios from 'axios';
// import history from '../common/history';
// import { message } from 'antd';

// import 'antd/lib/message/style';
import { Button,Table,Spin,message } from 'antd';
import 'antd/lib/button/style';
import 'antd/lib/table/style';
import 'antd/lib/divider/style';
import 'antd/lib/tag/style';
// import {subscribeToTimer} from '../../service/socketserver';

const service = postService;
@observer
@inject({service})
export default class Surl extends Component {
    columns = [{
        title: 'Project Name',
        dataIndex: 'pro_name',
        key: 'pro_name',
        }, {
        title: 'SVN Address',
        dataIndex: 'spath',
        key: 'spath',
        }, 
        {
        title: 'Identifier',
        dataIndex: 'p_uid',
        key: 'p_uid',
        },{
        title: 'Action',
        key: 'action',
        render: (record) => (
            <span>
            <Button type="primary" onClick={this.handleClickCode2Build.bind(this,record)}>构建镜像</Button>
            {/* <Divider type="vertical" />
            <Button onClick={this.handleClickStop.bind(this,record)}>Stop</Button>
            <Divider type="vertical" />
            <Button onClick={this.handleClickDelete.bind(this,record)}>Delete</Button> */}
            </span>
        ),
        }]; 
    constructor (props) {
        super(props);
        this.props.service.surl(); 
        
    }
    state = {
        dataSource :[],
        build_loading:false,
    }

    handleClickCode2Build(event) {
        this.setState({build_loading:true});
        const p_uid = event['p_uid'];
        // this.props.service.build(p_uid);
        axios({
            method:'post',
            url:'/api/docker/build',
            data:{
              'p_uid':p_uid
            },
            auth: {
              username: sessionStorage.getItem('mspa_token')
            },
          }).then(response => { 
              message.success('镜像已成功创建！',0.8);
              this.setState({build_loading:false})
            }).catch( error => { 
                message.error('镜像创建失败！',0.8);
                this.setState({build_loading:false})
            });
    }
   

    handleList(){
        const data = [...this.props.service.pathlist];
        this.props.service.surl();
        this.setState({
            dataSource : data,
          });
    }
    
    render() {

        const data = this.state.dataSource
        const data1 = data===[]?this.state.dataSource:[...this.props.service.pathlist]
        return (
            <div>
                <BreadcrumbCustom paths={['首页','仓库列表']}/>
                {/* <L/> */}
                {/* <div> */}
                <Button type="primary" onClick={this.handleList.bind(this)}>点击刷新列表</Button>
                <br/>
                <Spin tip="构建中..." spinning={this.state.build_loading} size="large">
                    <Table columns={this.columns} dataSource={data1} rowKey={data1 => data1.p_uid} />
                </Spin>
                {/* </div> */}
                {/* <h1>This is the timer value: {this.state.timestamp}</h1> */}

            </div>
        );
        
    }
}
