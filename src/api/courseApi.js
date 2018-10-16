import ajax from './ajax'
// 设置根目录
const ROOT = '/course'
// 获取预约课程列表
export const getSubscribeApi = ({page = 1, pageSize = 10, name, status, teacherId, studentId} = {}) => ajax.post(`/subscribe/list`, {page, pageSize, name, status, teacherId, studentId})
// 获取课程
export const getCourseApi = ({page = 1, pageSize = 10, userId, keyWord, courseStatus} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, userId, keyWord, courseStatus})
// 获取课程
export const getListByTeacherApi = ({page = 1, pageSize = 10, keyWord} = {}) => ajax.post(`${ROOT}/listByTeacher`, {page, pageSize, keyWord})
// 获取课程统计
export const getCourseCountApi = (userId) => ajax.get(`${ROOT}/count/${userId}`)
