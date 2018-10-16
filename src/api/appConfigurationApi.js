// POST /appConfiguration/getKeyWordList
import ajax from './ajax'
// 设置根目录
const ROOT = '/appConfiguration'

//查询类型名称 POST /appConfiguration/getModuleType 
export const getModuleTypeApi = () => ajax.post(`${ROOT}/getModuleType`)

// 删除条目  DELETE /appConfiguration/deleteKeyWord/{id}
export const deleteKeyWordApi = (id) => ajax.delete(`${ROOT}/deleteKeyWord/${id}`)

// 分页查询关键字设置列表  POST /appConfiguration/getKeyWordList 
export const getAppConfigurationApi = ({
  page = 1,
  pageSize = 10,
  start,
  end,
  keyWord,
  type
} = {}) => ajax.post(`${ROOT}/getKeyWordList`, {
  page,
  pageSize,
  start,
  end,
  keyWord,
  type
})

// 添加关键字设置 POST /appConfiguration/addKeyWord
export const addKeyWordApi = ({
  hotLabel,
  type,
  weight,
  status
} = {}) => ajax.post(`${ROOT}/addKeyWord`, {
  hotLabel,
  type,
  weight,
  status
})

// 修改关键字 PUT /appConfiguration/editKeyWord/{id}
export const editKeyWordApi = ({
  hotLabel,
  type,
  weight,
  id,
  status
}) => ajax.put(`${ROOT}/editKeyWord/${id}`, {
  hotLabel,
  type,
  weight,
  status
})
