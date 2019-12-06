import React, {Component} from 'react';
import BreadcrumbCustom from "../common/BreadcrumbCustom";
import { Row, Col } from 'antd';
import Local from "./Local";
// import Qiniu from "./Qiniu";


export default class UploadEditor extends Component {
    render() {
        return (
            <div>
                <BreadcrumbCustom paths={['首页','容器测试']}/>
                <Row gutter={16}>
                    <Col md={12}>
                        <h3>本地文件上传</h3>
                        <Local/>
                    </Col>
                </Row>
            </div>
        );
    }
}