import React from 'react';



/*
  1.安装：yarn add react-router-dom
  2.导入路由组件：Router / Route / Link
  3.在 pages 文件夹中创建 Home/index.js 和 CityList/index.js 两个组件(页面)
  4.使用 Route 组件配置首页和城市选择页面
*/

import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'

// 导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
// 房源详情组件
import HouseDetail from './pages/HouseDetail'
// 登录
import Login from './pages/Login'
import Registe from './pages/Registe'

// 房源发布
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'

// 路由访问控制组件
import AuthRoute from './components/AuthRoute'

// 导入要使用的组件
import { Button } from 'antd-mobile'

function App() {
  return (
    <Router>
      <div className="App">
    

        {/* 默认路由匹配时，跳转到 /home 实现路由重定到首页 */}
        <Route exact path="/" render={() => <Redirect to="/home" />} />

        {/* 配置路由 */}
        {/* Home组件是父路由的内容 */}
        <Route path="/home" component={Home}></Route> 
        <Route path="/citylist" component={CityList}></Route> 
        <Route path="/map" component={Map}></Route>

        {/* 房源详情的路由规则： */}
        <Route path="/detail/:id" component={HouseDetail} />
        <Route path="/login" component={Login} />
        <Route path="/registe" component={Registe} />

        {/* 配置登录后，才能访问的页面 */}
        <AuthRoute exact path="/rent" component={Rent} />
        <AuthRoute path="/rent/add" component={RentAdd} />
        <AuthRoute path="/rent/search" component={RentSearch} />
      </div>
    </Router>  
  );
}

export default App;
