import ajax from './ajax'


// 设置根目录
const ROOT = '/serviceProvider'
//获取活动管理首页列表
export const getSignListApi = ({page, pageSize , start, end, signStatus='', keyWords= '', paramType =''} = {}) => ajax.post(`${ROOT}/sign`, {page, pageSize, start, end, signStatus, keyWords, paramType})
// 查看
export const checkSignListApi = (id) => ajax.get(`${ROOT}/signInfo/${id}`)
