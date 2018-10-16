import ajax from './ajax'
// 设置根目录
const ROOT = '/refund'
// 获取退款列表
export const getRefundListApi = ({page = 1, pageSize = 10, name} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, name})
// 审核退款申请
export const auditRefundApi = (id, state) => ajax.put(`${ROOT}/audit/${id}/${state}`)
// 退款
export const refundApi = (orderId) => ajax.put(`${ROOT}/refund/${orderId}`)
