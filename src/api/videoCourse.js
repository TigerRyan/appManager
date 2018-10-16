import ajax from './ajax'
// 设置根目录
const ROOT = '/videoCourse'

//章节列表
// /videoCourse/institution/{topicId}
export const getVideoCourseListApi = (topicId,obj={}) => ajax.post(`${ROOT}/institution/${topicId}`,obj)

//章节列表审核
/////videoCourse/updateStatus/{id}/{type}
export const getVideoCourseUpdateStatusApi = (id,type) => ajax.put(`${ROOT}/updateStatus/${id}/${type}`)
///videoCourse/updateStatus/{id}/{type}