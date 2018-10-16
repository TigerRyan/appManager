// 充值管理
import ajax from './ajax'
// 设置根目录
const ROOT = '/base'
// 充值管理列表POST /base/rechargeList
export const getrechargeListApi =({page=1,pageSize=10,start,end,keyWord}) => ajax.post(`${ROOT}/rechargeList`, {page,pageSize,start,end,keyWord})

// 获取用户信息GET /base/getUserInfo/{pid}
export const getUserInfoApi =(pid)=> ajax.get(`${ROOT}/getUserInfo/${pid}`)

//  用户充值面额GET /base/rechargeMoney/{userId}/{money}
export const getMoneyApi =(userId,money)=> ajax.get(`${ROOT}/rechargeMoney/${userId}/${money}`)

//用户充值导出列表导出POST POST /base/rechargeMoneyRecord
export const exportuserpayListApi = ({start, end} = {}) => ajax.post(`${ROOT}/rechargeMoneyRecord`, {start, end})