import ajax from './ajax'
// 设置根目录
const ROOT = '/goods'
//获取商品列表
export const postgoodsList = ({page = 1, pageSize = 10,id,name,status,type} = {}) => ajax.post(`${ROOT}/list`,{page, pageSize,id,name,status,type})
//批量下架
export const uplowerFrameApi = (body) => ajax.put(`${ROOT}/lowerFrame`,body)
//删除商品
export const getdeleteApi = (id) => ajax.delete(`${ROOT}/delete/${id}`)
//商品新增
export const postaddGoods = ({goodsCategoryId , goodsName ,homeImg ,goodsImage ,costPrice,showPrice,notIntegral,integral,details,weight,coupon,couponMin,couponMax,type,purchasePrice,virtualSaleNumber} = {}) => ajax.post(`${ROOT}/addGoods`,{goodsCategoryId , goodsName ,homeImg ,goodsImage ,costPrice,showPrice,notIntegral,integral,details,weight,coupon,couponMin,couponMax,type,purchasePrice,virtualSaleNumber})
// 属性新增
export const postaddGoodsSku = (obj2={}) => {
 return ajax.post(`${ROOT}/addGoodsSku`,obj2)
}
// 规格新增
export const postaddGoodsSub = (obj2={}) => {
  return ajax.post(`${ROOT}/addGoodsSub`,obj2)
 }
//  获取商品详情
export const getinfoApi = (id) => {
  return ajax.get(`${ROOT}/info/${id}`)
 }
 //更新编辑商品
export const putUpDataApi = ({goodsCategoryId , goodsName ,homeImg ,goodsImage ,costPrice,showPrice,notIntegral,integral,details,weight,id,coupon,couponMin,couponMax,type,purchasePrice,virtualSaleNumber} = {}) => ajax.put(`${ROOT}/update/${id}`,{goodsCategoryId , goodsName ,homeImg ,goodsImage ,costPrice,showPrice,notIntegral,integral,details,weight,coupon,couponMin,couponMax,type,purchasePrice,virtualSaleNumber})
// 仓库中的商品
export const storeGoodsList = ({page = 1, pageSize = 10,id,name} = {}) => ajax.post(`${ROOT}/forSale/list`,{page, pageSize,id,name})
// 批量上架
export const updownFrameApi = (body) => ajax.put(`${ROOT}/upperFrame`,body)

// 商品属性查询
export const getGoodsSkuApi = (id) => {
  return ajax.get(`${ROOT}/goodsSku/${id}`)
 }

 //商品规格查询
 export const getGoodsSkubApi = (id) => {
  return ajax.get(`${ROOT}/goodsSub/${id}`)
 }

// 规格修改
export const updateGoodsSubApi = (obj2={}) => {
  return ajax.post(`${ROOT}/updateGoodsSub`,obj2)
 }

 // 属性修改
export const updateGoodsSkuApi = (obj2={}) => {
  return ajax.post(`${ROOT}/updateGoodsSku`,obj2)
 }
