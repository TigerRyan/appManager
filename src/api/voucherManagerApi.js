// POST /couponManage/getCouponGive 获取宝劵发放记录
import ajax from './ajax'
// 设置根目录
const ROOT = '/couponManage'
// 获取宝劵发放记录
export const getVoucherRecordsApi =({page=1,pageSize=10,start,end,type=1,number,denomination,userIds}) => ajax.post(`${ROOT}/getCouponGive`, {page,pageSize,start,end,type,number,denomination,userIds})

// 获取用户信息
export const getUserInfoApi =(phone)=> ajax.get(`${ROOT}/getUserInfo/${phone}`)

//  发放优惠券
export const sendVouchersApi =({page=1,pageSize=10,type=1,number,denomination,userIds}) => ajax.put(`${ROOT}/sendCoupon`, {page,pageSize,type,number,denomination,userIds})

//设置百分比 
export const setCouponRatioApi =(key,res)=> ajax.post(`system/put/${key}`,res)

//获取百分比 
export const getCouponRatioApi =(key)=> ajax.get(`system/get/${key}`)