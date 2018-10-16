import ajax from './ajax'
// 设置根目录
const ROOT = '/prizeRecord'
// 获取中奖管理列表POST /prizeRecord/prizeList
export const getwinManagementApi = ({page = 1, pageSize = 10, start,end,type,keyType,keyWord} = {}) => ajax.post(`${ROOT}/prizeList`, {page, pageSize, start,end,type,keyType,keyWord})
//发放中奖商品PUT /prizeRecord/send/{id}
export const putwinManagementApi = id => ajax.put(`${ROOT}/send/${id}`)
// 导出领取记录/prizeRecord/exportPrizeList
export const exportRecord = ({start, end, type, keyType, keyWord} = {}) => ajax.post(`${ROOT}/exportPrizeList`, {start, end, type, keyType, keyWord})
