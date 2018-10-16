import ajax from './ajax'
// 设置根目录
const ROOT = '/cash'
// 获取提现列表
export const getSupplierCashListApi = ({page = 1, pageSize = 10, start, end, status = 1, keyType , keyWord, sort, total} = {}) => ajax.post(`${ROOT}/findByService`, {page, pageSize,start, end, status ,keyType ,keyWord, sort,total})


// 审核提现
export const auditSupplierCashApi = ({ids, status,reason}) => ajax.put(`${ROOT}/auditByService`,{ids, status,reason})

//确认打款
export const affirmSupplierCashApi = (id,serialNumber)=>ajax.put(`${ROOT}/remittanceByService/${id}/${serialNumber}`)
//  获取服务商提现列表
export const getSupplierCashListUserApi = ({page = 1, pageSize = 10, start, end, status = 1, keyType , keyWord, userId} = {}) => ajax.post(`${ROOT}/findByService`, {page, pageSize,start, end, status ,keyType ,keyWord, userId})

