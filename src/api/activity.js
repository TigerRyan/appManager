import ajax from './ajax'


// 设置根目录
const ROOT = '/activity'
//获取活动管理首页列表
export const getActiviListApi = ({page, pageSize , menu = true} = {}) => ajax.post(`${ROOT}/getIndexList`, {page, pageSize, menu})

//创建模块
export const createModulApi = ({name, type , weight, template,gradeId =null} = {}) => ajax.post(`${ROOT}/createModule`, {name, type , weight, template,gradeId})

// 获取机构或商品下的已(未)添加的数据列表
export const gettoAddApi = ({page, pageSize , moduleType,moduleId ,queryType,queryName=null} = {}) => ajax.post(`${ROOT}/dataList`, {page, pageSize , moduleType,moduleId ,queryType,queryName})

export const gettoGradeAddApi = ({page, pageSize , moduleType,moduleId ,queryType,queryName=null,gradeId=null} = {}) => ajax.post(`${ROOT}/dataList`, {page, pageSize , moduleType,moduleId ,queryType,queryName,gradeId})

// 刪除模块
export const deletModulApi = ({moduleId} = {}) => ajax.delete(`${ROOT}/deleteModule/${moduleId}`)

// 四格图片
export const fourGeApi = ({moduleId} = {}) => ajax.post(`${ROOT}/particularsList/${moduleId}`)

// 批量添加
export const addApi = ({moduleId, moduleType,ids } = {}) => ajax.post(`${ROOT}/addData`, {moduleId, moduleType,ids})

// 轮播、三格等模板下活动详情信息
export const particularsListApi = ({moduleId} = {}) => ajax.post(`${ROOT}/particularsList/${moduleId}`,{moduleId})

//添加轮播、三格等模块下的活动详情信息
export const addParticularsApi = ({name, type , weight, image,imageUrl,dataType,moduleId } = {}) => ajax.post(`${ROOT}/addParticulars`, {name, type , weight, image,imageUrl,dataType,moduleId })

//获取详情内容下-内置跳转方式的教师、机构、商品、资讯、视频、直播、线下课程列表
export const detailsApi = ({page, pageSize ,queryType ,dataType ,queryName,particularsId } = {}) => ajax.post(`${ROOT}/details`,{page, pageSize ,queryType ,dataType ,queryName,particularsId})

// 添加详情内容下-内置跳转方式的教师、机构等信息
export const addContentApi = ({particularId,ids} = {}) => ajax.post(`${ROOT}/addParticularsData/${particularId}`,ids)

// 删除详情下的列表
export const deletContentApi = ({moduleId,id} = {}) => ajax.delete(`${ROOT}/deleteParticulars/${moduleId}/${id}`)

//排序后修改活动下数据 PUT /activity/data/{moduleId}/{ids}
export const sortIdsApi =({moduleId,ids} = {}) => ajax.put(`${ROOT}/data/${moduleId}/${ids}`)

//排序后修改图文活动下数据 PUT /activity/data/{moduleId}/{ids}
export const sortParticularIdsApi =({particularId,ids} = {}) => ajax.put(`${ROOT}/particularData/${particularId}/${ids}`)

// 删除详情下的列表
export const deletDatatApi = ({dataId,id} = {}) => ajax.delete(`${ROOT}/deleteData/${id}/${dataId}`)

// 状态切换
export const openApi = ({moduleId,status} = {}) => ajax.post(`${ROOT}/changeModuleStatus/${moduleId}/${status}`)

// 查询首页下的详情
export const getActivityDetailApi = ({id} = {}) => ajax.get(`${ROOT}/module/${id}`)

// 修改活动编辑
export const updataApi = ({id, name,weight } = {}) => ajax.put(`${ROOT}/module`, {id, name,weight})

// 查询活动下的详情
export const getActivityApi = ({id} = {}) => ajax.get(`${ROOT}/particulars/${id}`)

// 修改活动下的详情
export const updataDetailApi = ({id, name,weight,image,type   } = {}) => ajax.put(`${ROOT}/particulars/${id}`, { name,weight,image,type  })

// 获取教学年级
export const getGradeApi = ({} = {}) => ajax.get(`/base/eduItem`)