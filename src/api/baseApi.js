import ajax from './ajax'
// 设置根目录
const ROOT = '/base'
// 获取全部课程服务群体（教学科目）
let eduItems = null
export const getEduItemApi = async () => {
  if (!eduItems) {
    eduItems = await ajax.get(`${ROOT}/eduItem`)
    console.log(eduItems)
  }
  return Promise.resolve(eduItems)
}
// 获取全部特色标签
let labels = null
export const getLabelsApi = async () => {
  if (!labels) {
    labels = await ajax.get(`${ROOT}/labels`)
  }
  return Promise.resolve(labels)
}
// 获取全部特色标签
export const getLabelsListApi = (type) => ajax.get(`${ROOT}/labels/${type}`)
// 删除特色标签
export const delLabelsApi = (id) => ajax.delete(`${ROOT}/labels/${id}`)
// 修改特色标签
export const updateLabelsApi = ({id, name, weight, icon} = {}) => ajax.put(`${ROOT}/labels`, {id, name, weight, icon})
// 创建特色标签
export const createLabelsApi = ({name, weight, icon, type} = {}) => ajax.post(`${ROOT}/labels`, {name, weight, icon, type})
// 获取服务群体（教学科目）树
export const getEduItemTreeApi = () => ajax.get(`${ROOT}/eduItemTree`)
// 删除服务群体（教学科目）
export const delEduItemApi = (id) => ajax.delete(`${ROOT}/eduItem/${id}`)
// 修改服务群体（教学科目）
export const updateEduItemApi = ({id, itemName, itemDesc, itemIcon, parentId, sortNum} = {}) => ajax.put(`${ROOT}/eduItem`, {id, itemName, itemDesc, itemIcon, parentId, sortNum})
// 创建服务群体（教学科目）
export const createEduItemApi = ({itemName, itemDesc, itemIcon, parentId, sortNum} = {}) => ajax.post(`${ROOT}/eduItem`, {itemName, itemDesc, itemIcon, parentId, sortNum})
// 获取全部课程服务群体
export const getAllEduItemApi = () => ajax.get(`${ROOT}/eduItem`)
//通过通过机构id查询机构行业  GET /appConfiguration/getIndustry/{id}
export const  getIndustry=( id )=>ajax.get(`/appConfiguration/getIndustry/${id}`)
