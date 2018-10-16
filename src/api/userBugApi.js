import ajax from './ajax'

// 设置根目录
const ROOT = '/bug'

//获取反馈列表
export const getFeedbackListApi = ({page, pageSize,status ,title  } = {}) => ajax.post(`${ROOT}/list`, {page, pageSize,status,title })

// 创建反馈
export const addFeedbackListApi = ({userId,title ,img ,deviceType ,version ,status ,details  } = {}) => ajax.post(`${ROOT}/feedback/${userId}`, {title ,img ,deviceType ,version ,status ,details })

//删除反馈
export const delFeedbackApi = ({id} = {}) => ajax.delete(`${ROOT}/feedback/${id}`)

// 解决反馈
export const SolveFeedbackApi = ({id} = {}) => ajax.put(`${ROOT}/solve/${id}`)

// 查询单个反馈对象
export const selectFeedbackApi = ({id} = {}) => ajax.get(`${ROOT}/feedback/${id}`)

// 更新反馈
export const updataFeedbackListApi = ({id,title ,img ,deviceType ,version ,status ,details  } = {}) => ajax.put(`${ROOT}/feedback`, {id,title ,img ,deviceType ,version ,status ,details }) 