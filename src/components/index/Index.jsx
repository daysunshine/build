import React, { Component } from 'react'; 
// import BreadcrumbCustom from '../common/BreadcrumbCustom';
// import { Button } from 'antd';
// import zysoft from '../../style/img/avatar.jpg';
import './index.less';
// import CountUp from 'react-countup';
// import ReactEcharts from 'echarts-for-react';
import { Carousel } from 'antd';
import 'antd/lib/carousel/style';


export default class MIndex extends Component {
    

    render() {
        return (
            <div className='mindex'>
                <div>
                {/* <BreadcrumbCustom paths={['首页']}/>  */}
                </div>
                <Carousel className='carousel' autoplay dotPosition='bottom' >
                    <div className='bg1'/> 
                    <div className='bg2'/>
                </Carousel>

            </div>
        )
    }
}
   