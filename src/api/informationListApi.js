import ajax from './ajax'
// 设置根目录
const ROOT = '/information'
// 获取资讯列表
export const getInformationListApi = (obj) => ajax.post(`${ROOT}/list`,obj)
// 获取当栏目列表
export const getInformationTitleApi = (obj) => ajax.post(`${ROOT}/getInformationTitle`,obj)

// 添加资讯
export const addInformationTitleApi = (obj) => ajax.post(`${ROOT}/addInformation`,obj)

// 修改资讯
export const updateInformationApi = (obj) => ajax.put(`${ROOT}/updateInformation`,obj)

// 获取资讯详情
export const getInformationApi = (infoId) => ajax.get(`${ROOT}/getInformation/${infoId}`)


// 删除一条或多条数据/information/deleteAll
export const deleteAllInformationApi = (infoId) => ajax.delete(`${ROOT}/deleteAll/${infoId}`)