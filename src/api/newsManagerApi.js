import ajax from './ajax'
// 设置根目录
const ROOT = '/pushinfo'
//获取系统消息列表  POST /pushinfo/getList
export const getNewsListApi = ({
  page = 1,
  pageSize = 10,
  start,
  end,
  title
} = {}) => ajax.post(`${ROOT}/getList`, {
  page,
  pageSize,
  start,
  end,
  title
})

// POST /pushinfo/addPushInfo 新增系统消息
export const addSystemInfo = ({
  messageType,
  title,
  contentEx,
  userType = 1,
  modelId = 23
} = {}) => ajax.post(`${ROOT}/addPushInfo`, {
  messageType,
  title,
  contentEx,
  userType,
  modelId
})

// 用户消息列表
export const personListApi = ({page ,pageSize ,phone ,title ,businessType=null }) => ajax.post(`/pushinfo/getPersonList`,{page ,pageSize ,phone ,title ,businessType})