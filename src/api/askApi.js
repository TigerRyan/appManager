import ajax from './ajax'
// 设置根目录
const ROOT = '/question'
// 获取问答列表
export const getAskApi = ({page=0, pageSize=10, keyWord, subjectId, questioner} = {}) =>ajax.post(`${ROOT}/questionList`,{page, pageSize, keyWord, subjectId, questioner})
// 删除问题
export const delAskApi = (id) => ajax.put(`${ROOT}/deleteQuestion/${id}`)
// 获取回答列表
export const getAnswerApi = ({page=0, pageSize=10, questionId} = {}) =>ajax.post(`${ROOT}/answerList`,{page, pageSize, questionId})
// 删除回答
export const delAnswerApi = (answerId) => ajax.put(`${ROOT}/deleteAnswer/${answerId}`)
// 获取回答页面数据
export const answerPage = (questionId) => ajax.get(`${ROOT}/answerPage/${questionId}`)
