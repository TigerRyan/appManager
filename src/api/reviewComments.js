import ajax from './ajax'
// 设置根目录
const ROOT = '/information'

// 获取评论列表
export const getCommentListApi = ({page, pageSize, id, infoId=null } = {}) => ajax.post(`${ROOT}/informationCommentList`,{page, pageSize,id,infoId})

//删除评论
export const getDelApi = ({page, pageSize,  id=null } = {}) => ajax.post(`${ROOT}/deleteInformationComment`,{page, pageSize,id})