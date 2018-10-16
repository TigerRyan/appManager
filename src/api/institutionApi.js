import ajax from './ajax'
// 设置根目录
const ROOT = '/institution'
// 获取当前机构列表
export const getInstitutionListApi = (status) => ajax.get(`${ROOT}/list/${status}`)
// 获取老师列表
export const getTeacherListApi = ({page = 1, pageSize = 10} = {}) => ajax.post(`${ROOT}/listTeacher`, {page, pageSize})
// 退出机构/ 把老师从机构中删除
export const delInstitutionApi = (id) => ajax.delete(`${ROOT}/out/${id}`)
// 获取机构详情
export const getInstitutionApi = (id) => ajax.get(`${ROOT}/get/${id}`)
// 更新机构
export const updateInstitutionApi = ({id, name, longitude, latitude, introduction, address, labels, pics} = {}) => ajax.put(`${ROOT}/update`, {id, name, longitude, latitude, introduction, address, labels, pics})
// 老师审核状态
export const auditTeacherApi = (id, status) => ajax.put(`${ROOT}/auditTeacher/${id}/${status}`)
// 获取所有机构列表
export const getOrganApi = ({page = 1, pageSize = 10, name, status} = {}) => ajax.post(`${ROOT}/listAll`, {page, pageSize, name, status})
// 审核机构信息
export const auditOrgan = ({id, status, reason}) => ajax.put(`${ROOT}/audit`, {id, status, reason})
// 推荐机构
export const recommendApi = (id) => ajax.put(`${ROOT}/recommend/${id}`)
