import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  Toast
} from 'antd-mobile'

import { API } from '../../../utils'

import NavHeader from '../../../components/NavHeader'
import HousePackge from '../../../components/HousePackage'

import styles from './index.module.css'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)
    console.log(props)

    const { state } = props.location
    const community = {
      name: '',
      id: ''
    }

    if (state) {
      // 有小区信息数据，存储到状态中
      community.name = state.name
      community.id = state.id
    }

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }


  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }


  /* 
    获取表单数据：

    1 创建方法 getValue 作为三个组件的事件处理程序。
    2 该方法接收两个参数：1 name 当前状态名 2 value 当前输入值或选中值。
    3 分别给 InputItem / TextareaItem / Picker 组件，添加 onChange 配置项。
    4 分别调用 getValue 并传递 name 和 value 两个参数（注意：Picker 组件选中值为数组，而接口需要字符串，所以，取索引号为 0 的值即可）。
  */
  getValue = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  /* 
    获取房屋配置数据：

    1 给 HousePackge 组件，添加 onSelect 属性。
    2 在 onSelect 处理方法中，通过参数获取到当前选中项的值。
    3 根据发布房源接口的参数说明，将获取到的数组类型的选中值，转化为字符串类型。
    4 调用 setState() 更新状态。
  */
  handleSupporting = selected => {
    // console.log(selected)
    this.setState({
      supporting: selected.join('|')
    })
  }

  /* 
      获取房屋图片：
  
      1 给 ImagePicker 组件添加 onChange 配置项。
      2 通过 onChange 的参数，获取到上传的图片，并存储到状态 tempSlides 中。
    */
  handleHouseImg = (files, type, index) => {
    console.log(files, type, index)
    this.setState({
      tempSlides: files
    })
  }

  /* 
     上传房屋图片：
 
     1 给提交按钮，绑定单击事件。
     2 在事件处理程序中，判断是否有房屋图片。
     3 如果没有，不做任何处理。
     4 如果有，就创建 FormData 的实例对象（form）。
     5 遍历 tempSlides 数组，分别将每一个图片对象，添加到 form 中（键为： file，根据接口文档获得）。
     6 调用图片上传接口，传递form参数，并设置请求头 Content-Type 为 multipart/form-data。
     7 通过接口返回值获取到的图片路径。
   */
  addHouse = async () => {
    const {
      tempSlides,
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community
    } = this.state
    let houseImg = ''

    if (tempSlides.length > 0) {
      // 已经有上传的图片了
      const form = new FormData()
      tempSlides.forEach(item => form.append('file', item.file))

      const res = await API.post('/houses/image', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // console.log(res)
      houseImg = res.data.body.join('|')
    }

    console.log(houseImg)

    // 发布房源
    const res = await API.post('/user/houses', {
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community: community.id,
      houseImg
    })

    if (res.data.status === 200) {
      // 发布成功
      Toast.info('发布成功', 1, null, false)
      this.props.history.push('/rent')
    } else {
      Toast.info('服务器偷懒了，请稍后再试~', 2, null, false)
    }
  }

  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      size,
      title
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            value={price}
            onChange={val => this.getValue('price', val)}>
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            value={size}
            onChange={val => this.getValue('size', val)}
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            value={[roomType]}
            cols={1}
            onChange={val => this.getValue('roomType', val[0])}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker
            data={floorData}
            value={[floor]}
            cols={1}
            onChange={val => this.getValue('floor', val[0])}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker
            data={orientedData}
            value={[oriented]}
            cols={1}
            onChange={val => this.getValue('oriented', val[0])}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={val => this.getValue('title', val)}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            onChange={this.handleHouseImg}
            multiple={true}
            className={styles.imgpicker}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackge select onSelect={this.handleSupporting} />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            value={description}
            onChange={val => this.getValue('description', val)}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
