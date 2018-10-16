import ajax from './ajax'
// 设置根目录
const ROOT = '/appMember'

/*
* @Interface: 提高课时费申请列表
* @Url: /appMember/courseFeeApply
* @By: 阮班胜
* @Use: 陈叮叮
* @Method: POST
* @Params: 
* page (integer): 当前页 ,
* pageSize (integer, optional): 每页条数 ,
* start (integer, optional): 时间段选择，开始时间,非必填 ,
* end (integer, optional): 时间段选择，结束时间,非必填 ,
* status (integer, optional): 审核状态 1：待审核 2：通过 3：拒绝' ,
* keyWord (string, optional): 查询关键词 教师名称/手机号码/申请系列号
*/
export const getLessonListApi = ({page = 1, pageSize = 10, keyWord, status = 1, start, end} = {}) => ajax.post(`${ROOT}/courseFeeApply`, {page, pageSize, keyWord, status, start, end}) 


/*
* @Interface: 导出提高课时费申请列表
* @Url: /appMember/exportCourseFeeApply
* @By: 阮班胜
* @Use: 陈叮叮
* @Method: POST
* @Params: 
* page (integer): 当前页 ,
* pageSize (integer, optional): 每页条数 ,
* start (integer, optional): 时间段选择，开始时间,非必填 ,
* end (integer, optional): 时间段选择，结束时间,非必填 ,
* status (integer, optional): 审核状态 1：待审核 2：通过 3：拒绝' ,
* keyWord (string, optional): 查询关键词 教师名称/手机号码/申请系列号
*/
export const exportLessonListApi = ({status = 1, start, end, keyWord }) => ajax.post(`${ROOT}/exportCourseFeeApply`, {status, start, end, keyWord })

/*
* @Interface: 通过/拒绝 提高课时费申请列表
* @Url: /appMember/audit/{ids}/{status}
* @By: 阮班胜
* @Use: 陈叮叮
* @Method: PUT
* @Params: 
*/
export const getPassReApi = ({ids,status}) => ajax.put(`${ROOT}/audit/${ids}/${status}`, {ids,status})






