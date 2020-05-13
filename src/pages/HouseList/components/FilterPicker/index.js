import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

/* const province = [
  {
    label: '北京',
    value: '01',
    children: [
      {
        label: '东城区',
        value: '01-1'
      },
      {
        label: '西城区',
        value: '01-2'
      },
      {
        label: '崇文区',
        value: '01-3'
      },
      {
        label: '宣武区',
        value: '01-4'
      }
    ]
  },
  {
    label: '浙江',
    value: '02',
    children: [
      {
        label: '杭州',
        value: '02-1',
        children: [
          {
            label: '西湖区',
            value: '02-1-1'
          },
          {
            label: '上城区',
            value: '02-1-2'
          },
          {
            label: '江干区',
            value: '02-1-3'
          },
          {
            label: '下城区',
            value: '02-1-4'
          }
        ]
      },
      {
        label: '宁波',
        value: '02-2',
        children: [
          {
            label: 'xx区',
            value: '02-2-1'
          },
          {
            label: 'yy区',
            value: '02-2-2'
          }
        ]
      },
      {
        label: '温州',
        value: '02-3'
      },
      {
        label: '嘉兴',
        value: '02-4'
      },
      {
        label: '湖州',
        value: '02-5'
      },
      {
        label: '绍兴',
        value: '02-6'
      }
    ]
  }
] */

/* 
  获取选中值：

  1 在 FilterPicker 组件中，添加状态 value（用于获取 PickerView 组件的选中值）。
  2 给 PickerView 组件添加配置项 onChange，通过参数获取到选中值，并更新状态 value。
  3 在确定按钮的事件处理程序中，将 type 和 value 作为参数传递给父组件。
*/

export default class FilterPicker extends Component {
  state = {
    value: this.props.defaultValue
  }
  // constructor(props) {
  //   super(props)
  //   console.log('FilterPicker 创建了')
  //   this.state = {
  //     value: this.props.defaultValue
  //   }
  // }
  render() {
    const { onCancel, onSave, data, cols, type } = this.props
    const { value } = this.state
    return (
      <>
       {/* 
          选择器组件： 
          注意：一定要设置组件 value 属性的值，为当前选中状态的值，否则，无法实现切换选中项
        */}
        <PickerView
          data={data}
          value={value}
          cols={cols}
          onChange={val => {
            this.setState({
              value: val
            })
          }} />

        {/* 底部按钮 */}
        <FilterFooter
          onCancel={() => onCancel()}
          onOk={() => onSave(type, value)}
        />
      </>
    )
  }
}
