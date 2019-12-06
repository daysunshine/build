import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class SiderCustom extends Component{
    constructor(props){
        super(props);
        const { collapsed }= props;
        this.state = {
            collapsed: collapsed,
            firstHide: true, //第一次先隐藏暴露的子菜单
            selectedKey: '', //选择的路径
            openKey: '', //打开的路径（选择的上一层）
        }
    }
    componentDidMount() {
        this.setMenuOpen(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps);
    }
    setMenuOpen = props => {
        const {path} = props;
        this.setState({
            openKey: path.substr(0, path.lastIndexOf('/')),
            selectedKey: path
        });
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    render(){
        const { collapsed, firstHide, openKey, selectedKey } = this.state;
        return(
            <Sider
            trigger={null}
            collapsed={collapsed}
            >
                <div className="logo" style={collapsed?{backgroundSize:'70%'}:{backgroundSize:'30%'}}/>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={this.menuClick}
                    onOpenChange={this.openMenu}
                    openKeys={firstHide ? null : [openKey]}
                >

                    <Menu.Item key={"/app"}>
                        <Link to={"/app"}><Icon type="home" /><span>首页</span></Link>
                    </Menu.Item>
                    <Menu.Item key={"/app/form"}>
                        <Link to={"/app/form"}><Icon type="form" /><span>项目构建</span></Link>
                    </Menu.Item>                    
                    {/* <SubMenu
                    key="/app/docker"
                    title={<span><Icon type="container" /><span>容器</span></span>}
                    >
                    <Menu.Item key="/app/docker/surl">
                        <Link to={'/app/docker/surl'}><Icon type="ordered-list" /><span>SVN列表</span></Link>
                    </Menu.Item>
                    <Menu.Item key="/app/docker/list">
                        <Link to={'/app/docker/list'}><Icon type="unordered-list" /><span>Docker列表</span></Link>
                    </Menu.Item>
                    <Menu.Item key="/app/docker/build">
                        <Link to={'/app/docker/build'}><Icon type="build" /><span>Docker构建</span></Link>
                    </Menu.Item>
                    </SubMenu>
                    <SubMenu
                    key="/app/chart"
                    title={<span><Icon type="area-chart" /><span>图表</span></span>}
                    >
                        <Menu.Item key="/app/chart/echarts">
                            <Link to={'/app/chart/echarts'}><span>echarts</span></Link>
                        </Menu.Item>
                    </SubMenu> */}
                    {/*<Menu.Item key="/app/richText">
                        <Link to={'/app/richText'}><Icon type="edit" /><span>富文本</span></Link>
                    </Menu.Item>*/}
                    {/* <Menu.Item key="/app/upload">
                        <Link to={'/app/upload'}><Icon type="upload" /><span>上传</span></Link>
                    </Menu.Item> 
                    <Menu.Item key="/app/docker/list/log">
                        <Link to={'/app/docker/list/log'}><Icon type="upload" /><span>lg</span></Link>
                    </Menu.Item> */}
                </Menu>
            </Sider>
        )
    }
}