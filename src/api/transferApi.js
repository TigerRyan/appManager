import ajax from './ajax'
// 设置根目录
const ROOT = '/transfer'
// 获取转账记录列表
export const searchTransferApi = ({page = 1, pageSize = 10,start,end,userType,keyType,keyWord,status} = {}) => ajax.post(`${ROOT}/find`, {page,pageSize,start,end,userType,keyType,keyWord,status})
// 撤销转账
export const cancelTransferApi = (id) => ajax.put(`${ROOT}/cancel/${id}`)