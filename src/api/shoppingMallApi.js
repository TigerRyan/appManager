import ajax from './ajax'


// 设置根目录
const ROOT = '/shop'
//获取商城管理首页汇总数据
export const getSummaryApi = ({} = {}) => ajax.get(`${ROOT}/summary`)

//获取统计数据
export const getStatisticsApi = ({type} = {}) => ajax.get(`${ROOT}/count/${type}`)

//获取七日数据
export const getSevenDataApi = ({type} = {}) => ajax.post(`${ROOT}/getGoodsTurnover/${type}`)

//获取七日热销数据
export const getHotSaleApi = ({} = {}) => ajax.post(`${ROOT}/getHotSale`)

//获取七日趋势图表数据
export const getTrendApi = ({} = {}) => ajax.get(`${ROOT}/chart`)
