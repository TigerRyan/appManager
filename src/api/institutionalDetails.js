import ajax from './ajax'
// 设置根目录
const ROOT = '/manage'

// 获取机构详情
export const getDetailsApi = (mechanismId) => ajax.get(`${ROOT}/getMechanismInfo/${mechanismId}`)

// 获取线下课程订单列表
export const getUnderLineListApi = ({page, pageSize ,status ,mechanismId } = {}) => ajax.post(`/order/findForCourse`, {page, pageSize,status ,mechanismId})

// 获取教学课程
export const getSubjectApi = ({} = {}) => ajax.get(`/base/eduItem`)

// 获取结算列表、
export const getSettlementListApi = ({page, pageSize ,status ,mechanismId } = {}) => ajax.post(`/settlement/find`, {page, pageSize,status ,mechanismId})

//获取提现列表
export const getPutforwardListApi = ({page, pageSize,status,type =1 , userId} = {}) => ajax.post(`/cash/findByMechanism`, {page, pageSize,status,type,userId})


// 获取线下课程视频列表
export const getUnderVideoListApi = ({page, pageSize = 9, mechanismId , topicsName = null } = {}) => ajax.post(`/offlineCourse/getOfflineCourseListForInstitution`, {page, pageSize,mechanismId ,topicsName })

// 获取直播课程视频列表
export const getLiveBroadcastListApi = ({page, pageSize = 9 ,mechanismId,lineTopicsName = null  } = {}) => ajax.post(`/lineTopics/getLineCourseList`, {page, pageSize,mechanismId ,lineTopicsName })

//获取视频课程列表
export const getVideoCourseListApi = ({page, pageSize = 9 ,mechanismId = null  } = {}) => ajax.post(`/videoCourse/institution`, {page, pageSize,mechanismId })