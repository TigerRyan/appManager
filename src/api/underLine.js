import ajax from './ajax'
// 设置根目录
const ROOT = '/offlineCourse'
// 获取线下课程列表
export const getVideoListApi = ({page=1,pageSize=10, topicsName=null} = {}) => ajax.post(`${ROOT}/getOfflineCourseListForInstitution`,{page,pageSize,topicsName})

// 获取线下课程详情
export const getDetailApi = ({id} = {}) => ajax.get(`${ROOT}/getOfflineCourseInformation/${id}`)

// 获取线下课程学生详情
export const getStudentDetailApi = ({id} = {}) => ajax.get(`${ROOT}/getStudentCourseInfo/${id}`)

// 获取年级
export const getSubjectApi = ({} = {}) => ajax.get(`/base/eduItem`)

//删除课程
export const getDelApi = (id) => ajax.delete(`${ROOT}/deleteCourse/${id}`)
// 线下课程审核
export const auditofflineCourseApi = ({id,status}) => ajax.put(`${ROOT}/audit`,{id,status})