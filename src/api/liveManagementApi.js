import ajax from './ajax'
// 设置根目录
const ROOT = '/lineTopics'

//搜索全部直播课程专题列表  POST /lineTopics/getLineCourseList
export const  getLineCourseListApi = ({page = 1, pageSize = 8,start,end,lineTopicsName})=>ajax.post(`${ROOT}/getLineCourseList`,{page, pageSize,start,end,lineTopicsName})

//删除直播课程专题 DELETE /lineTopics/deleteLineCourse/{lineTopicsId} 
export const deleteLineCourseApi = (lineTopicsId) => ajax.delete(`${ROOT}/deleteLineCourse/${lineTopicsId}`)

//获取直播课程专题详情  GET /lineTopics/getLineCourseInformation/{lineTopicsId}
export const  getLineCourseInformationApi =(lineTopicsId) =>ajax.get(`${ROOT}/getLineCourseInformation/${lineTopicsId}`)

// 获取直播课程章节列表  GET /lineTopics/getLineCourseChapterList/{lineTopicsId}
export const  getLineCourseChapterList =(lineTopicsId,status) =>ajax.get(`${ROOT}/getLineCourseChapterList/${lineTopicsId}/${status}`)

// 删除直播课程章节 DELETE /lineTopics/deleteLivingCourseChapter/{lineChapterId} 
export const deleteLivingCourseChapter = (lineChapterId) => ajax.delete(`${ROOT}/deleteLivingCourseChapter/${lineChapterId}`)

//获取直播课程专题报名学员列表  POST /lineTopics/getLineTopicStudents 
export const  getLineTopicStudentsApi = ({page = 1, pageSize = 10,start,end,topicType=1,topicId})=>ajax.post(`${ROOT}/getLineTopicStudents`,{page, pageSize,start,end,topicType,topicId})
// 审核直播课程章节
export const auditLiveSectionApi = ({id,status}) =>ajax.put(`${ROOT}/audit`,{id,status})