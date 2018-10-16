import moment from 'moment'
import {getEduItemApi} from '../api/baseApi'

/**
 * 格式化过滤器
 * @param r 行
 * @param c 列
 * @param val 值
 */
// 日期格式化
export const dateFilter = (r, c, val) => val ? moment(val).format('YYYY-MM-DD') : '无'
export const dateFi = (val) => val ? moment(val).format('YYYY.MM.DD') : '无'
// 时间格式化
export const timeFilter = (val, format = 'MM-DD') => val ? moment(val).format(format) : '无'
// 时间格式化
export const datesTimeFilter = (r, c, val) => val ? moment(val).format('YYYY年MM月DD日') : '无'
export const date = (val) => val ? moment(val).format('YYYY.MM.DD HH:mm:ss') : '无'

export const datetTimeFilter = (r, c, val) => val ? moment(val).format('HH:mm') : '无'
export const dateTimeFilter = (r, c, val) => val ? moment(val).format('YYYY-MM-DD HH:mm') : '无'
export const datenTimeFilter = (r, c, val) => val ? moment(val).format('YYYY年MM月DD日 HH:mm:ss') : '无'




// 时间间隔格式化
export const diffFilter = (val, type = 'days') => {
  const diff = val ? moment(val).diff(Date.now(), type) : 0
  return diff > 0 ? diff : 0
}
export const detailTimeFilter = (r, c, val) => val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '无'
// 课时计算
export const hourFilter = ({startTime, endTime}) => moment(endTime).diff(moment(startTime), 'hours') || 0

export const hourFil = (startTime, endTime) => moment(endTime).diff(moment(startTime), 'hours') || 0

export const hour = (startTime, endTime) => Math.floor((endTime-startTime)/1000/60/60)


// 默认显示 ‘无’
export const defValFilter01 = (r, c, val) => val || '无'
// 默认值显示 ‘未知’
export const defValFilter02 = (r, c, val) => val || '未知'
// 默认值显示 0
export const defValFilter03 = (r, c, val) => val || 0
// 默认显示 ‘--’
export const defValFilter05 = (r, c, val) => val || '--'
// 审核状态
export const statusFilter01 = (r, c, val) => ['未知', '待审核', '通过', '拒绝'][val] || '未知'

export const openStatusFilter2 = (r, c, val) => ['未知', '审核中', '审核通过','审核失败'][val] || '未知'
export const openStatusFilter = (r, c, val) => ['未开通', '未开通', '已通过','已拒绝'][val] || '未开通'
export const charpterStatusFilter = (r, c, val) => ['待审核', '审核成功', '审核失败'][val] || '未知'
export const charptersStatusFilter = (r, c, val) => ['未审核', '审核通过', '审核不通过'][val] || '未知'
// 启用状态
export const statueFilter = (r, c, val) => ['启用', '禁用'][val] || '未知'
// 启用状态
export const authenticationFilter = (r, c, val) => ['未认证', '待审核','已认证','认证失败'][val] || '未知'
// 推荐状态
export const isRecommendFilter = (r, c, val) => ['推荐', '不推荐'][val] || '未知'
// 采纳状态
export const isAcceptFilter = (r, c, val) => ['未采纳', '已采纳'][val] || '未知'
// 货币显示格式化
export const currencyFilter = (r, c, val) => val * 1 ? (val * 1).toFixed(2) : '0.00'
// 签约身份
export const signPersonFilter = (r, c, val) => ['企业', '个人'][val] || '未知'
// 身份状态
export const defValFilter04 = (r, c, val) => ['未知', '学生', '老师'][val]
// 课程计价方式
export const courseTypeFilter = (r, c, val) => ['小时', '天', '一周', '月'][val]
// 广告类型
export const bannerTypeFilter = (r, c, val) => ['APP首页广告', '引导页广告'][val] || '未知'
// 公告类型
export const noticeTypeFilter = (r, c, val) => ['公告', '推送'][val]
// 是否被预约
export const subscribeFilter = (r, c, val) => ['未预约', '已预约'][val] || '未预约'
// 退款状态
export const refundFilter = (r, c, val) => ['待处理', '已同意', '已拒绝'][val] || '已同意'
// 审核状态
export const auditFilter = (r, c, val) => val === 2 ? '已审核' : '未审核'
// 提现状态
export const cashFilter = (r, c, val) => ['未知', '待审核', '审核成功', '审核失败'][val] || '未知'
// 发课状态
export const courseFilter = (r, c, val) => ['等待审核', '发布成功', '发布失败'][val] || '发布失败'
// 账户类型
export const accountTypeFilter = (r, c, val) => ['企业', '个人'][val] || '未知'

export const auditFilter2 = (r, c, val) => ['未知', '审核中', '审核成功', '审核失败', '打款中'][val] || '未知'
// 课程类型,0 : 线下课程 1：直播课程 2：视屏课程
export const courseTypeFilter02 = (r, c, val) => ['线下课程', '直播课程', '视频课程'][val] || '未知'
// 课程服务群体,教学科目
let eduItemMap
export const courseGradeFilter = (r, c, val) => {
  if (!eduItemMap) {
    eduItemMap = {}
    getEduItemApi().then(list => list.forEach(({id, itemName}) => {
      eduItemMap[id] = itemName
    }))
  }
  return eduItemMap[val] || '未知'
}
// 课程服务群体,教学科目 防止异步
export const gradeCourseFilter = (r, c, val,list) => {
  let eduItemMap
  list.forEach((ele,index) => {
  if(val == ele.id){
  eduItemMap = ele.itemName
  }
  })
  return eduItemMap || '未知'
  }
// 银行卡号打***
export const cardFilter = (r, c, val) => '**** **** ****' + val.substr(-4, 4)
// 行业标签
let industryMap
export const industryFilter = (list) => {
  return (r, c, val) => {
    if (!industryMap) {
      industryMap = {}
      list.forEach(({id, name}) => {
        industryMap[id] = name
      })
    }
    return industryMap[val] || '未知'
  }
}
// 支付方式
export const payTypeFilter = (r, c, val) => ['其他', '微信', '支付宝', '余额支付', '银行', '其他'][val] || '其他'
// 用户类型
export const userTypeFilter = (r, c, val) => ['未知', '学生', '平台教师', '机构教师'][val] || '未知'

export const payTypeFilter2 = (r, c, val) => ['', '支付宝','微信', '余额支付'][val] || '其他'

export const payTypeFilter3 = (r, c, val) => ['','微信', '支付宝', '余额支付'][val] || '其他'
// 状态计算,0:未开始，1:进行中，2：已结束
export const statusFilter = (starttime, endtime) => Date.now() < starttime ? 0 : (starttime <= Date.now() && Date.now() <= endtime) ? 1 : 2
// 预约课程状态
export const subStatusFilter = (r, c, val) => ['待支付', '已支付', '支付失败', '取消预约', '已完成', '退款中', '已退款', '拒绝退款', '上课中', '已评价'][val] || '未知'
// 资讯分类
export const informationTypeFilter = (r, c, val) => ['图文', '视频'][val] || '未知'

// 活动管理
export const weizhi = (r, c, val) => val == 0?'学生首页':'商城首页'
export const fourGeTypeFilter = (r, c, val) => ['','教师', '机构','商品','咨讯','视频','直播','线下课程'][val] || '未知'
export const template = (r, c, val) =>['', '', '四格模板', '三格模板', '机构模板', '左右模板', '轮播模板', '', '', '','','视图模板','商品模板','','精选老师模板','线下课程模板一模板','线下课程模板二模板','线下课程模板三模板','线下课程模板四模板','机构模板二模板','机构模板三模板','直播课程模板一模板','机构模板四模板'][val] || '未知'
export const status = (r, c, val) => ['开启', '关闭'][val] || '未知'
export const typeFilter = (r, c, val) => ['',1, 2, 3, 4, 5, 6, 7][val]

// 订单状态
export const orderFilter = (r, c, val) => ['待支付', '待发货', '待收货', '已发货', '退货/售后', '订单关闭'][val] || '未知'
// 身份状态
export const teacherFilter = (r, c, val) => ['初级教师', '中级教师', '高级教师'][val]
//直播状态
export const liveStateFilter = (r, c, val) => ['直播中', '回放中', '等待直播','暂无直播'][val]
//文章标签
export const labelFilter = (r, c, val) => val.split(',').join('、')
// 转json数据
export const JsonFilter = (r, c, val) => {
  if(!val){
    return '--'
  }else{
    if(val.search('remark')<0){
      return '--'
    }else{
      let str = val.split('"remark":')[1];
      let i = str.length
      return str.slice(1,i-2)
    }
  }
}
// 所属机构状态
export const jgStatusFilter = (r, c, val) =>['未审核', '审核中', '审核通过', '审核失败'][val]
// 结算状态
export const jsStatusFilter = (r, c, val) =>['待审核 ', '审核通过', '审核不通过'][val]
// 百分比显示转换
export const rateFilter = (r, c, val) => val * 1 ? (val * 100).toFixed(2)+'%' : '0'
// 视频课程章节是否免费
export const videoCourseFree = (r, c, val) =>['免费','收费'][val] 

// 所属机构状态
export const videoCourseFilter = (r, c, val) =>['待付款', '已付款', '已取消'][val]


