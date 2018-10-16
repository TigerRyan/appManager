import ajax from './ajax'
// 设置根目录
const ROOT = '/order'

// 获取预约订单列表
export const getReserveList = (
  { page, pageSize, keyWord, status, userType, keyType } = {}
) =>
  ajax.post(`${ROOT}/findForSubscribe`, {
    page,
    pageSize,
    keyWord,
    status,
    keyType,
    userType,
  })

// 获取线下课程订单列表
export const getOfflineList = (
  { page, pageSize, keyWord, status, userType, keyType, start, end } = {}
) =>
  ajax.post(`${ROOT}/findForCourse`, {
    page,
    pageSize,
    keyWord,
    status,
    keyType,
    userType,
    start,
    end,
  })

// 获取商品订单列表
export const getFindforgoodsApi = (
  { page = 1, pageSize = 10, start, end, keyWord, status, keyType } = {}
) =>
  ajax.post(`${ROOT}/findForGoods`, {
    page,
    pageSize,
    start,
    end,
    keyWord,
    status,
    keyType,
  })

// 获取商品订单详情
export const shopOrderDetailApi = ({id,status,refundId}) => ajax.post(`${ROOT}/getForGoods`,{id,status,refundId})

// 同意和拒绝商品订单退款
export const shoprefunfsApi = ({ id, status ,refundId} = {}) =>
ajax.put(`${ROOT}/refundsForGoods`, { id, status,refundId })



// 获取线下课程订单详情
export const getCourseDetail = ({id,status,refundId} = {} ) => ajax.post(`${ROOT}/offlineCourseOrderDetail`, {id,status,refundId})


// 同意或拒绝线下课程退款
export const isRefuse = ({ id, status,refundId } = {}) =>
  ajax.put(`${ROOT}/refundsForCourse`, { id, status,refundId})
// 同意或拒绝预约课程退款
export const isRefuseSub = ({ id, status ,refundId} = {}) =>
  ajax.put(`${ROOT}/refundsForSubscribe`, { id, status,refundId})


// 物流发货
export const shipmentsApi = ({ id, expressName, expressNum } = {}) =>
  ajax.put(`${ROOT}/sendGoods`, {
    id,
    expressName,
    expressNum,
  })

//导出预约订单列表
//有搜索限制条件
export const exportReserveList = ({status, start, end,keyWord,keyType,userType} = {}) => ajax.post(`/order/exportForSubscribe`, {status,start,end,keyWord,keyType,userType})

//export const exportReserveList = ({status, start, end} = {}) => ajax.post(`/order/exportForSubscribe`, {status,start,end})

//导出线下订单列表
//有搜索条件限制
export const exportOffList = ({status, start, end,keyType,keyWord} = {}) => ajax.post(`/order/exportForCourse`, {status,start,end,keyType,keyWord})

//export const exportOffList = ({status, start, end} = {}) => ajax.post(`/order/exportForCourse`, {status,start,end})

// 导出订单excel
export const exportForGoodsApi = ({ start, end, status }) => 
  ajax.post(`${ROOT}/exportForGoods`, {
    start,
    end,
    status,
  })

  // 获取教学课程
export const getSubjectApi = ({} = {}) => ajax.get(`/base/eduItem`)
