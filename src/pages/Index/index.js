import React from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
// 导入axios
import axios from 'axios' 

// 导入
import { BASE_URL } from '../../utils/url'

// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导入样式文件
import './index.scss'

// 导入utils中获取定位城市的方法
import {  getCurrentCity } from '../../utils'

// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'

const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/home/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent/add'
  },
]

/* 
  轮播图存在的两个问题:
  1 不会自动播放
  2 从其他路由返回的时候，高度不够

  原因： 轮播图数据是动态加载的，加载完成前后轮播图数量不一致
  如何解决？？？
  1 在state中添加表示轮播图加载完成的数据
  2 在轮播图数据加载完成时，修改该数据状态值为true
  3 只有在轮播图数据加载完成的情况下，才渲染轮播图组件
*/

// 获取地理位置信息
navigator.geolocation.getCurrentPosition(position => {
  console.log('当前位置信息：', position)
})


export default class Index extends React.Component { 
    state = {
        // 轮播图状态数据
        swipers: [],
        isSwiperLoaded: false,

        // 租房小组数据
        groups: [],
        // 最新资讯
        news: [],
        // 当前城市名称
        curCityName: '长沙'
      }

      // 获取轮播图数据的方法
      async getSwipers() {
        const res = await axios.get('http://118.190.160.53:8009/home/swiper')
        // console.log('轮播图数据为：',res)
        this.setState({
          swipers: res.data.body,
          isSwiperLoaded: true
        })
        // this.setState(() => {
        //   return {
        //     swipers: res.data.body
        //   }
        // })
      }

      // 获取租房小组数据的方法
      async getGroups() {
        const res = await axios.get('http://118.190.160.53:8009/home/groups',{
          params: {
            area: 'AREA%7C88cff55c-aaa4-e2e0'
          }
        })
        // console.log(res)
        this.setState({
          groups: res.data.body
        })
      }

      // 获取最新资讯
      async getNews() {
        const res = await axios.get(
          'http://118.190.160.53:8009/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
        )
        // console.log(res)
        this.setState({
          news: res.data.body
        })
      }

      async componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNews()

        // 2 通过 IP 定位获取到当前城市名称。
       /*  const curCity = new window.BMap.LocalCity()
        curCity.get(async res => {
          // console.log('当前城市信息：', res)
          const result = await axios.get(
            `http://118.190.160.53:8009/area/info?name=${res.name}`
          ) 
          // console.log(result)
          this.setState({
            curCityName: result.data.body.label
          })
        }) */
        const curCity = await getCurrentCity()
        this.setState({
          curCityName: curCity.label
        })
      }

      // 渲染轮播图结构,把逻辑抽离到方法里面来
      renderSwipers(){
        return this.state.swipers.map(item => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{ display: 'inline-block', width: '100%', height: 212 }}
          >
            <img
              src={BASE_URL +  item.imgSrc}
              alt="" 
              style={{ width: '100%', verticalAlign: 'top' }}
            />
          </a>
        ))
      }

      // 渲染导航菜单
      renderNavs() {
        return navs.map(item => 
          <Flex.Item key={item.id} onClick={() => 
          this.props.history.push(item.path)}>
            <img src={item.img} alt=""/>
            <h2>{item.title}</h2>
          </Flex.Item>
        )
      }

      // 渲染最新资讯
      renderNews() {
        return this.state.news.map(item => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img 
              className="img"
              src={`http://118.190.160.53:8009${item.imgSrc}`} alt=""/>
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))
      }

      render() {
        return (
          <div className="index">
            {/* 轮播图 */}
            <div className="swiper">
              {
                this.state.isSwiperLoaded ? (
                <Carousel autoplay infinite autoplayInterval={5000}
              >
                {this.renderSwipers()}
              </Carousel>
              ) : (
                ''
              )}

              {/* 搜索框 */}
              <SearchHeader cityName={this.state.curCityName}></SearchHeader>

            </div>

            {/* 导航菜单 */}
            <Flex className="nav">
                {this.renderNavs()}
            </Flex>

            {/* 租房小组 */}
            <div className="group">
              <h3 className="group-title">
                租房小组 <span className="more">更多</span>
              </h3>

              {/* 宫格组件 */}
              <Grid data={this.state.groups} 
                columnNum={2}
                square={false}
                hasLine={false}
                renderItem={(item) => (
                  <Flex className="group-item" justify="around" key={item.id}>
                    <div className="desc">
                      <p className="title">{item.title}</p>
                      <span className="info">{item.desc}</span> 
                    </div>
                    <img src={`http://118.190.160.53:8009${item.imgSrc}`} alt=""/>
                  </Flex>
                )
              }
              ></Grid>    
             </div>

            {/* 最新资讯 */}
            <div className="news">
              <h3 className="group-title">最新资讯</h3>
              <WingBlank size='md'>{this.renderNews()}</WingBlank>
            </div>
           

          </div>
        );
      }
}