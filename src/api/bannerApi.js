import ajax from './ajax'
// 设置根目录
const ROOT = '/banner'
// 获取用户列表
export const getBannerListApi = ({page = 1, pageSize = 10} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize})
// 删除广告
export const delBannerApi = (id) => ajax.delete(`${ROOT}/delete/${id}`)
// 获取广告详情
export const getBannerApi = (id) => ajax.get(`${ROOT}/get/${id}`)
// 创建广告
export const createBannerApi = (banner) => ajax.post(`${ROOT}/create`, banner)
// 修改广告
export const updateBannerApi = (banner) => ajax.put(`${ROOT}/update`, banner)
