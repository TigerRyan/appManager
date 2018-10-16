import ajax from './ajax'
// 设置根目录
const ROOT = '/luckyActivity'

//获取抽奖管理活动列表/luckyActivity/luckyActivityList
export const getlotManagementApi = ({page = 1, pageSize = 10, start,end} = {}) => ajax.post(`${ROOT}/luckyActivityList`, {page, pageSize, start,end})
//新增抽奖活动POST /luckyActivity/createLuckyActivity
export const addManagementApi = obj => ajax.post(`${ROOT}/createLuckyActivity`, obj)
//编辑抽奖活动PUT /luckyActivity/updateLuckyActivity/{id}
export const editManagementApi = (id,obj) => ajax.put(`${ROOT}/updateLuckyActivity/${id}`, obj)
//发布活动 开启 禁用PUT /luckyActivity/sendLuckyActivity/{id}
export const sendlotManageApi = id => ajax.put(`${ROOT}/sendLuckyActivity/${id}`)


// 管理商品列表POST /luckyGoods/luckyGoodsList
export const getlotManageApi = ({page = 1, pageSize = 10, start,end,activityId} = {}) => ajax.post(`/luckyGoods/luckyGoodsList`, {page, pageSize, start,end,activityId})
//管理商品新建POST /luckyGoods/createLuckyGoods
export const addlotManageApi = obj => ajax.post(`/luckyGoods/createLuckyGoods`, obj)
//管理商品编辑 PUT /luckyGoods/updateLuckyGoods/{id}
export const editlotManageApi = (id,obj) => ajax.put(`/luckyGoods/updateLuckyGoods/${id}`, obj)
//管理商品删除DELETE /luckyGoods/deleteLuckyGoods/{id}
export const deletelotManageApi = id => ajax.delete(`/luckyGoods/deleteLuckyGoods/${id}`)