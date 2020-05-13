import React, { Component } from 'react'

// 导入 Spring 组件
import { Spring } from 'react-spring/renderprops'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

// 导入自定义的axios
import { API } from '../../../../utils/api'

import styles from './index.module.css'

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

/* 
  控制 FilterPicker 组件的展示和隐藏：

  1 在 Filter 组件中，提供控制对话框展示或隐藏的状态： openType（表示展示的对话框类型）。
  2 在 render 中判断 openType 值为 area/mode/price 时，就展示 FilterPicker 组件，以及遮罩层。
  3 在 onTitleClick 方法中，修改状态 openType 为当前 type，展示对话框。
  4 在 Filter 组件中，提供 onCancel 方法，作为取消按钮和遮罩层的事件处理程序。
  5 在 onCancel 方法中，修改状态 openType 为空，隐藏对话框。
  6 将 onCancel 通过 props 传递给 FilterPicker 组件，在取消按钮的单击事件中调用该方法。
  7 在 Filter 组件中，提供 onSave 方法，作为确定按钮的事件处理程序，逻辑同上。
*/

// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

/* 
  设置默认选中值：

  1 在 Filter 组件中，提供选中值状态：selectedValues。
  2 根据 openType 获取到当前类型的选中值（defaultValue），通过 props 传递给 FilterPicker 组件。
  3 在 FilterPicker 组件中，将 defaultValue 设置为状态 value 的默认值。
  4 在点击确定按钮后，在父组件中更新当前 type 对应的 selectedValues 状态值。
*/

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
    openType: '',
    // 所有筛选条件数据
    filtersData: {},
    // 筛选条件的选中值
    selectedValues
  }

  /* 
    展示条件筛选对话框后，页面滚动问题：
    
    1 在 componentDidMount 中，获取到 body，并存储在this中（ htmlBody ）。
    2 在展示对话框的时候，给 body 添加类 body-fixed。
    3 在关闭对话框（取消或确定）的时候，移除 body 中的类 body-fixed。
  */
  componentDidMount() {
    // 获取到body
    this.htmlBody = document.body
    this.getFiltersData()
  }

  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)

    this.setState({
      filtersData: res.data.body
    })
  }

  /* 
    // 高亮：
    // selectedVal 表示当前 type 的选中值
    // 
    // 如果 type 为 area，此时，selectedVal.length !== 2 || selectedVal[0] !== 'area'，就表示已经有选中值
    // 如果 type 为 mode，此时，selectedVal[0] !== 'null'，就表示已经有选中值
    // 如果 type 为 price，此时，selectedVal[0] !== 'null'，就表示已经有选中值
    // 如果 type 为 more, ...

    实现步骤：

    1 在标题点击事件 onTitleClick 方法中，获取到两个状态：标题选中状态对象和筛选条件的选中值对象。
    2 根据当前标题选中状态对象，获取到一个新的标题选中状态对象（newTitleSelectedStatus）。
    3 使用 Object.keys() 方法，遍历标题选中状态对象。
    4 先判断是否为当前标题，如果是，直接让该标题选中状态为 true（高亮）。

    5 否则，分别判断每个标题的选中值是否与默认值相同。
    6 如果不同，则设置该标题的选中状态为 true。
    7 如果相同，则设置该标题的选中状态为 false。
    8 更新状态 titleSelectedStatus 的值为：newTitleSelectedStatus。
  */


  // 点击标题菜单实现高亮
  // 注意：this指向的问题！！！
  // 说明：要实现完整的功能，需要后续的组件配合完成！
  onTitleClick = type => {
    // 给 body 添加样式
    this.htmlBody.className = 'body-fixed'

    const { titleSelectedStatus, selectedValues } = this.state

    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    // 遍历标题选中状态对象
    // Object.keys() => ['area', 'mode', 'price', 'more']
    Object.keys(titleSelectedStatus).forEach(key => {
      // key 表示数组中的每一项，此处，就是每个标题的 type 值。
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true
        return
      }

      // 其他标题：
      const selectedVal = selectedValues[key]
      if (
        key === 'area' &&
        (selectedVal.length !== 2 || selectedVal[0] !== 'area')
      ) {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        // 高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {
        // 更多选择项 FilterMore 组件
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    // console.log('newTitleSelectedStatus：', newTitleSelectedStatus)

    this.setState({
      // 展示对话框
      openType: type,
      // 使用新的标题选中状态对象来更新
      titleSelectedStatus: newTitleSelectedStatus
    })

    /* this.setState(prevState => {
      return {
        titleSelectedStatus: {
          // 获取当前对象中所有属性的值
          ...prevState.titleSelectedStatus,
          [type]: true
        },
        // 展示对话框
        openType: type
      }
    }) */
  }

  /* 
      1 在 Filter 组件的 onTitleClick 方法中，添加 type 为 more 的判断条件。
      2 当选中值数组长度不为 0 时，表示 FilterMore 组件中有选中项，此时，设置选中状态高亮。
      3 在点击确定按钮时，根据参数 type 和 value，判断当前菜单是否高亮。
      4 在关闭对话框时（onCancel），根据 type 和当前type的选中值，判断当前菜单是否高亮。
        因为 onCancel 方法中，没有 type 参数，所以，就需要在调用 onCancel 方式时，来传递 type 参数。
    */

  // 取消（隐藏对话框）
  onCancel = type => {
    // 给 body 添加样式
    this.htmlBody.className = ''
    console.log('cancel:', type)
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    // 菜单高亮逻辑处理
    const selectedVal = selectedValues[type]
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    // 隐藏对话框
    this.setState({
      openType: '',
      // 更新菜单高亮状态数据
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  // 确定（隐藏对话框）
  onSave = (type, value) => {
    // 给 body 添加样式
    this.htmlBody.className = ''
    console.log(type, value)
    const { titleSelectedStatus } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 菜单高亮逻辑处理
    const selectedVal = value
    if (
      type === 'area' &&
      (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    /* 
      组装筛选条件：

      1 在 Filter 组件的 onSave 方法中，根据最新 selectedValues 组装筛选条件数据 filters。
      2 获取区域数据的参数名：area 或 subway（选中值数组的第一个元素）。
      3 获取区域数据的值（以最后一个 value 为准）。
      4 获取方式和租金的值（选中值的第一个元素）。
      5 获取筛选（more）的值（将选中值数组转化为以逗号分隔的字符串）。

      {
        area: 'AREA|67fad918-f2f8-59df', // 或 subway: '...'
        mode: 'true', // 或 'null'
        price: 'PRICE|2000',
        more: 'ORIEN|80795f1a-e32f-feb9,ROOM|d4a692e4-a177-37fd'
      }
    */
    const newSelectedValues = {
      ...this.state.selectedValues,
      // 只更新当前 type 对应的选中值
      [type]: value
    }

    console.log('最新的选中值：', newSelectedValues)

    const { area, mode, price, more } = newSelectedValues

    // 筛选条件数据
    const filters = {}

    // 区域
    const areaKey = area[0]
    console.log(areaKey)
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue

    // 方式和租金
    filters.mode = mode[0]
    filters.price = price[0]

    // 更多筛选条件 more
    filters.more = more.join(',')

    console.log(filters)

    // 调用父组件中的方法，来将筛选数据传递给父组件
    this.props.onFilter(filters)


    // 隐藏对话框
    this.setState({
      openType: '',

      // 更新菜单高亮状态数据
      titleSelectedStatus: newTitleSelectedStatus,

      selectedValues: newSelectedValues
    })
  }

  // 渲染 FilterPicker 组件的方法
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    // 根据 openType 来拿到当前筛选条件数据
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        // 获取到区域数据
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }

    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    )
  }

  /* 
    1 封装 renderFilterMore 方法，渲染 FilterMore 组件。
    2 从 filtersData 中，获取数据（roomType, oriented, floor, characteristic），通过 props 传递给 FilterMore 组件。
    3 FilterMore 组件中，通过 props 获取到数据，分别将数据传递给 renderFilters 方法。
    4 在 renderFilters 方法中，通过参数接收数据，遍历数据，渲染标签。
  */

  /* 
    设置默认选中值：

    1 在渲染 FilterMore 组件时，从 selectedValues 中，获取到当前选中值 more。
    2 通过 props 将选中值传递给 FilterMore 组件。
    3 在 FilterMore 组件中，将获取到的选中值，设置为子组件状态 selectedValues 的默认值。
    4 给遮罩层绑定单击事件。
    5 在单击事件中，调用父组件的方法 onCancel 关闭 FilterMore 组件。
  */
  renderFilterMore() {
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic }
    } = this.state
    if (openType !== 'more') {
      return null
    }

    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }

    const defaultValue = selectedValues.more

    return <FilterMore
      data={data}
      type={openType}
      onSave={this.onSave}
      onCancel={this.onCancel}
      defaultValue={defaultValue}
    />
  }

  /* 
   react-spring 的基本使用：

   1 安装：yarn add react-spring。
   2 打开 Spring 组件文档（Spring 组件用来将数据从一个状态移动到另一个状态）。
   3 导入 Spring 组件，使用 Spring 组件包裹要实现动画效果的遮罩层 div。
   4 通过 render-props 模式，将参数 props（样式） 设置为遮罩层 div 的 style。
   5 给 Spring 组件添加 from 属性，指定：组件第一次渲染时的动画状态。
   6 给 Spring 组件添加 to 属性，指定：组件要更新的新动画状态。
 */

  /* 
    实现遮罩层动画：

    1 创建方法 renderMask 来渲染遮罩层 div。
    2 修改渲染遮罩层的逻辑，保证 Spring 组件一直都被渲染（Spring 组件都被销毁了，就无法实现动画效果）。
    3 修改 to 属性的值，在遮罩层隐藏时为 0，在遮罩层展示时为 1。
    4 在 render-props 的函数内部，判断 props.opacity 是否等于 0。
    5 如果等于 0，就返回 null（不渲染遮罩层），解决遮罩层遮挡页面导致顶部导航失效问题。
    6 如果不等于 0，渲染遮罩层 div。
  */
  // 渲染遮罩层div
  renderMask() {
    const { openType } = this.state

    const isHide = openType === 'more' || openType === ''

    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 1 }}>
        {props => {
          // 说明遮罩层已经完成动画效果，隐藏了
          if (props.opacity === 0) {
            return null
          }

          return (
            <div
              style={props}
              className={styles.mask}
              onClick={() => this.onCancel(openType)}
            />
          )
        }}
      </Spring>
    )

    /* if (openType === 'more' || openType === '') {
      return null
    }
  
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
        {props => {
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={() => this.onCancel(openType)}
            />
          )
        }}
      </Spring>
    ) */
  }

  render() {
    const { titleSelectedStatus } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
            {props => {
              // props => { opacity: 0 } 是从 0 到 1 的中间值
              console.log(props)

              return (
                <div
                  style={props}
                  className={styles.mask}
                  onClick={() => this.onCancel(openType)}
                />
              )
            }}
          </Spring>
        ) : null} */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
