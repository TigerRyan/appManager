import ajax from './ajax'
// 设置根目录
const ROOT = '/cash'
// 获取提现列表
export const getOrganizationCashListApi = ({page = 1, pageSize = 10, start, end, status = 1, keyType , keyWord, sort, total} = {}) => ajax.post(`${ROOT}/findByMechanism`, {page, pageSize,start, end, status ,keyType ,keyWord, sort, total})


// 审核提现
export const auditOrganizationCashApi = ({ids, status,reason}) => ajax.put(`${ROOT}/auditByMechanism`,{ids, status,reason})

//确认打款
export const affirmOrganizationCashApi = (id,serialNumber)=>ajax.put(`${ROOT}/remittanceByMechanism/${id}/${serialNumber}`)

