import React from 'react'

import { Flex, Toast } from 'antd-mobile'

import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'


import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'
import { getCurrentCity } from '../../utils'

// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
// 导入吸顶组件
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'
// 导入样式
import styles from './index.module.css'

/* 
  切换城市显示房源：

  原因：在组件外部的代码只会在项目加载时执行一次（刷新页面）。在切换路由时，不会重新重新执行。

       组件内部的 componentDidMount() 会在组件展示时执行，进入页面一次，执行一次。

  1 注释掉 获取当前定位城市信息 的代码。
  2 导入 utils 中的 getCurrentCity 方法。
  3 在 componentDidMount 中调用 getCurrentCity() 方法来获取当前定位城市信息。
  4 将 label 和 value 保存到 this 中。
  5 用到 label 和 value 的地方，使用 this.label 或 this.value 来访问。
*/
// console.log('HouseList')

// 获取当前定位城市信息
// const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

/*
  1 在找房页面 SearchHeader 组件基础上，调整结构（添加返回icon等）。
  2 给 SearchHeader 组件传递 className 属性，来调整组件样式，让其适应找房页面效果。
*/

export default class HouseList extends React.Component {
  /* 
  1 将筛选条件数据 filters 传递给父组件 HouseList。
  2 HouseList 组件中，创建方法 onFilter，通过参数接收 filters 数据，并存储到 this 中。
  3 创建方法 searchHouseList（用来获取房屋列表数据）。
  4 根据接口，获取当前定位城市 id 参数。
  5 将筛选条件数据与分页数据合并后，作为接口的参数，发送请求，获取房屋数据。
*/

  state = {
    // 列表数据
    list: [],
    // 总条数
    count: 0,
    // 数据是否加载中
    isLoading: false
  }

  // 初始化默认值
  label = ''
  value = ''
  // 初始化实例属性
  filters = {}

  async componentDidMount() {
    // console.log('HouseList -> did mount')
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value

    this.searchHouseList()
  }

  /* 
    开启加载中提示和加载完成提示：

    1 导入 Toast 组件。
    2 在发送请求前使用 Toast.loading() 方法，开启 loading 效果。
    3 请求完成时，调用 Toast.hide() 关闭 loading 效果。
    4 请求完成时，调用 Toast.info() 提示查找到的房源数量。
      说明：如果 count 为 0，就不再弹框提示，而是使用 找不到房源时的提示。
  */

  // 用来获取房屋列表数据
  async searchHouseList() {
    // 获取当前定位城市id
    this.setState({
      isLoading: true
    })
    // 开启loading
    Toast.loading('加载中...', 0, null, false)
    // const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get('/houses', {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })

    console.log(res)

    const { list, count } = res.data.body
    // 关闭loading
    Toast.hide()
    console.log(res)

    // 提示房源数量
    // 解决了没有房源数据时，也弹窗提示的bug
    if (count !== 0) {
      Toast.info(`共找到 ${count} 套房源`, 2, null, false)
    }
    this.setState({
      list,
      count,
      // 数据加载完成的状态
      isLoading: false
    })
  }


  // 接收 Filter 组件中的筛选条件数据
  onFilter = filters => {
    // 返回页面顶部
    window.scrollTo(0, 0)
    this.filters = filters

    // console.log('HouseList：', this.filters)

    // 调用获取房屋数据的方法
    this.searchHouseList()
  }

  /* 
1 封装 HouseItem 组件，实现 Map 和 HouseList 页面中，房屋列表项的复用。
2 使用 HouseItem 组件改造 Map 组件的房屋列表项。
3 使用 react-virtualized 的 List 组件渲染房屋列表（参考 CityList 组件的使用）。
*/
  renderHouseList = ({ key, index, style }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state
    const house = list[index]
    // 判断 house 是否存在
    // 如果不存在，就渲染 loading 元素占位
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }

    console.log(house)

    return (
      <HouseItem
        key={key}
        onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
        // 注意：该组件中应该接收 style，然后给组件元素设置样式！！！
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    )
  }

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  /* 
    加载更多房屋列表数据：

    1 在 loadMoreRows 方法中，根据起始索引和结束索引，发送请求，获取更多房屋数据。
    2 获取到最新的数据后，与当前 list 中的数据合并，再更新 state，并调用 Promise 的 resolve()。
    3 在 renderHouseList 方法中，判断 house 是否存在。
    4 不存在的时候，就渲染一个 loading 元素（防止拿不到数据时报错）。
    5 存在的时候，再渲染 HouseItem 组件。
  */

  // 用来获取更多房屋列表数据
  // 注意：该方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve 让Promise对象的状态变为已完成。
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
    //   .then(response => {
    //     // Store response data in list...
    //   })
    console.log(startIndex, stopIndex)

    return new Promise(resolve => {
      API.get('/houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        // console.log('loadMoreRows：', res)
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })

        // 数据加载完成时，调用 resolve 即可
        resolve()
      })
    })
  }

  /* 
   找不到房源时的提示 实现步骤：

   1 在 state 中添加一个状态：isLoading 表示数据是否加载中。
   2 在发送请求之前，设置 isLoading 的值为 true，表示即将要加载数据了。
   3 在请求完成后，设置 isLoading 的值为 false，表示数据已经加载完成。
   4 导入 NoHouse 组件。
   5 封装 renderList 方法，来渲染房源列表。
   6 在方法中，判断查询到的房源数量为0，并且已经 count === 0 && !isLoading 时，
     提示： 没有找到相关的内容，请您换个搜索条件吧~
   7 否则，展示房源列表
 */

  // 渲染列表数据
  renderList() {
    const { count, isLoading } = this.state
    // 关键点：在数据加载完成后，再进行 count 的判断
    // 解决方式：如果数据加载中，则不展示 NoHouse 组件；而，但数据加载完成后，再展示 NoHouse 组件
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                    width={width} // 视口的宽度
                    height={height} // 视口的高度
                    rowCount={count} // List列表项的行数
                    rowHeight={120} // 每一行的高度
                    rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    const { count } = this.state
    return <div>
      <Flex className={styles.header}>
        <i className="iconfont icon-back"
          onClick={() => this.props.history.go(-1)}
        />
        <SearchHeader cityName={this.label} className={styles.searchHeader} />
      </Flex>

      {/* 条件筛选栏 */}
      <Sticky height={40}>
        <Filter onFilter={this.onFilter} />
      </Sticky>

      {/* 房屋列表 */}
      <div className={styles.houseItems}>{this.renderList()}</div>
    </div>
  }
}