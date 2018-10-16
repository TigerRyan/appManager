import ajax from './ajax'
// 设置根目录
const ROOT = '/cash'
// 获取提现列表
export const getCashListApi = ({page = 1, pageSize = 10, name, status = 1} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, name, status})
// 获取用户提现列表
export const getUserCashListApi = (userId, {page = 1, pageSize = 10, name, status} = {}) => ajax.post(`${ROOT}/list/${userId}`, {page, pageSize, name, status})
// 获取用户提现统计信息
export const getUserCashCountApi = (userId) => ajax.get(`${ROOT}/count/${userId}`)
// 审核提现
export const auditCashApi = (id, status) => ajax.put(`${ROOT}/audit/${id}/${status}`)
// 批量提现审核
export const batchAuditApi = (ids = [], status) => ajax.put(`${ROOT}/batchAudit`, {ids, status})
