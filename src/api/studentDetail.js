import ajax from './ajax'
// 设置根目录
const ROOT = '/appMember'
//获取学生详情
export const getUserApi = ({id} = {}) => ajax.post(`${ROOT}/studentMember`,id)
//获取所有年级列表
// export const getgradeApi = ({} = {}) => ajax.post(`/appConfiguration/getGradeList`)
// 获取预约订单
export const getMakeListApi = ({page, pageSize , status ,userType ,userId } = {}) => ajax.post(`${ROOT}/findForSubscribe`, {page, pageSize , status ,userType ,userId})
// 获取教学课程 选年级
export const getSubjectApi = ({} = {}) => ajax.get(`/base/eduItem`)
// 修改用户详情/appMember/editStudentMember/{studentId}
export const getUserUpDataApi = ({id,school ,grade,deleted,address} = {}) => ajax.put(`${ROOT}/editStudentMember/${id}`,{school ,grade,deleted,address})
// 获取转账记录列表
export const getAccountsListApi = ({page, pageSize , status ,fromUserId } = {}) => ajax.post(`${ROOT}/find`, {page, pageSize , status ,fromUserId})
// 获取收入记录列表
export const getAccountListApi = ({page, pageSize ,status,targetUserId } = {}) => ajax.post(`${ROOT}/find`, {page, pageSize ,status ,targetUserId  })
// 获取提现列表// /appMember/findByAPP
export const getForwardListApi = ({page, pageSize , status ,userId,keyType } = {}) => ajax.post(`${ROOT}/findByAPP`, {page, pageSize , status ,userId,keyType})
//线下课程订单/appMember/findForCourse
export const getorderListApi = ({page, pageSize , status ,userId,keyType } = {}) => ajax.post(`${ROOT}/findForCourse`, {page, pageSize , status ,userId,keyType})
// 获取商品列表POST /appMember/findForGoods
export const getCommodityListApi = ({page, pageSize , status ,userId } = {}) => ajax.post(`${ROOT}/findForGoods`, {page, pageSize , status ,userId})
// 撤销转账
export const getCancelApi = ({id} = {}) => ajax.put(`/transfer/cancel/${id}`)
// 提现审核
export const getAuditByAPPApi = ({ids,status,reason=null } = {}) => ajax.put(`/cash/auditByAPP`,{ids,status,reason })
// 商城订单退款
export const getRefundsForGoodsApi = ({id,status} = {}) => ajax.put(`/order/refundsForGoods`,{id,status })
// 线下订单退款
export const getRefundsForCourseApi = ({id,status} = {}) => ajax.put(`/order/refundsForCourse`,{id,status })