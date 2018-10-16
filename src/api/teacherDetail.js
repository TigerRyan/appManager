import ajax from './ajax'
// 设置根目录
const ROOT = '/order'
// 获取预约订单
export const getMakeListApi = ({page, pageSize , status ,userType ,userId } = {}) => ajax.post(`${ROOT}/findForSubscribe`, {page, pageSize , status ,userType ,userId})

// 获取转账列表
export const getAccountsListApi = ({page, pageSize , status ,userType=2 ,fromUserId } = {}) => ajax.post(`/transfer/find`, {page, pageSize , status ,userType ,fromUserId})
export const getAccountListApi = ({page, pageSize ,status , userType=1 ,targetUserId } = {}) => ajax.post(`/transfer/find`, {page, pageSize ,status , userType ,targetUserId  })

// 获取提现列表
export const getForwardListApi = ({page, pageSize , status ,userId,keyType } = {}) => ajax.post(`/cash/findByAPP`, {page, pageSize , status ,userId,keyType})

// 获取商品列表
export const getCommodityListApi = ({page, pageSize , status ,userId } = {}) => ajax.post(`/order/findForGoods`, {page, pageSize , status ,userId})

//获取教师详情
export const getUserApi = ({id} = {}) => ajax.get(`/user/getInfo/${id}`)

//获取教师是否开通拼课
export const getTeacherStatusApi = ({id} = {}) => ajax.get(`/appMember/collageApply/${id}`)
// 修改用户详情
export const getUserUpDataApi = ({id,deleted ,lineSwitch,level,payMoney,skills,grade,subject} = {}) => ajax.put(`/user/update`,{id,deleted ,lineSwitch,level,payMoney,skills,grade,subject})

// 获取教学课程
export const getSubjectApi = ({} = {}) => ajax.get(`/base/eduItem`)

// 撤销转账
export const getCancelApi = ({id} = {}) => ajax.put(`/transfer/cancel/${id}`)

// 退款
export const geTrefundsForGoodsApi = ({id,status} = {}) => ajax.put(`/order/refundsForGoods`,{id,status })

// 提现审核
export const getAuditByAPPApi = ({ids,status,reason=null } = {}) => ajax.put(`/cash/auditByAPP`,{ids,status,reason })