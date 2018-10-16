import ajax from './ajax'
// 设置根目录
const ROOT = '/notice'
// 获取公告列表
export const getNoticeListApi = ({page = 1, pageSize = 10, menu = true} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, menu})
// 删除公告
export const delNoticeApi = (id) => ajax.delete(`${ROOT}/delete/${id}`)
// 发布公告
export const addNoticeApi = ({title, content, type}) => ajax.post(`${ROOT}/create`, {title, content, type})
