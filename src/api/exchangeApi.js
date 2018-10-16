import ajax from './ajax'

// 设置根目录
const ROOT = '/couponGoods'

//获取活动管理首页列表
export const getAdminListApi = ({page=1, pageSize=10 } = {}) => ajax.post(`${ROOT}/couponGoodsList`, {page, pageSize})

// 获取单个兑换商品
export const getSingleListApi = ({ id } = {}) => ajax.get(`${ROOT}/couponGoods/${id}`)

//编辑单个商品
export const getEditApi = ({ homeImg ,name ,costPrice ,number ,triesLimit,id  } = {}) => ajax.put(`${ROOT}/editCouponGoods/${id}`, {homeImg ,name ,costPrice ,number ,triesLimit })

// 兑换记录列表
export const getRecordListApi = ({page=1, pageSize=10 } = {}) => ajax.post(`${ROOT}/couponGoodsOrderList`, {page, pageSize})

// 发货
export const getDeliverApi = ({id ,expressName ,expressNum  } = {}) => ajax.put(`${ROOT}/sendCouponGoods`, {id ,expressName ,expressNum })

// 新增兑换商品
export const getAddApi = ({homeImg ,name ,costPrice ,number ,triesLimit } = {}) => ajax.post(`${ROOT}/couponGoods`, {homeImg ,name ,costPrice ,number ,triesLimit})

// 删除兑换商品
export const getDelApi = ({ id } = {}) => ajax.delete(`${ROOT}/couponGoods/${id}`)