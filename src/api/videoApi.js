import ajax from './ajax'
// 设置根目录
const ROOT = '/video'
// 获取当前用户的视频课程列表
export const getUserVideoListApi = ({page = 1, pageSize = 10, keyWord} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, keyWord})
// 获取老师列表
export const getTeacherListApi = ({page = 1, pageSize = 10, name} = {}) => ajax.post(`${ROOT}/listAll`, {page, pageSize, name})
// 删除视频课程
export const delVideoApi = (id) => ajax.delete(`${ROOT}/del/${id}`)
// 创建视频课程
export const createVideoApi = ({name, videoUrl, videoImg, totalPrice, salePrice, grade, subjects, videoLabels} = {}) => ajax.post(`${ROOT}/create`, {name, videoUrl, videoImg, totalPrice, salePrice, grade, subjects, videoLabels})
// 分页获取所有视频列表
export const getVideoListApi = ({page = 1, pageSize = 10, keyWord, status} = {}) => ajax.post(`${ROOT}/listAll`, {page, pageSize, keyWord, status})
// 审核视频
export const auditVideoApi = ({id, status, salePrice, totalPrice, reason} = {}) => ajax.put(`${ROOT}/audit`, {id, status, salePrice, totalPrice, reason})
