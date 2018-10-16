import ajax from './ajax'
// 设置根目录
// 导出拼课列表/appMember/exportCollageApply
export const exportShareCourseListApi = ({activeTabs, start, end, name}) => ajax.post(`/appMember/exportCollageApply`, {status:activeTabs, start, end, name})

