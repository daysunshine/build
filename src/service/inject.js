import React from 'react';

/**自定义的装饰器为组件添加一个可调用的类方法 */

const inject = obj => Component => props => <Component {...obj} {...props} />; 
//无状态组件  须有props得传进去 service=userService 
// service名称不能改变，后面的要用，就得是service名称
export default inject;
