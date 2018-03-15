
import fetch from '@/http'
import {Base64} from 'js-base64';
/**
 * 登录
 */

export const userLogin = (username,password) =>fetch('login',{
    username:username,
    password:Base64.encode(password)
});

export const getUserInfo = (userid,guid,userrole) => fetch('info/getUserinfobyrole',{
    userid:userid,
    guid:guid,
    userrole:userrole
});
/**
 * 护理部/护士长，查看护士信息
 * @param {*} userid 当前登录用户ID
 * @param {*} index 页码
 * @param {*} size 显示数据的条数
 */
export const getNurseinfoList=(userid,index,size)=>fetch('user/nurse-pagination',{
    id:userid,
    index:index,
    size:size
});