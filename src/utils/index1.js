    // 导入axios
    import axios from 'axios'
    // 1.在 utils 目录中，新建 index.js，在该文件中封装 
    // 2.创建并导出获取定位城市的函数getCurrentCity 
    export const getCurrentCity = () => {
        // 3.判断 localStorage中是否有定位城市 
        const localCity = JSON.parse(localCity.getItem('hkzf_city'))  // json.parse 字符串数据转换对象
        if (!localCity) {
            // 4.如果没有，就使用首页中获取定位城市的代码来获取，并且存储到本地存储中，然后返回该城市数据 
            return new Promise((resolve, reject) => {
                // 异步变同步
                const curCity = new window.BMap.LocalCity()
                curCity.get(async res => {
                   try {
                     // console.log('当前城市信息：', res)
                     const result = await axios.get(
                        `http://118.190.160.53:8009/area/info?name=${res.name}`
                      ) 
                      // result.data.body => { label: '上海', value: '' }
                      // 存储到本地存储中
                      localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))  // 对象转换为字符串
                      // 返回该城市数据
                      // return result.data.body
                      // 获取城市信息得解决异步的问题，promise
                      resolve(result.data.body)
                   } catch(e) {
                       // 获取定位城市失败
                       reject(e) // reject表示操作失败了，把对象暴漏出去
                   }
                })
            })
        }
        
        // 5.如果有，直接返回本地存储中的城市数据
        // 返回promise对象
        // 注意：因为上面为了处理异步操作，使用了Promise，因此，为了该函数返回值的统一，此处，也应该使用Promise
        // 因为此处的 Promise 不会失败，所以，此处，只要返回一个成功的Promise即可
        return Promise.resolve(localCity)
    }
    


