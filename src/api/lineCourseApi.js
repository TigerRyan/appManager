import ajax from './ajax'
// 设置根目录
const ROOT = '/lineCourse'
// 获取视频列表
export const getVideoMApi = ({page = 1, pageSize = 10, name, status = 1} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, name, status})
// 审核视频信息
export const auditVideo = ({id, status} = {}) => ajax.put(`${ROOT}/audit`, {id, status})
