import ajax from './ajax'
// 设置根目录
const ROOT = '/lineCourse'
// 分页获取所有机构列表
export const getLiveRadioListApi = ({page = 1, pageSize = 10, keyWord, status} = {}) => ajax.post(`${ROOT}/listAll`, {page, pageSize, keyWord, status})
// 审核直播
export const auditLiveRadioApi = ({id, status, salePrice, totalPrice, reason} = {}) => ajax.put(`${ROOT}/audit`, {id, status, salePrice, totalPrice, reason})
// 获取当前用户的直播课程列表
export const getUserLineCourseApi = ({page = 1, pageSize = 10, keyWord} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, keyWord})
// 删除直播课程
export const delLineCourseApi = (id) => ajax.delete(`${ROOT}/del/${id}`)
