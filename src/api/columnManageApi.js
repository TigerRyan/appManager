import ajax from './ajax'
// 根路径
const ROOT = '/information'

// 获取栏目列表  POST /information/getInformationTitle
export const getColumnListApi = ({
    page = 1,
    pageSize = 10,
    start,
    end,
    orderBy = 1,
  }) =>
  ajax.post(`${ROOT}/getInformationTitle`, {
    page,
    pageSize,
    start,
    end,
    orderBy,
  })

// 修改栏目 PUT /information/updateInformationTitle
export const updateColumnApi = ({
    id,
    name,
    weight,
    status
  }) =>
  ajax.put(`${ROOT}/updateInformationTitle`, {
    id,
    name,
    weight,
    status
  })

// 新增栏目 POST /information/createTitle
export const createColumnApi = ({
    name,
    weight,
    status
  }) =>
  ajax.post(`${ROOT}/createTitle`, {
    name,
    weight,
    status
  })

// 删除栏目 DELETE /information/deleteTitle/{titleId}
export const deleteColumnApi = titleId =>
  ajax.delete(`${ROOT}/deleteTitle/${titleId}`)

//查看文章  POST /information/list
export const getArticleDetailsApi = ({
    page = 1,
    pageSize = 10,
    titleId
  } = {}) =>
  ajax.post(`${ROOT}/list`, {
    page,
    pageSize,
    titleId
  })
