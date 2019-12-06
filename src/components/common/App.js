import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../../style/index.less';

import SiderCustom from './SiderCustom';
import HeaderCustom from './HeaderCustom';
import MIndex from '../index/Index';
// import Calendars from '../header/Calendars';
// import Echarts from '../chart/echarts/Echarts';
import UForm from '../form/Form';
// import noMatch from './404';
// import RichText from "../richText/RichText";
// import UploadEditor from "../upload/UploadEditor";
// import Docker from "../docker/Docker";
// import Build from "../docker/Build";
// import Surl from "../docker/Surl";
import Chgpwd from './Chgpwd';
// import history from './history';

const {Content, Footer} = Layout;

export default class App extends Component {
    state = {
        collapsed: sessionStorage.getItem("mspa_SiderCollapsed") === "true",
    };
    toggle = () => {//是否收缩侧边栏，执行函数，改变当前state.collapsed状态，并将浏览器存储的状态一同改变
        this.setState({
            collapsed: !this.state.collapsed,
        }, function () {
            sessionStorage.setItem("mspa_SiderCollapsed", this.state.collapsed);
        });
    };

    componentDidMount() {
        //保存Sider收缩
        if (sessionStorage.getItem("mspa_SiderCollapsed") === null) {
            sessionStorage.setItem("mspa_SiderCollapsed", false);
        }
        // 关闭浏览器 清除登录信息
        // window.onbeforeunload = () => {
        //     sessionStorage.removeItem("mspa_user");
        //     sessionStorage.removeItem("mspa_token");
        // }
    }

    render() {
        const {collapsed} = this.state;
        const {location} = this.props;
        let name = 'test';
        if (sessionStorage.getItem("mspa_user") === null || sessionStorage.getItem("mspa_token") === null ) {//判断没有mspa_user跳转到登录页
            return <Redirect to="/login"/>
        } else {
            name = location.state === undefined ? JSON.parse(sessionStorage.getItem("mspa_user")) : location.state.username;
        }
        
        return (
            <Layout className="ant-layout-has-sider" style={{height: '100%'}}>
                <SiderCustom collapsed={collapsed} path={location.pathname}/>
                <Layout>
                    <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name}/>
                    <Content style={{margin: '0 16px'}}>
                        <Switch>
                            <Route exact path={'/app'} component={MIndex} />
                            <Route exact path={'/app/form'} component={UForm} />
                            {/* <Route exact path={'/app/header/Calendars'} component={Calendars} />
                            <Route exact path={'/app/chart/echarts'} component={Echarts} />
                            <Route exact path={'/app/upload'} component={UploadEditor} />
                            <Route exact path={'/app/docker/list'} component={Docker} />
                            <Route exact path={'/app/docker/build'} component={Build} />
                            <Route exact path={'/app/docker/surl'} component={Surl} /> */}
                            <Route exact path={'/app/user/changepwd'} component={Chgpwd} />
                            {/* <Route exact path={'/app/richText'} component={RichText} /> 
                             
                            <Route component={noMatch} /> */}
                        </Switch>
                    </Content>
                    <Footer className='footer' style={{textAlign: 'center'}}>
                        TEST ©2019-2019 Created by ymd
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
