import ajax from './ajax'
// 设置根目录
const ROOT = '/cash'
// 获取提现列表
export const getAppCashListApi = ({page = 1, pageSize = 10, start, end, status = 1, keyType , keyWord, sort, total} = {}) => ajax.post(`${ROOT}/findByAPP`, {page, pageSize,start, end, status ,keyType ,keyWord, sort, total})
// 审核提现
export const auditAppCashApi = ({ids, status,reason}) => ajax.put(`${ROOT}/auditByAPP`,{ids, status,reason})
// 导出app提现列表
export const exportAppCashListApi = ({status = 1, start, end} = {}) => ajax.post(`${ROOT}/exportByAPP`, {status, start, end})
// 导出服务商提现列表
export const exportProviderCashListApi = ({status = 1, start, end} = {}) => ajax.post(`${ROOT}/exportByService`, {status,start, end })

/*  export const exportProviderCashListApi = ({page=1, pageSize = 10,status = 1, start, end,keyType,keyWord} = {}) => ajax.post(`${ROOT}/exportByService`, {page, pageSize,start, end, status ,keyType ,keyWord})  */

// 导出机构提现列表
export const exportMechanismCashListApi = ({status = 1, start, end} = {}) => ajax.post(`${ROOT}/exportByMechanism`, {status, start, end})


