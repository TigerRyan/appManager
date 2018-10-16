import ajax from './ajax'
// 设置根目录
const ROOT = '/videoCourse'
// 获取详情页面  GET /videoCourse/videoTopic/institution/{topicId}
export const getVideoDetailApi = topicId =>
  ajax.get(`${ROOT}/videoTopic/institution/${topicId}`)

// 获取章节课程视频列表 POST /videoCourse/institution/{topicId}
export const getVideoCourseListApi = ({
  page = 1,
  pageSize = 10,
  start,
  end,
  topicId,
} = {}) =>
  ajax.post(`${ROOT}/institution/${topicId}`, { page, pageSize, start, end })

// 删除视频课程 DELETE /videoCourse/deleteVideoCourseChapter/{id}
export const deleteVideoCourseChapter = id =>
  ajax.delete(`${ROOT}/deleteVideoCourseChapter/${id}`)
// 设置视频课程章节收费/免 /videoCourse/updateFree/{id}
export const setVideoCourseFree = ({ id, free }) =>
  ajax.put(`${ROOT}/updateFree/${id}/${free}`)
// 编辑视频课程原价和优惠价 /videoCourse/updatePrice/{id}}
export const updatePrice = ({id,salePrice,discountPrice}={}) =>
  ajax.put(`${ROOT}/updatePrice/${id}`, {salePrice,discountPrice})
