/**
 * 公用的提示框封装
 */
import { Message, MessageBox } from 'element-ui'

/**
 * 统一配置
 * @type {{duration: number, showClose: boolean}}
 */
const def = {duration: 2000, showClose: true}
/**
 * 成功
 * @param message
 * @param opts
 */
export const success = (message = '删除成功！', opts = {}) => Message.success({message, ...def, ...opts})
/**
 * 警告
 * @param message
 * @param opts
 */
export const warning = (message = '删除成功！', opts = {}) => Message.warning({message, ...def, ...opts})
/**
 * 提示
 * @param message
 * @param opts
 */
export const info = (message = '删除成功！', opts = {}) => Message.info({message, ...def, ...opts})
/**
 * 错误
 * @param message
 * @param opts
 */
export const error = (message = '删除成功！', opts = {}) => Message.error({message, ...def, ...opts})
/**
 * 消息
 * @param message
 * @param type
 * @param title
 * @param opts
 */
export const msg = (message = '', type = 'success', title = '提示', opts = {}) => MessageBox(message, title, {type, ...opts})
/**
 * alert
 * @param message
 * @param type
 * @param title
 * @param opts
 */
export const alert = (message = '', type = 'success', title = '提示', opts = {}) => MessageBox.alert(message, title, {type, ...opts})
/**
 * 确认框
 * @param message
 * @param type
 * @param title
 * @param opts
 */
export const confirm = (message = '', type = 'success', title = '提示', opts = {}) => MessageBox.confirm(message, title, {type, ...opts})
/**
 * 弹出框
 * @param message
 * @param type
 * @param title
 * @param opts
 */
export const prompt = (message = '', type = 'success', title = '提示', opts = {}) => MessageBox.prompt(message, title, {type, ...opts})
