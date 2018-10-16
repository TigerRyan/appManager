import ajax from './ajax'
// 根路径
const ROOT = '/send'

// 修改角色
export const updateSendListApi = ({id, num = 1, pid = 0, tips = '', name, menus = []} = {}) => ajax.put(`${ROOT}/update`, {
  id, num, pid, name, menus, tips,
})
// 获取角色列表
export const getSendListApi = ({page = 1, pageSize = 10, menu = true, start, end} = {}) => ajax.post(`${ROOT}/list`, {
  page, pageSize, start, end, menu,
})

// 删除角色
export const delSendApi = (id) => ajax.delete(`${ROOT}/del/${id}`)
