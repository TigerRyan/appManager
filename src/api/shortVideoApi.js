import ajax from './ajax'
// 设置根目录/shortVideo/list
const ROOT = '/shortVideo'
// 获取当前用户的视频课程列表
export const getshortVideoApiListApi = ({page = 1, pageSize = 10, videoTitle} = {}) => ajax.post(`${ROOT}/list`, {page, pageSize, videoTitle})

// 新增/shortVideo/add
export const createshortVideoApi = ({videoTitle , videoUrl , videoImg , weight } = {}) => ajax.put(`${ROOT}/add`, {videoTitle , videoUrl , videoImg , weight })

//详情/shortVideo/shortVideo/{id}
export const getDetailshortVideoApi = ({id } = {}) => ajax.get(`${ROOT}/shortVideo/${id}`)

//编辑/shortVideo/edit
export const editshortVideoApi = ({id,videoTitle,weight } = {}) => ajax.put(`${ROOT}/edit`,{id,videoTitle,weight})

//删除/shortVideo/deleteVideo/{ids}
export const deleteshortVideoApi = ({ids} = {ids: ""}) => ajax.delete(`${ROOT}/deleteVideo/${ids}`)


///shortVideo/comments/{id} 评论列表
export const getshortVideoCommentsApiListApi = ({page = 1, pageSize = 10,id } = {}) => ajax.post(`${ROOT}/comments/${id}`, {page, pageSize })


//删除评论///shortVideo/deleteComment/{commentId}
export const deleteCommentshortVideoApi = (ids) => ajax.delete(`${ROOT}/deleteComment/${ids}`)
