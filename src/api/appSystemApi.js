import ajax from './ajax'
// 设置根目录
const ROOT = '/appConfiguration'
// 获取提现列表
export const getAppSystemListApi = ({page = 1, pageSize = 10, start, end} = {}) => ajax.post(`${ROOT}/getIndustryList`, {page, pageSize,start, end})
// 获取年级分类列表/appConfiguration/getGradeList
export const getGradeList = () => ajax.post(`${ROOT}/getGradeList`)
// 新增年级分类/appConfiguration/createGrade
export const addCreateGrade = obj => ajax.post(`${ROOT}/createGrade`, obj)
// 修改年级分类/appConfiguration/editGrade/{id}
export const updateEditGrade = (id,obj) => ajax.put(`${ROOT}/editGrade/${id}`,obj)
// 删除年级分类/appConfiguration/deleteGrade/{id}
export const delteGrade = id => ajax.delete(`${ROOT}/deleteGrade/${id}`)
// 查询科目分类/appConfiguration/getSubject
export const getSubject = () => ajax.post(`${ROOT}/getSubject`)
// 管理科目/appConfiguration/addSubjectByGradeId/{gradeId}
export const addSubjectByGradeId = (gradeId,obj) => ajax.put(`${ROOT}/addSubjectByGradeId/${gradeId}`,obj)
// 编辑
export const upDateAppSystemApi =({id, name, weight} = {}) => ajax.put(`${ROOT}/editIndustry/${id}`,{name, weight})
// 新增机构行业
export const addAppSystemApi = ({name = '', weight = ''} = {}) => ajax.post(`${ROOT}/insertIndustry`,{name, weight})
// 删除
export const delAppSystemApi = (id) => ajax.delete(`${ROOT}/deleteIndustry/${id}`)

// 获取科目
export const getConfigurationListApi = ({page = 1, pageSize = 100000} = {}) => ajax.post(`${ROOT}/getSubjectCategoryList`, {page, pageSize})

