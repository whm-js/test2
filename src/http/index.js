import axios from 'axios'
import { Loading, Message } from 'element-ui'
import store from '../store/store'
import router from '@/router'

var baseUrl = 'http://101.37.24.216:3009/' //服务器地址
if (location.hostname == 'localhost') {
    baseUrl = 'http://118.178.92.150:3101/'
}
//: http://101.37.24.216:3101
axios.defaults.timeout = 5000

// request拦截器
var loadinginstace;
axios.interceptors.request.use(config => {
    loadinginstace = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.transformRequest = [function (data, headers) {

        let dataStr = ''; //数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        })

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            // url = url + '?' + dataStr;
        }
        return dataStr;

        // let q = new URLSearchParams();
        // for (let i in data) {
        //     q.append(i, data[i]);
        // }
        // return q.toString();
    }];
    return config
}, error => {
    Message.error({
        message: '加载超时'
    });
    return Promise.reject(error)
})

// response拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
    loadinginstace.close();
    return data
}, error => {
    Message.error({
        message: '加载失败'
    });
    return Promise.reject(error)
})

export default async (url, data, method = "post") => {
    url = baseUrl + url;
    // try {
    //     const response =await axios({
    //         method: method,
    //         url: url,
    //         data:data,
    //     })
    //     return response.data;
    // } catch (error) {
    //     Message.error(err);
    //     // throw new Error(error)
    // }

    let promise = new Promise(function (resolve, reject) {
        axios({
            method: method,
            url: url,
            data: data,
        }).then(function (res) {
            if (res.status !== 200) {
                Message.error(res.data.message);
                reject(res.data.message)
            }
            if (res.data.code !== 0) {
                if (res.data.code === -3003) {
                    store._actions.setSignOut[0]()
                    Message.error(res.data.message);
                    router.push('/login')
                    reject(res.data.message)
                } else {
                    Message.error(res.data.message);
                    reject(res.data.message)
                }

            } else {
                resolve(res.data)
            }
        }).catch(function (err) {
            Message.error(err);
            reject(err)
        });
    })
    return promise
}