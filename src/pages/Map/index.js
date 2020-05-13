import React from 'react'

// 导入axios
// import axios from 'axios'
import { API } from '../../utils/api'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'

// 导入BASE_URL
import { BASE_URL } from '../../utils/url'

// 导入封装好的 NavHeader 组件
import NavHeader from '../../components/NavHeader'

// 导入 HouseItem 组件
import HouseItem from '../../components/HouseItem'

// 导入样式
// import './index.scss'
import styles from './index.module.css'

// 解决脚手架中全局变量访问的问题
const BMap = window.BMap

// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class Map extends React.Component {
    state = {
        // 小区下的房源列表
        housesList: [],
        // 表示是否展示房源列表
        isShowList: false
    }

    componentDidMount() {
        this.initMap()
    }

    // 初始化地图
    initMap() {
        /* 
      1 获取当前定位城市。
      2 使用地址解析器解析当前城市坐标。
      3 调用 centerAndZoom() 方法在地图中展示当前城市，并设置缩放级别为11。
      4 在地图中展示该城市，并添加比例尺和平移缩放控件。
      */

        // 获取当前定位城市,JSON.parse转化成一个对象
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        // 初始化地图实例
        // 注意： 在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
        const map = new BMap.Map('container')

        // 作用：能够在其他方法中通过 this 来获取到地图对象
        this.map = map
        // 设置中心点坐标
        const point = new BMap.Point(116.404, 39.915)

        console.log(label, value)
        // 创建地址解析器实例
        const myGeo = new BMap.Geocoder()
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
            label,
            async point => {
                if (point) {
                    //  初始化地图
                    map.centerAndZoom(point, 11)
                    // map.addOverlay(new BMap.Marker(point))

                    // 添加常用控件
                    map.addControl(new BMap.NavigationControl())
                    map.addControl(new BMap.ScaleControl())
                    // 调用 renderOverlays 方法
                    this.renderOverlays(value)

                    /* 
                    1 调用 Label 的 setContent() 方法，传入 HTML 结构，修改 HTML 内容的样式。
                    2 调用 setStyle() 修改覆盖物样式。
                    3 给文本覆盖物添加单击事件。
        
                    <div class="${styles.bubble}">
                      <p class="${styles.name}">${name}</p>
                      <p>${num}套</p>
                    </div>
                  */

                    /* 
                      1 创建 Label 实例对象。
                      2 调用 setStyle() 方法设置样式。
                      3 在 map 对象上调用 addOverlay() 方法，将文本覆盖物添加到地图中。
                    */

                    /* 
                      1 获取房源数据。
                      2 遍历数据，创建覆盖物，给每个覆盖物添加唯一标识（后面要用）。
                      3 给覆盖物添加单击事件。
                      4 在单击事件中，获取到当前单击项的唯一标识。
                      5 放大地图（级别为13），调用 clearOverlays() 方法清除当前覆盖物。
                    */
                    /* const res = await axios.get(
                        `http://118.190.160.53:8009/area/map?id=${value}`
                    )

                    console.log('房源数据：', res)

                    res.data.body.forEach(item => {

                        // 为每一条数据创建覆盖物
                        const {
                            coord: { longitude, latitude },
                            label: areaName,
                            count,
                            value
                        } = item;

                        const areaPoint = new BMap.Point(longitude, latitude)
                        // 说明：设置 setContent 后，第一个参数中设置的文本内容就失效了，因此，直接清空即可
                        // 创建覆盖物
                        const label = new BMap.Label('', {

                            position: areaPoint,
                            offset: new BMap.Size(-35, -35)
                        })

                        // 给 label 对象添加一个唯一标识
                        label.id = value

                        // 设置房源覆盖物内容
                        label.setContent(`
                            <div class="${styles.bubble}">
                                <p class="${styles.name}">浦东</p>
                                <p>9${count}套</p>
                            </div>
                        `)

                        // 设置样式
                        label.setStyle(labelStyle)

                        // 添加单击事件
                        label.addEventListener('click', () => {
                            console.log('房源覆盖物被点击了', label.id)

                            // 放大地图，以当前点击的覆盖物为中心放大地图
                            // 第一个参数：坐标对象
                            // 第二个参数：放大级别
                            map.centerAndZoom(areaPoint, 13)
                            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
                            setTimeout(() => {
                                // 清除当前覆盖物信息
                                map.clearOverlays()
                            }, 0)
                        })

                        // 添加覆盖物到地图中
                        map.addOverlay(label)
                    }); */
                }
            },
            label
        )

        // 给地图绑定移动事件
        map.addEventListener('movestart', () => {
            // console.log('movestart')
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }
        })

        // 初始化地图
        // map.centerAndZoom(point, 15)
    }

    // 渲染覆盖物入口
    // 1 接收区域 id 参数，获取该区域下的房源数据
    // 2 获取房源类型以及下级地图缩放级别
    async renderOverlays(id) {
        try {
            // 开启loading
            Toast.loading('加载中...', 0, null, false)

            const res = await API.get(`/area/map?id=${id}`)
            // console.log('renderOverlays 获取到的数据：', res)
            // 关闭 loading
            Toast.hide()
            const data = res.data.body

            // 调用 getTypeAndZoom 方法获取级别和类型
            const { nextZoom, type } = this.getTypeAndZoom()

            data.forEach(item => {
                // 创建覆盖物
                this.createOverlays(item, nextZoom, type)
            })
        } catch (e) {
            // 关闭 loading
            Toast.hide()
        }
    }

    // 计算要绘制的覆盖物类型和下一个缩放级别
    // 区   -> 11 ，范围：>=10 <12
    // 镇   -> 13 ，范围：>=12 <14
    // 小区 -> 15 ，范围：>=14 <16
    getTypeAndZoom() {
        // 调用地图的 getZoom() 方法，来获取当前缩放级别
        const zoom = this.map.getZoom()
        // console.log('当前地图缩放级别：', zoom)
        let nextZoom, type

        // console.log('当前地图缩放级别：', zoom)
        if (zoom >= 10 && zoom < 12) {
            // 区
            // 下一个缩放级别
            nextZoom = 13
            // circle 表示绘制圆形覆盖物（区、镇）
            type = 'circle'
        } else if (zoom >= 12 && zoom < 14) {
            // 镇
            nextZoom = 15
            type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
            // 小区
            type = 'rect'
        }
        return {
            nextZoom,
            type
        }
    }

    // 创建覆盖物
    createOverlays(data, zoom, type) {
        const {
            coord: { longitude, latitude },
            label: areaName,
            count,
            value
        } = data

        // 创建坐标对象
        const areaPoint = new BMap.Point(longitude, latitude)

        if (type === 'circle') {
            // 区或镇
            this.createCircle(areaPoint, areaName, count, value, zoom)
        } else {
            // 小区
            this.createRect(areaPoint, areaName, count, value)
        }
    }

    // 创建区、镇覆盖物
    createCircle(point, name, count, id, zoom) {
        // 创建覆盖物
        const label = new BMap.Label('', {
            position: point,
            offset: new BMap.Size(-35, -35)
        })

        // 给 label 对象添加一个唯一标识
        label.id = id

        // 设置房源覆盖物内容
        label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${name}</p>
        <p>${count}套</p>
      </div>
    `)

        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', () => {
            // 调用 renderOverlays 方法，获取该区域下的房源数据
            this.renderOverlays(id)

            // 放大地图，以当前点击的覆盖物为中心放大地图
            this.map.centerAndZoom(point, zoom)

            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
            setTimeout(() => {
                // 清除当前覆盖物信息
                this.map.clearOverlays()
            }, 0)
        })

        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }

    // 创建小区覆盖物
    createRect(point, name, count, id) {
        // 创建覆盖物
        const label = new BMap.Label('', {
            position: point,
            offset: new BMap.Size(-50, -28)
        })

        // 给 label 对象添加一个唯一标识
        label.id = id

        // 设置房源覆盖物内容
        label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', e => {
            /* 
              1 创建 Label 、设置样式、设置 HTML 内容，绑定单击事件。
              
              2 在单击事件中，获取该小区的房源数据。
              3 展示房源列表。
              4 渲染获取到的房源数据。
      
              5 调用地图 panBy() 方法，移动地图到中间位置。
                公式：
                垂直位移：(window.innerHeight - 330) / 2 - target.clientY
                水平平移：window.innerWidth / 2 - target.clientX
              6 监听地图 movestart 事件，在地图移动时隐藏房源列表。
            */

            this.getHousesList(id)
            console.log(e)
            // 获取当前被点击项
            const target = e.changedTouches[0]
            this.map.panBy(
                window.innerWidth / 2 - target.clientX,
                (window.innerHeight - 330) / 2 - target.clientY
            )
            // console.log('小区被点击了')
        })

        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }

    // 获取小区房源数据
    async getHousesList(id) {
        try {
            // 开启loading
            Toast.loading('加载中...', 0, null, false)
            const res = await API.get(`/houses?cityId=${id}`)
            // 关闭 loading
            Toast.hide()
            // console.log('小区的房源数据:', res)
            this.setState({
                housesList: res.data.body.list,

                // 展示房源列表
                isShowList: true
            })
        } catch (e) {
            // 关闭 loading
            Toast.hide()
        }
    }

    // 封装渲染房屋列表的方法
    renderHousesList() {
        return this.state.housesList.map(item => (
            <HouseItem
                key={item.houseCode}
                src={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
            />
        ))
        {/* <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                    <img
                        className={styles.img}
                        src={BASE_URL + item.houseImg}
                        alt=""
                    />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <div className={styles.desc}>{item.desc}</div>
                    <div>
                         ['近地铁', '随时看房'] 
                        {item.tags.map((tag, index) => {
                            const tagClass = 'tag' + (index + 1)
                            return (
                                <span
                                    className={[styles.tag, styles[tagClass]].join(' ')}
                                    key={tag}
                                >
                                    {tag}
                                </span>
                            )
                        })}
                    </div>
                    <div className={styles.price}>
                        <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
                </div>
            </div> */}
    }


    render() {
        return <div className={styles.map}>
            {/* 顶部导航栏组件 */}
            <NavHeader>地图找房</NavHeader>
            {/* 地图容器元素 */}
            <div id="container" className={styles.container} />

            {/* 房源列表 */}
            {/* 添加 styles.show 展示房屋列表 */}
            <div
                className={[
                    styles.houseList,
                    this.state.isShowList ? styles.show : ''
                ].join(' ')}
            >
                <div className={styles.titleWrap}>
                    <h1 className={styles.listTitle}>房屋列表</h1>
                    <Link className={styles.titleMore} to="/home/list">
                        更多房源
            </Link>
                </div>

                <div className={styles.houseItems}>
                    {/* 房屋结构 */}
                    {this.renderHousesList()}
                </div>
            </div>

        </div>
    }
}