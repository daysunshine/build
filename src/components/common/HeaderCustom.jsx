import React, { Component } from 'react';
import { Layout, Icon, Menu, Badge } from 'antd';
import { Link } from 'react-router-dom';
import history from './history';
import { Redirect } from 'react-router-dom';
const { Header } = Layout;
const SubMenu = Menu.SubMenu;

export default class HeaderCustom extends Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: props.collapsed,
        }
        this.logout = this.logout.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
        });
    };
    logout(){
        sessionStorage.removeItem("mspa_user","mspa_token");
        // localStorage.removeItem("mspa_token");
        history.push('/login');
    }
    render(){
        return(
            <Header style={{ background: '#fff', padding: 0 }} className="header">
                <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.props.toggle}
                />
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                >
                    <Menu.Item key="schedule">
                        <Link to="/app/header/Calendars">
                            <Badge count={0} overflowCount={99} style={{height:'15px',lineHeight:'15px'}}>
                                <Icon type="schedule" style={{fontSize:16, color: '#1DA57A' }}/>
                            </Badge>
                        </Link>
                    </Menu.Item>
                    <SubMenu 
                        title={<span>
                            <Icon type="user" style={{fontSize:16, color: '#1DA57A' }}/>{this.props.username}
                        </span>}
                        >
                        <Menu.Item key="chgpwd" style={{textAlign:'center'}} className="chgpwd">
                            <Link to="/app/user/changepwd">
                            <Icon type="edit"/>修改密码
                            </Link>
                            {/* <span onClick={this.logout}>修改密码</span> */}
                        </Menu.Item>
                        <Menu.Item key="logout" style={{textAlign:'center'}} className="logout">
                            <span onClick={this.logout}><Icon type="logout" />退出登录</span>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Header>
        )
    }
} 