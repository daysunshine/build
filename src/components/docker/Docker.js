import React, {Component} from 'react';
import BreadcrumbCustom from "../common/BreadcrumbCustom";
// import { Row, Col } from 'antd';
// import L from "./L";
// import Qiniu from "./Qiniu";
import './dk.css';
import postService from '../../service/post';
import {observer} from 'mobx-react';
import inject from '../../service/inject';
import io from 'socket.io-client';
// import { message } from 'antd';
// import Mod from './Mo';
// import 'antd/lib/message/style';
import { Button,Table, Divider, Tag,Modal,Input} from 'antd';
import 'antd/lib/button/style';
import 'antd/lib/table/style';
import 'antd/lib/divider/style';
import 'antd/lib/tag/style';
const confirm = Modal.confirm;
// const info = Modal.info;
const { TextArea } = Input;
const service = postService;

@observer
@inject({service})
export default class Docker extends Component {
    columns = [{
        title: 'Project Name',
        dataIndex: 'project_name',
        key: 'pro_name',
        }, {
        title: 'SVN Address',
        dataIndex: 'svn_url',
        key: 'svn_url',
        },{
            title: 'Container Name',
            dataIndex: 'ctr_name',
            key: 'ctr_name',
        },{
        title: 'Container ID',
        dataIndex: 'ctr_id',
        key: 'ctr_id',
        },{
        title: 'Access Port',
        dataIndex: 'ctr_port',
        key: 'ctr_port',
        render: ctr_port => (
            <span>
                {<Tag color={'blue'} key={ctr_port}><a href={"http://192.168.5.252:"+ctr_port} target='_'>{ctr_port}</a></Tag>}
            </span>
        ),
        }, {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: status => (
            <span>
            {<Tag color={status===0 ? 'red':'green'} key={status}>{status===0 ? 'Stoped':'Running'}</Tag>}
            </span>
        ),
        }, {
        title: 'Action',
        key: 'action',
        render: (record) => (
            <span>
            <Button type="primary" onClick={this.handleClickStart.bind(this,record)} ghost>Start</Button>
            <Divider type="vertical" />
            <Button type="primary" onClick={this.handleClickStop.bind(this,record)} ghost>Stop</Button>
            <Divider type="vertical" />
            <Button type="danger" onClick={this.handleClickDelete.bind(this,record)} ghost>Delete</Button>
            </span>
        ),
        }]; 
    constructor (props) {
        super(props);
        this.props.service.list();  
        // this.setState({status:true});
    }
    state={
        value:''
    }

    handleClickStart(event) {
        // const socket = io.connect('http://localhost:5000/test1');
        const socket = io('http://localhost:5000/test1',{autoConnect: false});
        // console.log('eeeeeee')
        // const container_id = event['ctr_id'];
        // // this.props.service.container(container_id);
        // // return (<Mod />);
        // // return () => (<div><h1>ttt</h1></div>);
        // // alert('eee')
        // history.push({pathname:'/app/docker/list/log'});value={this.state.value}
        // history.push({pathname:'/login'})
        confirm({
            title: '镜像日志'+'\t\t'+'项目名称: '+ event['project_name'] +'\t\t'+ '端口: ' + event['ctr_port'],
            content: (<div>
                <TextArea rows={4} value={this.state.value} type="textarea" style={{margin: '5px 5px',padding: 10,minHeight:"530px" ,maxWidth:"1400px"}} />     
                </div>),
            okText:"获取日志",
            cancelText:"关闭",
            style:{width:500},
            className:'logs',
            // closable:true,
            // visible:false,
            onOk: () => {
                socket.connect();
                socket.emit('log_message',{'ctr_id':event['ctr_id']},(data) => {console.log('data-----------',data); this.setState({value:data});console.log(this.state.value)})
                // socket.on('recv_message',(data) => {console.log('data-----------',data); this.setState({value:data});})
                
            //   const container_id = event.ctr_id;
            //   const action = 'start'
            // //   // console.log(action,container_id)
            //   this.props.service.container(action,container_id);//需要测试this是否能够接收到
                return new Promise((resolve, reject)=>{
                    reject();
                })
            },
            onCancel: () => {
                socket.disconnect()
                socket.close()
            },
          });
    }
    handleClickStop(event) {
        const container_id = event.ctr_id;
        const action = 'stop';
        this.props.service.container(action,container_id);
    }
    handleClickDelete(event) {
        confirm({
          title: '镜像删除确认',
          content: '',
          onOk: () => {
            const container_id = event.ctr_id;
            const action = 'delete'
            // console.log(action,container_id)
            this.props.service.container(action,container_id);//需要测试this是否能够接收到
          },
          onCancel() {},
        });        
    }
    state = {
        dataSource :[]
    }
    handleList(){
        const data = [...this.props.service.postlist];
        this.props.service.list();
        this.setState({
            dataSource : data,
          });
    }
    render() {
        const data = this.state.dataSource
        const data1 = data===[]?this.state.dataSource:[...this.props.service.postlist]
        return (
            <div>
                <BreadcrumbCustom paths={['首页','Docker列表']}/>
                {/* <L/> */}
                {/* <div> */}
                <Button type="primary" onClick={this.handleList.bind(this)}>点击刷新列表</Button>
                <br/>
                <Table columns={this.columns} dataSource={data1} rowKey={data1 => data1.ctr_id} />
                {/* </div> */}
            </div>
        );
        
    }
}
