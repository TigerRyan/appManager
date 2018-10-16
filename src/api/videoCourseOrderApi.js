import ajax from './ajax'
// 设置根目录
const ROOT = '/order'

//查询视频课程订单列表 POST /order/findVideoOrder
export const getvideoCourseOrderApi = ({page = 1, pageSize = 10, start,end,type,keyType,keyWord,searchType,status} = {}) => ajax.post(`${ROOT}/findVideoOrder`,{page, pageSize, start,end,type,keyType,keyWord,searchType,status})

//查询视频课程订单列表导出POST /order/exportVideoOrder
export const exportvideoCourseApi = ({status,type,start, end} = {}) => ajax.post(`${ROOT}/exportVideoOrder`, {status,type,start, end})

/*
* @Interface: 查询视频课程订单详情
* @Url: /order/findVideoOrderInfo/{orderId}/{type}
* @By: 阮班胜
* @Use: 袁小虎
* @Method: GET
* @Params: 
* orderId (integer): 视频课程订单id
* type (integer): 订单类型 1：机构订单 2：教师订单
*/
export const findVideoOrderInfoApi = (orderId,type) => ajax.get(`${ROOT}/findVideoOrderInfo/${orderId}/${type}`,)
