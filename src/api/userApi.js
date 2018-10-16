import ajax from './ajax'

import md5 from 'md5'
// 设置根目录
const ROOT = '/user'
// 获取用户列表
export const getUserListApi = ({page = 1, pageSize = 10, name, type = 1, pid, earning} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, name, type, pid, earning})
// 导出用户列表
export const exportUserListApi = ({type = 0, start, end, filed = []} = {}) => ajax.post(`${ROOT}/export-list`, {type, start, end, filed})
// 分页获取用户账户统计
export const getBillListApi = ({page = 1, pageSize = 10, name} = {}) => ajax.post(`${ROOT}/list-bill`, {page, pageSize, name})
// 分页获取用户账户统计
export const exportBillListApi = () => ajax.post(`${ROOT}/export-bill`)
// 修改用户状态
export const toggleUserApi = (id) => ajax.put(`${ROOT}/toggle/${id}`)
// 修改用户拼课状态
export const toggleUserStatusApi = (id,type) => ajax.put(`/appMember/modifyState/${id}/${type}`)
// 获取用户
export const getUserApi = (id) => ajax.get(`${ROOT}/get/${id}`)
// 获取用户统计数据
export const getUserInfoApi = (id) => ajax.get(`${ROOT}/getInfo/${id}`)
// 修改用户
export const updateUserApi = ({id, pic, name, phone, level, payMoney, password, deleted, lineSwitch, teacherlevel}) => ajax.put(`${ROOT}/update`, {id, pic, name, phone, level, payMoney, password: password ? md5(password) : null, deleted, lineSwitch, teacherlevel})
// 推荐或取消推荐
export const recommendUserApi = ({id,isRecommend, videoUrl, imgUrl}) => ajax.put(`${ROOT}/recommend/${id}/${isRecommend}`,{videoUrl, imgUrl})
// 缓存我的信息
let mine = null
// 获取登录二维码
export const loginCodeApi = (code) => {
  mine = null
  return ajax.get(`${ROOT}/loginCode/${code}`)
}
// 获取当前登录的用户
export const currentUserApi = async (flag) => {
  if (!flag || !mine) {
    mine = await ajax.get(`${ROOT}/current`)
  }
  return Promise.resolve(mine)
}
// 登出
export const logoutApi = () => {
  mine = null
  return ajax.get(`/admin/logout`)
}

// 发送消息
export const sendApi = ({id,title ,content }) => ajax.post(`/pushinfo/add`,{id,title ,content })

// 获取教师评课申请列表
export const getShareCourseTeacherListApi = ({page, pageSize, name,status=1}) => {
	let key = name && isNaN(Number(name)) ? {'name':name} : {'phone':name}
	return ajax.post(`/appMember/collageApply`,{page, pageSize,...key,status:status})
}

// 审核教师评课申请
export const changeTeacherStatusApi = ({ids,status}) => ajax.put(`/appMember/check/${ids}/${status}`)
