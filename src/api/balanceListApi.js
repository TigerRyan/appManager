import ajax from './ajax'
// 设置根目录
const ROOT = '/settlement'

// 获取搜索列表
export const getBalanceListApi = (obj) => ajax.post(`${ROOT}/find`, obj)

// 获取确认结算 type 0:线下课程结算 1.直播视频结算 2.视频课程结算  
export const getConfirmApi = (courseId,type) => ajax.put(`${ROOT}/confirm`,{courseId,type})

// 获取已结算订单列表
export const getDoneApi = (obj) => ajax.post(`${ROOT}/getDone`,obj)


/*
* @Interface: 搜索结算视频课程列表
* @Url: /settlement/findVideoTopics
* @By: 孙斌
* @Use: 陈叮叮
* @Method: POST
* @Params: 
* page (integer): 当前页 ,
* pageSize (integer, optional): 每页条数 ,
* start (integer, optional): 时间段选择，开始时间,非必填 ,
* end (integer, optional): 时间段选择，结束时间,非必填 ,
* keyType (integer, optional): 关键词类型(选填)：1、课程名称，2、机构名称 ,
* mechanismId (integer, optional): 机构id(选填，不填时查询全部) ,
* keyWord (string, optional): 关键词(选填)，不传或传空默认搜索全部 ,
* status (integer, optional): 结算状态(必填)：0、待结算，1、结算中，2、已结算 ,
* providerId (integer, optional): 服务商id ,
* courseType (integer, optional): 课程类型(1:线下预约机构 2:视频课程 3:直播课程)
type (integer, optional): 视频课程结算类型 1: 机构视频课程结算 2: 平台教师视频课程结算
*/
export const getVideoLessonListApi = ({page = 1, pageSize = 10, keyWord, status, start, end,courseType=2,keyType,type=1 } = {}) => ajax.post(`${ROOT}/findVideoTopics`, {page, pageSize, keyWord, status, start, end, courseType, keyType,type }) 
// export const getVideoLessonListApi = (obj) => ajax.post(`${ROOT}/findVideoTopics`, obj) 

/*
* @Interface: 视频课程确认结算
* @Url:/settlement/confirmVideo
* @By: 孙斌
* @Use: 陈叮叮
* @Method: PUT
* @Params: 
* courseId (integer, optional): 课程id ,
* orderId (integer, optional): 订单id ,
* type (integer, optional): 课程类型(0:线下预约机构 1: 直播课程 2:视频课程）
*/
// 获取确认结算 type 0:线下课程结算 1.直播视频结算 2.视频课程结算  
export const getVideoConfirmApi = (courseId,orderId,type) => ajax.put(`${ROOT}/confirmVideo`,{courseId,type,orderId})


/*
* @Interface: 导出结算视频课程列表
* @Url: /settlement/exportVideoTopics
* @By: 孙斌
* @Use: 陈叮叮
* @Method: Post
* @Params: 
* page (integer): 当前页 ,
*pageSize (integer, optional): 每页条数 ,
*start (integer, optional): 时间段选择，开始时间,非必填 ,
*end (integer, optional): 时间段选择，结束时间,非必填 ,
*keyType (integer, optional): 关键词类型(选填)：1、课程名称，2、机构名称 ,
*mechanismId (integer, optional): 机构id(选填，不填时查询全部) ,
*keyWord (string, optional): 关键词(选填)，不传或传空默认搜索全部 ,
*status (integer, optional): 结算状态(必填)：0、待结算，1、结算中，2、已结算 ,
*providerId (integer, optional): 服务商id ,
*courseType (integer, optional): 课程类型(1:线下预约机构 2:视频课程 3:直播课程)
type (integer, optional): 视频课程结算类型 1: 机构视频课程结算 2: 平台教师视频课程结算
*/
export const exportVideoListApi = ({status, start, end,courseType=2, type}) => ajax.post(`${ROOT}/exportVideoTopics`, {status, start, end,courseType,type })


/*
* @Interface: 获取已结算订单列表
* @Url: /settlement/getDone
* @By: 孙斌
* @Use: 陈叮叮
* @Method: post
* @Params: 
*/
export const getVideoDoneApi = (obj) => ajax.post(`${ROOT}/getDone`,obj)

/*
* @Interface: 获取视频课程专题详情
* @Url: /videoCourse/videoTopic/institution/{topicId}
* @By: 孙斌
* @Use: 陈叮叮
* @Method: GET
* @Params: 
*/
export const getVideoSpecialApi = (topicId) => ajax.get(`/videoCourse/videoTopic/institution/${topicId}`)


// 设置根目录
// 获取已结算详情课程接口
// /course/getCourse/{id}
const ROOT1 = '/course'
export const getSettledApi = (id) => ajax.get(`${ROOT1}/getCourse/${id}`)

// 获取课程服务群体
const ROOT2 = '/base'
export const getServeCourceApi = () => ajax.get(`${ROOT2}/eduItem`)

// 机构详情结算管理
export const getBalancejListApi = ({page=1, pageSize=10,status,providerId}={}) =>ajax.post(`${ROOT}/find`,{page, pageSize,status,providerId})



