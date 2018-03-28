
import fetch from '@/http'
import { Base64 } from 'js-base64';
/**
 * 登录
 */

export const userLogin = (username, password) => fetch('user/login', {
    username: username,
    password: Base64.encode(password)
});

export const getUserInfo = (userid, guid, userrole) => fetch('info/getUserinfobyrole', {
    userid: userid,
    guid: guid,
    userrole: userrole
});
/**
 * 用户登出
 * @param {*} guid 当前账号的guid
 */
export const userLogout=(guid)=>fetch('user/logout',{
    guid:guid
});
/**
 * 获取个人信息
 * @param {*} guid 
 */
export const getPersonalinfo = (guid) => fetch('user/info', {
    guid: guid
});
/**
 * 修改个人密码
 * @param {*} guid 当前账号的guid
 * @param {*} oldpwd 旧密码--加密
 * @param {*} newpwd 新密码--加密
 */
export const changepwd = (guid, oldpwd, newpwd) => fetch('user/change-password', {
    guid: guid,
    original_pwd: Base64.encode(oldpwd),
    new_pwd: Base64.encode(newpwd)
});
/**
 * 护理部/护士长，查看护士信息
 * @param {*} guid 当前账号的guid
 * @param {*} index 页码
 * @param {*} size 显示数据的条数
 */
export const getNurseinfoList = (guid, index, size) => fetch('user/nurse-pagination', {
    guid: guid,
    index: index,
    size: size
});
/**
 * 停用/启用账号
 * @param {*} userid 被停用/启用的用户ID
 * @param {*} guid 操作者
 * @param {*} enablestatus 状态：1--启用，0--停用
 */
export const setenableNurseinfo = (userid, guid, enablestatus) => fetch('user/set-enable', {
    id: userid,
    guid: guid,
    enable: enablestatus
});
/**
 * 重置护士密码
 * @param {*} userid 被重置的用户ID
 * @param {*} guid 操作者
 */
export const resetNursepwd = (userid, guid) => fetch('user/reset-password', {
    id: userid,
    guid: guid
})
/**
 * 删除用户信息--逻辑删除
 * @param {*} userid 被删除的用户ID
 * @param {*} guid 操作者
 */
export const deleteNurseinfo = (userid, guid) => fetch('user/delete', {
    id: userid,
    guid: guid
});
/**
 * 修改用户信息
 * parems  前端传递的参数
 * @param {*} userid 被修改用户ID
 * @param {*} username 账号
 * @param {*} realname 姓名
 * @param {*} role 角色
 * @param {*} deparmentid 科室ID
 * @param {*} profression 专业
 * @param {*} level 职级
 * @param {*} education 学历 
 * @param {*} school 毕业学校
 * @param {*} graduatedyear 毕业年份
 * @param {*} certificate 护士执业证书
 * @param {*} certificatedate 取得护士执业证书时间
 * @param {*} title 职称
 * @param {*} titledate 取得职称时间 
 * @param {*} address 家庭地址
 * @param {*} joinyear 来院时间
 * @param {*} jobyear 参加工作时间
 * @param {*} birthday 出生日期
 * @param {*} telephone 手机号
 * @param {*} sex 性别
 * @param {*} batch 年级批次
 * @param {*} guid 操作者
 */
export const updateNurseinfo = (parems) => fetch('user/update', {
    id: parems.userid,
    user_name: parems.username,
    real_name: parems.realname,
    role: parems.role,
    depart_id: parems.deparmentid,
    profession: parems.profression,
    level: parems.level,
    education: parems.education,
    school: parems.school,
    graduated_year: parems.graduatedyear,
    certificate: parems.certificate,
    certificate_date: parems.certificatedate,
    title: parems.title,
    title_date: parems.titledate,
    address: parems.address,
    join_year: parems.joinyear,
    job_year: parems.jobyear,
    birthday: parems.birthday,
    telephone: parems.telephone,
    sex: parems.sex,
    batch: parems.batch,
    guid: parems.guid
});
/**
 * 新增账号
 * parems  前端传递的参数
 */
export const addNurseinfo = (parems) => fetch('user/create', {
    user_name: parems.username,
    real_name: parems.realname,
    role: parems.role,
    depart_id: parems.deparmentid,
    profession: parems.profression,
    level: parems.level,
    education: parems.education,
    school: parems.school,
    graduated_year: parems.graduatedyear,
    certificate: parems.certificate,
    certificate_date: parems.certificatedate,
    title: parems.title,
    title_date: parems.titledate,
    address: parems.address,
    join_year: parems.joinyear,
    job_year: parems.jobyear,
    birthday: parems.birthday,
    telephone: parems.telephone,
    sex: parems.sex,
    batch: parems.batch,
    guid: parems.guid
});
/**
 * 获取科室数据列表
 * @param {*} guid 
 * @param {*} index 页数
 * @param {*} size 每页显示数据
 */
export const getDeparmentList = (guid, index, size) => fetch('department/pagination', {
    guid: guid,
    index: index,
    size: size
});
/**
 * 获取科片数据列表
 * @param {*} guid 
 */
export const getRangeList = (guid) => fetch('department/range', {
    guid: guid
});
/**
 * 更新科室信息
 * @param {*} guid 当前账号guid
 * @param {*} deparmentid 科室ID
 * @param {*} deparmentname 科室名称
 * @param {*} rangeid 所属科片
 */
export const updateDeparment = (guid, deparmentid, deparmentname, rangeid) => fetch('department/update', {
    guid: guid,
    depart_id: deparmentid,
    depart_name: deparmentname,
    range_id: rangeid
});
/**
 * 删除科室数据
 * @param {*} guid 
 * @param {*} deparmentid 
 */
export const deleteDeparment = (guid, deparmentid) => fetch('department/delete', {
    guid: guid,
    depart_id: deparmentid
});

export const departmentstatistic = (guid, name, index, size) => fetch('plan/department-statistic-pagination', {
    guid: guid,
    name: name,
    index: index,
    size: size
});

export const usersindepartment = (guid, depart_id, month) => fetch('plan/users-in-department', {
    guid: guid,
    depart_id: depart_id,
    month: month
});

export const userstatistic = (guid, id) => fetch('plan/user-statistic', {
    guid: guid,
    id: id
});



/**********************出入科管理接口********************/
/**
 * 获取护士学员出入科的数据列表
 * @param {*} guid 
 * @param {*} index 页数
 * @param {*} size 每页显示数据
 * @param {*} nurseRealName 护士姓名
 * @param {*} likeDepartmentName 科室名称模糊查询
 * @param {*} whereDepartmentName 科室名称精确查询
 * @param {*} rotateStatus （轮转状态）
 * @param {*} planEndDate 计划出科时间
 * @param {*} planStartDate 计划入科时间
 */
export const getRotatePlanList = (guid, index, size, nurseRealName, likeDepartmentName, whereDepartmentName, rotateStatus, planEndDate, planStartDate) => fetch('rotate/getRotatePlanInfo', {
    guid: guid,
    planStartDate: planStartDate,
    planEndDate: planEndDate,
    rotateStatus: rotateStatus,
    whereDepartmentName: whereDepartmentName,
    likeDepartmentName: likeDepartmentName,
    nurseRealName: nurseRealName,
    pageIndex: index,
    pageSize: size
});
/**
 * 获取个人信息
 * @param {*} guid 当前登录用户id
 * @param {*} userId 当前选择查看的用户id
 */
export const getUserInfos = (guid, userId) => fetch('user', {
    guid: guid,
    id: userId
});


/**********************培训管理接口********************/
/**
 * 获取培训要求列表(tab菜单头部)
 * @param {*} guid 当前登录用户id
 */
export const getDemandInfos = (guid) => fetch('demand/infos', {
    guid: guid
});
/**
 * 获取培训内容列表
 * @param {*} guid 当前登录用户id
 * @param {*} demandId 轮转要求ID
 */
export const getTrainingContentInfos = (guid, demandId) => fetch('training/infos', {
    guid: guid,
    demand_id: demandId
});
/**
 * 获取培训内容列表(管理者)
 * @param {*} guid 当前登录用户id
 * @param {*} demandId 轮转要求ID
 */
export const getTrainingContentList = (guid, demandId) => fetch('training/infos-manager', {
    guid: guid,
    demand_id: demandId
});
/**
 * 添加培训内容
 * @param {*} guid 当前登录用户id
 * @param {*} demandId 轮转要求ID
 * @param {*} content 培训内容
 */
export const addTrainingContent = (guid, demandId, content) => fetch('training/create', {
    guid: guid,
    demand_id: demandId,
    content: content
});
/**
 * 修改培训内容
 * @param {*} guid 当前登录用户id
 * @param {*} serialId 培训内容ID
 * @param {*} content 培训内容
 */
export const updateTrainingContent = (guid, serialId, content) => fetch('training/update', {
    guid: guid,
    serial_id: serialId,
    content: content
});
/**
 * 设置培训内容是否可用
 * @param {*} guid 当前登录用户id
 * @param {*} serialId 培训内容ID
 * @param {*} enable 是否可用: 1---启用, 0---停用
 */
export const setTrainingContentEnable = (guid, serialId, enable) => fetch('training/set-enable', {
    guid: guid,
    serial_id: serialId,
    enable: enable
});
