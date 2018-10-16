import ajax from './ajax'
// 设置根目录
const ROOT = '/bankCard'
// 获取用户银行卡列表
export const getBankCardListApi = ({page = 1, pageSize = 10, userId, id, menu = true} = {}) => ajax.post(`${ROOT}/list/0`, {page, pageSize, userId, id, menu})
