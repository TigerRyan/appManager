import ajax from './ajax'
// 设置根目录
const ROOT = '/appConfiguration'

// 获取科目分类列表/appConfiguration/getSubjectCategoryList
export const getConfigurationListApi = ({page = 1, pageSize = 10, menu = true} = {}) => ajax.post(`${ROOT}/getSubjectCategoryList`, {page, pageSize, menu})

// 修改分类/appConfiguration/editSubjectCategory/{subjectId}
export const editSubjectCategoryApi = (id,{name = null, sortNum = null} = {}) => ajax.put(`${ROOT}/editSubjectCategory/${id}`,{name,sortNum})

//新建分类/appConfiguration/createSubjectCategory
export const createSubjectCategoryApi = ({name = null, sortNum = null} = {}) => ajax.post(`${ROOT}/createSubjectCategory`,{name,sortNum})

//删除分类/appConfiguration/deleteSubjectCategory/{id}
export const deleteSubjectCategoryApi = (id) => ajax.delete(`${ROOT}/deleteSubjectCategory/${id}`)

