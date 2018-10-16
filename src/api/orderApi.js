import ajax from './ajax'
// 设置根目录
const ROOT = '/order'
// 获取直播列表
export const getOrderMApi = ({page = 1, pageSize = 10, keyWord, status} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, keyWord, status})
// 获取转账列表
export const getTransferListApi = ({page = 1, pageSize = 10, keyWord, status} = {}) => ajax.post(`${ROOT}/transfer`, {page, pageSize, keyWord, status})
//获取订单详情
export const postOrderMApi = ({id,status,refundId }={}) => ajax.post(`${ROOT}/teacherOrderDetails`,{id,status,refundId })

//导出列表
// export const getExport = () => ajax.post(`${ROOT}/teacherOrderDetails`,{id,status,refundId })
