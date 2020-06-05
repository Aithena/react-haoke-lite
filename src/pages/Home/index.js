import React, { lazy } from 'react'
// 2.1导入路由
import { Route } from 'react-router-dom'
// 导入TabBar
import { TabBar } from 'antd-mobile';

// 导入组件自己的样式文件
import './index.css'

// 2.2 导入News组件
import Index from '../Index'
// import News from '../News'
// import HouseList from '../HouseList'
// import Profile from '../Profile'

const News = lazy(() => import('../News'))
const HouseList = lazy(() => import('../HouseList'))
const Profile = lazy(() => import('../Profile'))

/*
    1. 在 pages 文件夹中创建 News/index.js组件 
    2. 在 Home 组件中，添加一个Route 作为子路由（嵌套的路由）的出口 
    3. 设置嵌套路由的path，格式以父路由 path 开头（父组件展示，子组件才会展示） 
*/




// TarBar 数据
const tabItems = [ 
    { title: '首页', icon: 'icon-ind', path: '/home' },
    { title: '找房', icon: 'icon-findHouse', path: '/home/list' },
    { title: '资讯', icon: 'icon-infom', path: '/home/news' },
    { title: '我的', icon: 'icon-my', path: '/home/profile' }
 ]

/* 
 问题：点击首页导航菜单，导航到找房列表页面时，找房菜单没有高亮 
 原因： 原来我们实现该功能的时候，只考虑了点击以及第一次加载 Home 组件的情况。但是，我们没有
 考虑不重新加载 Home 组件时的路由切换，因为，这种情况下，我们的代码没有覆盖到
 解决：
    思路： 在路由切换时，也执行菜单高亮的逻辑代码
    1 添加 componentDidUpdate 钩子函数
    2 在钩子函数中判断路由地址是否切换 (因为路由的信息时通过 props 传递给组件的，所以，通过比较
    更新前后的两个props)
    3 在路由地址切换时，让菜单高亮
*/
 
export default class Home extends React.Component {
    state = {
        // 默认选中的TabBar菜单项
        selectedTab: this.props.location.pathname,
    };

    componentDidUpdate(prevProps,) {
        // console.log('上一次的路由信息', prevProps)
        // console.log('当前的路由信息', this.props)
        if (prevProps.location.pathname !== this.props.location.pathname) {
            // 此时，就说明路由发生切换了
            this.setState({
                selectedTab: this.props.location.pathname
            })
        }
    }

    // 渲染TabBar.Item
    renderTabBarItem() {
        return tabItems.map(item => 
            <TabBar.Item
            title={item.title}
            key={item.title}
            icon={
                <i className={`iconfont ${item.icon}`} />
            }
            selectedIcon={
                <i className={`iconfont ${item.icon}`}/>
            }
            selected={this.state.selectedTab === item.path }
            onPress={() => {
                this.setState({
                    selectedTab: item.path,
                });
                // 路由切换
                this.props.history.push(item.path)
            }}
        >
        </TabBar.Item>
        )}

    render() {
        return (
        <div className="home">
            
            {/* 2.3 渲染子路由 */}
            <Route path="/home/news" component={News}></Route>
            <Route exact path="/home" component={Index}></Route>
            <Route path="/home/list" component={HouseList}></Route>
            <Route path="/home/profile" component={Profile}></Route>
            
            {/* TarBar */}
                <TabBar
                    unselectedTintColor="#888"
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent={true}
                >
                    {this.renderTabBarItem()}
                </TabBar>
            </div>
        )}
}