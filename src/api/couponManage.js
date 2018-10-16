import ajax from './ajax'
// 设置根目录
const ROOT = '/couponManage'

// 获取用户下的宝卷列表 POST /couponManage/getCouponInfo
export const getCoupInfo = ({page=1,pageSize=10,start,end,id}={}) => ajax.post(`${ROOT}/getCouponInfo`,{page,pageSize,start,end,id})

// 删除宝卷
export const delcoupon = (id) => ajax.delete(`${ROOT}/delete/${id}`)

// 获取宝卷统计 /couponManage/getCouponNum
export const getCouponNum = () => ajax.get(`${ROOT}/getCouponNum`)

// 获取宝劵排行榜  /couponManage/getCouponRanking
export const getCouponRanking = ({page=1,pageSize=10,start,end,keyType,keyWord}={}) => ajax.post(`${ROOT}/getCouponRanking`,{page,pageSize,start,end,keyType,keyWord})
// export const updategoodsCategory = ({ id, parentId, name, icon, weight }) =>
//   ajax.put(`${ROOT}/update$/${id}`, {parentId, name, icon, weight })
// 宝券设置
// 设置
export const postticketNumber = (key,res) => ajax.post(`/system/put/${key}`,res) 
// 展示
export const showticketNumber = (key) => ajax.get(`/system/get/${key}`) 
// echarts展示 /couponManage/cartogram/{type}/{status}
export const showEcharts = (type,status) => ajax.get(`${ROOT}/cartogram/${type}/${status}`) 

// 获取宝劵发放记录
export const getVoucherRecordsApi =({page=1,pageSize=10,start,end,type,number,denomination,userIds}) => ajax.post(`${ROOT}/getCouponGive`, {page,pageSize,start,end,type,number,denomination,userIds})

// 获取用户信息
export const getUserInfoApi =(phone)=> ajax.get(`${ROOT}/getUserInfo/${phone}`)

//  发放优惠券
export const sendVouchersApi =({page=1,pageSize=10,type,number,userIds,denomination}) => ajax.put(`${ROOT}/sendCoupon`, {page,pageSize,type,number,userIds,denomination})
