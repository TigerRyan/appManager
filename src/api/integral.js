import ajax from './ajax'


// 设置根目录
const ROOT = '/integralTask'
//获取积分列表
export const getIntegralApi = ({page=1, pageSize=0, taskUserType, taskType} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, taskUserType, taskType})
// 改变积分可用状态
export const changeStatus = (integralTaskId) => ajax.put(`${ROOT}/setting/${integralTaskId}`)
// 编辑
export const updateIntegralApi = ({id='', taskName='', score='', frequencyLimit=''} = {} )=> ajax.put(`${ROOT}/edit`,{id, taskName, score, frequencyLimit})
// 删除
export const delIntegralApi = (integralTaskId) => ajax.put(`${ROOT}/delete/${integralTaskId}`)
