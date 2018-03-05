
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