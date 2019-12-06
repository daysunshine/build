import React,{Component} from 'react';
import postService from '../../service/post';
import BreadcrumbCustom from "../common/BreadcrumbCustom";
import {observer} from 'mobx-react';
import inject from '../../service/inject';
// import tt from 'tt.docx';
// import { message } from 'antd';

// import 'antd/lib/message/style';
// import { Button,Table, Divider, Tag } from 'antd';
// import 'antd/lib/button/style';
// import 'antd/lib/table/style';
// import 'antd/lib/divider/style';
// import 'antd/lib/tag/style';
import { Tabs,Button } from 'antd';
import 'antd/lib/tabs/style';

//$$$$$$$$$
import io from 'socket.io-client';

//$$$$$$$$$$$

const TabPane = Tabs.TabPane;

const service = postService;
@observer
@inject({service})
export default class Build extends Component {
    
    handleSend() {
        // socket.emit('send messages!!!')
        // const socket = io.connect('http://localhost:5000/test1');
        console.log('send---------')
        // socket.emit('message','send messages!!!')
        // socket.disconnect()
        // socket.send('send messages!!!')
    }

    // handleClose() {
    //     socket.disconnect()
    //     socket.close()
    // }

    render () {
        
        return(
            <div>
                <BreadcrumbCustom paths={['首页','Docker构建']}/>
                {/* <DockerBuild/> */}
                <Tabs type="card">
                    <TabPane tab="上传镜像部署" key="1">组件1</TabPane>
                    <TabPane tab="SVN" key="2">组件2</TabPane>
                    <TabPane tab="三" key="3">
                        <Button type="primary" onClick={this.handleSend.bind(this)}>点击发送消息</Button>
                        {/* <Button type="primary" onClick={this.handleClose.bind(this)}>点击关闭socket</Button> */}
                    </TabPane>
                </Tabs>

            </div>
        );
    }


}


