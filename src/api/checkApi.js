import ajax from './ajax'
// 设置根目录
const ROOT = '/certifcation'
const ROOT1 = '/check'
// 获取老师认证列表
export const getCheckListApi = ({page = 1, pageSize = 10, keyType, keyWord, status = 1, start, end} = {}) => ajax.post(`${ROOT1}/list`, {page, pageSize, keyType, keyWord, status, start, end})
// 导出老师认证列表
export const exportCheckListApi = ({status = 1, start, end, keyType, keyWord}) => ajax.post(`${ROOT1}/export-list`, {status, start, end, keyType, keyWord })
// 老师审核认证
export const auditCheckApi = (id, status, reason) => ajax.put(`${ROOT1}/audit`, {id, status, reason})
// 服务商通过列表
export const providerListApi = ({page = 1, pageSize = 10, status, type, query, start, end} = {}) => ajax.post(`${ROOT}/provider`,{page, pageSize, status, type, query, start, end})
// 服务商审核认证
export const providerCheckApi = ({reason, id, type} = {}) => ajax.put(`${ROOT}/providerOperation`, {reason, id, type})
// 导出服务商认证列表
export const exportProviderListApi = ({status = 1, start, end, keyType, query, type}) => ajax.post(`${ROOT}/exportProviderList`, {status, start, end, keyType, query, type})
//机构通过列表
export const mechanismListApi = ({page = 1, pageSize = 10, status, type, query, start, end} = {}) => ajax.post(`${ROOT}/mechanism`,{page, pageSize, status, type, query, start, end})
// 机构审核认证
export const mechanismCheckApi = ({reason, id, type} = {}) => ajax.put(`${ROOT}/mechanismOperation`, {reason, id, type})
// 导出机构认证列表
export const exportMechanismListApi = ({status = 1, start, end, keyType, query, type}) => ajax.post(`${ROOT}/exportMechanismList`, {status, start, end, keyType, query, type})
