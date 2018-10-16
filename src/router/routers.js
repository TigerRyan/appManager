/**
 * 路由页面定义 transfer
 */
export default [
  // 主页
  {path: `/`, redirect: `/view/home`},
  // 登录
  {path: `/login`, component: require('../view/login/Login.vue').default, name: 'login', meta: {title: '登录'}},
  // 二维码登录
  {path: `/loginCode`, component: require('../view/login/LoginCode.vue').default, name: 'loginCode', meta: {title: '二维码登录'}},
  {
    path: `/view`,
    component: require('../view/Home.vue').default,
    children: [
      // 主页
      {path: `home`, component: require('../view/home/Home.vue').default, name: 'home', meta: {title: '主页'}},
      // 系统管理
      {path: `system/admin`, component: require('../view/system/admin/AdminList.vue').default, name: 'adminList', meta: {title: '管理员'}},
      {path: `system/admin/:id`, component: require('../view/system/admin/AdminEdit.vue').default, name: 'adminEdit', meta: {title: '编辑管理员'}},
      {path: `system/role`, component: require('../view/system/role/RoleList.vue').default, name: 'roleList', meta: {title: '角色'}},
      {path: `system/role/:id`, component: require('../view/system/role/RoleEdit.vue').default, name: 'roleEdit', meta: {title: '编辑角色'}},
      {path: `system/menu`, component: require('../view/system/menu/MenuList.vue').default, name: 'menuList', meta: {title: '权限菜单'}},
      {path: `system/log`, component: require('../view/system/log/LogList.vue').default, name: 'logList', meta: {title: '日志'}},
      {path: `system/config/discount`, component: require('../view/system/config/Discount.vue').default, name: 'discountConfig', meta: {title: '优惠设置'}},
      {path: `system/config/integralBase`, component: require('../view/system/config/IntegralBase.vue').default, name: 'integralBaseConfig', meta: {title: '积分设置'}},
      // {path: `system/config/payMoney`, component: require('../view/system/config/PayMoney.vue').default, name: 'payMoneyConfig', meta: {title: '课时费设置'}},
      {path: `system/config/domain`, component: require('../view/system/config/Domain.vue').default, name: 'domainConfig', meta: {title: 'APP域名设置'}},
      {path: `system/config/classFees`, component:require('../view/system/config/ClassFees.vue').default, name:'classFees',meta:{title:'课时费设置'}},
      {path: `system/config/institutionRatio`, component: require('../view/system/config/InstitutionRatio.vue').default, name:'institutionRatio',meta:{title: '机构分成比例'}},
      {path: `system/config/offlineSettlementDays`, component: require('../view/system/config/OfflineSettlementDays.vue').default, name:'offlineSettlementDays', mate:{title:'线下结算周期'}},
      {path: `system/config/VideoSettlementDays`, component: require('../view/system/config/VideoSettlementDays.vue').default, name:'VideoSettlementDays', mate:{title:'视频结算周期'}},
      {path: `system/config/VideoMechanism`, component: require('../view/system/config/VideoMechanism.vue').default, name:'VideoMechanism', mate:{title:'视频机构分成比例'}},
      {path: `system/config/VideoTeacher`, component: require('../view/system/config/VideoTeacher.vue').default, name:'VideoTeacher', mate:{title:'视频教师分成比例'}},
      {path: `system/config/VideoServiceProvider`, component: require('../view/system/config/VideoServiceProvider.vue').default, name:'VideoServiceProvider', mate:{title:'视频服务商分成比例'}},

      {path: `system/config/refundTime`, component: require('../view/system/config/RefundTime.vue').default, name:'refundTime', mate:{title:'退款时间设置'}},
      {path: `system/config/serviceContractDays`, component: require('../view/system/config/ServiceContractDays.vue').default, name:'serviceContractDays', mate:{title:'服务商合约周期'}},
      {path: `system/config/serviceRatio`, component: require('../view/system/config/ServiceRatio.vue').default, name:'serviceRatio', mate:{title:'服务商分成比例'}},
      {path: `system/config/studentCashCharge`, component: require('../view/system/config/StudentCashCharge.vue').default, name:'studentCashCharge',meta:{title:'学生提现手续费'}},
      {path: `system/config/teacherCashCharge`, component: require('../view/system/config/TeacherCashCharge.vue').default, name:'teacherCashCharge',meta:{title:'老师提现手续费'}},
      {path: `system/config/teachersLevel`, component: require('../view/system/config/TeachersLevel.vue').default, name:'teachersLevel',meta:{title:'老师等级'}},
      {path: `system/config/teacherTransfer`, component: require('../view/system/config/TeacherTransfer.vue').default, name:'teacherTransfer',meta:{title:'老师转账额度限制'}},
      {path: `system/config/shareCourse`, component: require('../view/system/config/shareCourse.vue').default, name:'shareCourseConfig',meta:{title:'拼课人数上限设置'}},
      {path: `system/setExtract`, component: require('../view/system/setExtract/index.vue').default, name:'setExtract',meta:{title:'用户提现额度设置'}},

      // 用户管理
      {path: `user/student`, component: require('../view/user/student/List.vue').default, name: 'studentList', meta: {title: '学生列表'}},
      {path: `user/student/:id`, component: require('../view/user/student/Editor.vue').default, name: 'studentEditor', meta: {title: '编辑学生'}},
      {path: `student/studentDetails`, component: require('../view/user/student/studentDetails.vue').default, name: 'studentDetails', meta: {title: '学生详情'}},
      {path: `user/teacher`, component: require('../view/user/teacher/List.vue').default, name: 'teacherList', meta: {title: '老师列表'}},
      {path: `user/teacher/:id`, component: require('../view/user/teacher/Editor.vue').default, name: 'teacherEditor', meta: {title: '编辑老师'}},
      {path: `teacher/teacherDetails`, component: require('../view/teacher/teacherDetails.vue').default, name: 'teacherDetails', meta: {title: '教师详情'}},

      {path: `user/:id`, component: require('../view/user/Detail.vue').default, name: 'userDetail', meta: {title: '用户详情'}},
      // 认证管理
      {path: `certification/teacher`, component: require('../view/certification/teacher.vue').default, name: 'certificationTeacher', meta: {title: '教师认证'}},
      {path: `certification/organization`, component: require('../view/certification/organization.vue').default, name: 'certificationOrganization', meta: {title: '机构认证'}},
      {path: `certification/supplier`, component: require('../view/certification/supplier.vue').default, name: 'certificationSupplier', meta: {title: '服务商认证'}},
      // {path: `certification/watchDetail/:id`, component: require('../view/certification/watchDetail.vue').default, name: 'certificationWatchDetail', meta: {title: '机构认证'}},
      // 提现管理
      // {path: `cash/pass`, component: require('../view/cash/pass/Teacher.vue').default, name: 'cashPass', meta: {title: '认证成功'}},
      //{path: `cash/wait`, component: require('../view/cash/wait/Teacher.vue').default, name: 'cashWait', meta: {title: '待审核'}},
      // {path: `cash/fail`, component: require('../view/cash/fail/Teacher.vue').default, name: 'cashFail', meta: {title: '认证失败'}},
      {path: `cash/app`, component: require('../view/cash/app.vue').default, name: 'cashApp', meta: {title: 'App提现'}},
      {path: `cash/supplier`, component: require('../view/cash/supplier.vue').default, name: 'cashSupplier', meta: {title: '服务商提现'}},
      {path: `cash/organization`, component: require('../view/cash/organization.vue').default, name: 'cashOrganization', meta: {title: '机构提现'}},
      // 约课管理
      {path: `orderClass/waitOrder`, component: require('../view/orderClass/waitOrder/List.vue').default, name: 'waitOrder', meta: {title: '待预约'}},
      {path: `orderClass/waitPay`, component: require('../view/orderClass/waitPay/List.vue').default, name: 'waitPay', meta: {title: '待支付'}},
      {path: `orderClass/payed`, component: require('../view/orderClass/payed/List.vue').default, name: 'payed', meta: {title: '已支付'}},
      {path: `orderClass/classing`, component: require('../view/orderClass/classing/List.vue').default, name: 'classing', meta: {title: '上课中'}},
      {path: `orderClass/classed`, component: require('../view/orderClass/classed/List.vue').default, name: 'classed', meta: {title: '已完成'}},
      {path: `orderClass/refunding`, component: require('../view/orderClass/refunding/List.vue').default, name: 'refunding', meta: {title: '退款中'}},
      {path: `orderClass/refunded`, component: require('../view/orderClass/refunded/List.vue').default, name: 'refunded', meta: {title: '已退款'}},
      // {path: `orderClass/refuseRefund`, component: require('../view/orderClass/refuseRefund/Teacher.vue').default, name: 'refuseRefund', meta: {title: '拒绝退款'}},
      // 账单管理
      {path: `order/list`, component: require('../view/order/List.vue').default, name: 'orderList', meta: {title: '账单管理'}},
      // banner管理
      {path: `banner/list`, component: require('../view/banner/List.vue').default, name: 'bannerList', meta: {title: 'banner列表'}},
      {path: `banner/info/:id`, component: require('../view/banner/Edit.vue').default, name: 'bannerEdit', meta: {title: '编辑banner'}},
      // 公告管理
      {path: `notice/list`, component: require('../view/notice/List.vue').default, name: 'noticeList', meta: {title: '公告列表'}},
      // 银行卡管理
      {path: `bankCard/list`, component: require('../view/bankCard/List.vue').default, name: 'bankCardPass', meta: {title: '公告列表'}},
      // 等级管理
      {path: `level/list`, component: require('../view/level/List.vue').default, name: 'levelList', meta: {title: '等级列表'}},
      // 直播课程管理
      {path: `liveRadio/Success`, component: require('../view/liveRadio/Success.vue').default, name: 'liveRadioSuccess', meta: {title: '直播管理'}},
      {path: `liveRadio/Wait`, component: require('../view/liveRadio/Wait.vue').default, name: 'liveRadioWait', meta: {title: '直播管理'}},
      // 视频课程管理
      {path: `video/Success`, component: require('../view/video/Success.vue').default, name: 'videoSuccess', meta: {title: '视频管理'}},
      {path: `video/index`, component: require('../view/video/index.vue').default, name:'videoIndex', meta: { title: '视频管理'}},
      {path: `video/detail`, component: require('../view/video/detail.vue').default, name: 'videoDetail', meta: {title: '视频专题详情'}},
      {path: `video/chapter`, component: require('../view/video/chapter.vue').default, name: 'videoChapter', meta: {title: '视频管理章节'}},

       // 直播管理
       {path: `live_management/index`, component: require('../view/live_management/index.vue').default, name:'liveManagement', meta: { title: '直播管理'}},
       {path: `live_management/detail`, component: require('../view/live_management/detail.vue').default, name: 'liveDetail', meta: {title: '直播专题详情'}},

      // 订单管理
      // {path: `order_manager/Success`, component: require('../view/order_manager/Success.vue').default, name: 'orderSuccess', meta: {title: '视频管理'}},
      // {path: `order_manager/Fail`, component: require('../view/order_manager/Fail.vue').default, name: 'orderFail', meta: {title: '视频管理'}},
      {path: `order_manager/goodsList`, component: require('../view/order_manager/goodsList.vue').default, name: 'goodsList', meta: {title: '商品订单'}},
      {path: `order_manager/goodsDetail`, component: require('../view/order_manager/goodsDetail.vue').default, name: 'goodsDetail', meta: {title: '商品订单详情'}},

      {path: `order_manager/offlineList`, component: require('../view/order_manager/offlineList.vue').default, name: 'offlineList', meta: {title: '线下课程订单'}},
      {path: `order_manager/offlineDetail`, component: require('../view/order_manager/offlineDetail.vue').default, name: 'offlineDetail', meta: {title: '线下课程订单详情'}},
      {path: `order_manager/reserveList`, component: require('../view/order_manager/reserveList.vue').default, name: 'reserveList', meta: {title: '预约订单'}},
      {path: `order_manager/reserveDetail`, component: require('../view/order_manager/reserveDetail.vue').default, name: 'reserveDetail', meta: {title: '预约订单详情'}},

      // 数据查询  
      {path: `orderQuery/underLineCourse`, component: require('../view/orderQuery/underLineCourse.vue').default, name: 'underLineCourse', meta: {title: '线下课程订单查询'}},
      {path: `orderQuery/reserveListSearch`, component: require('../view/orderQuery/reserveListSearch.vue').default, name: 'reserveListSearch', meta: {title: '预约订单查询'}},
      {path: `orderQuery/listSearch`, component: require('../view/orderQuery/search.vue').default, name: 'transferSearch', meta: {title: '转账管理查询'}},

      // 机构会员管理
      {path: `organ/Success`, component: require('../view/organ/Success.vue').default, name: 'organSuccess', meta: {title: '机构会员'}},
      {path: `organ/Wait`, component: require('../view/organ/Wait.vue').default, name: 'organRecommended', meta: {title: '推荐机构'}},
      {path: `organ/mechanismDetail`, component: require('../view/organ/mechanismDetail.vue').default, name: 'mechanismDetail', meta: {title: '机构详情'}},
      {path: `organ/seachList`, component: require('../view/organ/seachList.vue').default, name: 'seachList', meta: {title: '机构查询'}},
      {path: `organ/seachInfo`, component: require('../view/organ/seachInfo.vue').default, name: 'seachInfo', meta: {title: '机构查询详情'}},
      // 教师管理
      {path: `teacher/Member`, component: require('../view/teacher/Member.vue').default, name: 'teacherMember', meta: {title: '教师会员'}},
      {path: `teacher/Recommended`, component: require('../view/teacher/Recommended.vue').default, name: 'teacherRecommended', meta: {title: '推荐教师'}},

      //服务商管理 (请勿删除)
      {path: `service_provider/managementList`, component: require('../view/service_provider/managementList.vue').default, name: 'managementList', meta: {title: '服务商列表'}},
      {path: `service_provider/managementDetail`, component: require('../view/service_provider/managementDetail.vue').default, name: 'managementDetail', meta: {title: '服务商详情'}},
     // 服务商签约管理
      {path: `service_provider/managementSignList`, component: require('../view/service_provider/managementSignList.vue').default, name: 'managementSignList', meta: {title: '服务商列表'}},
      //消息管理
      {path: `news_manager/newsList`, component: require('../view/news_manager/newsList.vue').default, name: 'newsList', meta: {title: '消息管理'}},

      // 服务管理
      {path: `service/liveRadioService`, component: require('../view/service/liveRadioService/List.vue').default, name: 'liveRadioServiceList', meta: {title: '直播'}},
      {path: `service/videoService`, component: require('../view/service/videoService/List.vue').default, name: 'videoServiceList', meta: {title: '视频'}},
      {path: `service/lineService`, component: require('../view/service/lineService/List.vue').default, name: 'lineServiceList', meta: {title: '线下'}},
      {path: `service/voteService`, component: require('../view/service/voteService/List.vue').default, name: 'voteServiceList', meta: {title: '教学优势'}},
      // 分类管理
      // {path: `cate/List`, component: require('../view/cate/Answer.vue').default, name: 'cateList', meta: {title: '分类管理'}},

      // app系统配置
      {path: `appSystem/classification`, component: require('../view/appSystem/Classification.vue').default, name: 'classification', meta: {title: '科目分类'}},
      {path: `appSystem/agencyIndustry`, component: require('../view/appSystem/AgencyIndustry.vue').default, name: 'agencyIndustry', meta: {title: '机构行业'}},
      {path: `appSystem/gradeCate`, component: require('../view/appSystem/GradeCate.vue').default, name: 'gradeCate', meta: {title: '年级分类'}},
      {path: `appSystem/keywords`, component: require('../view/appSystem/Keywords.vue').default, name: 'keywords', meta: {title: '关键字设置'}},

      // 转账管理
      // {path: `transfer/pass`, component: require('../view/transfer/pass/Teacher.vue').default, name: 'transferPass', meta: {title: '转账成功'}},
      // {path: `transfer/transferIng`, component: require('../view/transfer/transfering/Teacher.vue').default, name: 'transferIng', meta: {title: '转账中'}},
      {path: `transfer/list`, component: require('../view/transfer/list.vue').default, name: 'transferList', meta: {title: '转账管理'}},

      // 结算管理
      {path: `balance/list`, component: require('../view/balance/list.vue').default, name: 'balanceList', meta: {title: '结算管理'}},
      {path: `balance/list/nosettled`, component: require('../view/balance/nosettled.vue').default, name: 'balanceNosettled', meta: {title: '待结算详情'}},
      {path: `balance/list/setting`, component: require('../view/balance/setting.vue').default, name: 'balanceSetting', meta: {title: '结算中详情'}},
      {path: `balance/list/settled`, component: require('../view/balance/settled.vue').default, name: 'balanceSettled', meta: {title: '已结算详情'}},
      
      //视频课程结算管理
      {path: `balance/videoList`, component: require('../view/balance/videoList.vue').default, name: 'balanceVideoList', meta: {title: '视频课程结算管理'}},
      {path: `balance/videoDetail`, component: require('../view/balance/videoDetail.vue').default, name: 'balanceVideoDetail', meta: {title: '视频课程结算详情'}},

      // 资讯管理
      {path: `information/columnAdd`, component: require('../view/information/columnAdd.vue').default, name: 'columnAdd', meta: {title: '添加栏目'}},
      {path: `information/columnList`, component: require('../view/information/columnList.vue').default, name: 'columnList', meta: {title: '栏目管理'}},
      {path: `information/articleDetails/:id`, component: require('../view/information/articleDetails.vue').default, name: 'articleDetails', meta: {title: '文章详情'}},
      {path: `information/informationAdd`, component: require('../view/information/informationAdd.vue').default, name: 'informationAdd', meta: {title: '新增资讯'}},
      {path: `information/informationList`, component: require('../view/information/informationList.vue').default, name: 'informationList', meta: {title: '资讯列表'}},
      {path: `information/reviewComments`, component: require('../view/information/reviewComments.vue').default, name: 'reviewComments', meta: {title: '查看评论'}},

      // 商城管理
      {path: `mall/goodsIndex`, component: require('../view/mall/goodsIndex.vue').default, name: 'goodsIndex', meta: {title: '商品管理'}},
      {path: `mall/publishGoods`, component: require('../view/mall/publishGoods.vue').default, name: 'mallPublishGoods', meta: {title: '发布商品'}},
      {path: `mall/sellGoods`, component: require('../view/mall/sellGoods.vue').default, name: 'mallSellGoods', meta: {title: '出售中的商品'}},
      {path: `mall/classifyGoods`, component: require('../view/mall/classifyGoods.vue').default, name: 'mallClassifyGoods', meta: {title: '商品分类'}},
      {path: `mall/storeGoods`, component: require('../view/mall/storeGoods.vue').default, name: 'mallStoreGoods', meta: {title: '仓库中的商品'}},

      // 活动管理
      {path: `active/list`, component: require('../view/active/list.vue').default, name: 'activeList', meta: {title: '活动管理'}},
      {path: `active/addData`, component: require('../view/active/addData.vue').default, name: 'activeaddData', meta: {title: '新增模块活动'}},
      {path: `active/modulData`, component: require('../view/active/modulData.vue').default, name: 'modulData', meta: {title: '模块活动数据'}},
      {path: `active/otherModul`, component: require('../view/active/otherModul.vue').default, name: 'otherModul', meta: {title: '模块数据'}},
      {path: `active/typeModul`, component: require('../view/active/typeModul.vue').default, name: 'typeModul', meta: {title: '数据类型模块列表'}},
      {path: `active/imgModul`, component: require('../view/active/imgModul.vue').default, name: 'imgModul', meta: {title: '添加类型模块列表'}},
      // 问答管理
      {path: `question/ask`, component: require('../view/question/Ask.vue').default, name: 'ask', meta: {title:'问题列表'}},
      {path: `question/ask/:id`, component: require('../view/question/Answer.vue').default, name: 'answer', meta: {title:'回答列表'}},

      // 积分设置
      {path: `integral/teacher`, component: require('../view/integral/Teacher.vue').default, name: 'teacherIntegral',meta: {title:'积分获取任务（老师）'}},
      {path: `integral/student`, component: require('../view/integral/Student.vue').default, name: 'studentIntegral',meta: {title:'积分获取任务（学生）'}},

      // 线下课程管理
      {path: `offlineCourse/detail`, component: require('../view/offlineCourse/detail.vue').default, name: 'detail', meta: {title: '线下课程主页'}},
      {path: `offlineCourse/index`, component: require('../view/offlineCourse/index.vue').default, name:'index', meta: { title: '线下课程管理'}},

      // 宝券管理
      {path: `treasureTicket/index`, component: require('../view/treasureTicket/index.vue').default, name:'treasureTicket', meta: { title: '宝券管理'}},
      {path: `treasureTicket/rankingList`, component: require('../view/treasureTicket/rankingList.vue').default, name:'rankingList', meta: { title: '宝券列表'}},

      // 学习券管理
      {path: `voucherManager/index`, component: require('../view/voucherManager/index.vue').default, name:'voucherManager', meta: { title: '学习券管理'}},
      
      // 充值管理
      {path: `userpayManager/index`, component: require('../view/userpayManager/index.vue').default, name:'userpayManager', meta: { title: '充值管理'}},

      // 购物券管理
      {path: `shoppingTicket/index`, component: require('../view/shoppingTicket/index.vue').default, name:'shoppingTicket', meta: { title: '购物券管理'}},
      
      // 兑换商品管理
      {path: `exchange/exchangeOfgoods`, component: require('../view/exchange/exchangeOfgoods.vue').default, name: 'exchangeOfgoods', meta: {title: '兑换商品管理'}},
      
      // 短视频管理
      {path: `shortVideo/index`, component: require('../view/shortVideo/index.vue').default, name:'index', meta: { title: '短视频管理'}},
      {path: `shortVideo/reviewComments`, component: require('../view/shortVideo/reviewComments.vue').default, name:'reviewComments', meta: { title: '短视频管理评论管理'}},

      // 广告管理列表页
      {path: `adsManagement/adslist`, component: require('../view/ads_management/adslist.vue').default, name: 'adslist', meta: {title: '广告投放'}},
      {path: `adsManagement/addAds`, component: require('../view/ads_management/addAds.vue').default, name: 'addAds', meta: {title: '新增广告'}},

      //抽奖管理
      {path: `lotteryManagement/index`, component: require('../view/lotManagement/index.vue').default, name: 'lotManagement', meta: {title: '抽奖管理'}},
      {path: `lotteryManagement/manage`, component: require('../view/lotManagement/lotmanage.vue').default, name: 'lotmanage', meta: {title: '管理'}},
      
      //中奖管理
      {path: `winManagement/index`, component: require('../view/winManagement/index.vue').default, name: 'winManagement', meta: {title: '中奖管理'}},
      
      // 教师评课申请
      {path: `shareCourse/index`, component: require('../view/shareCourse/index.vue').default, name: 'shareCourse', meta: {title: '教师评课申请'}},
      // 视频课程订单
      {path: `videoCourse/index`, component: require('../view/videoCourse/index.vue').default, name: 'videoCourse', meta: {title: '视频课程订单'}},
      {path: `videoCourse/detail`, component: require('../view/videoCourse/detail.vue').default, name: 'videoOrderDetail', meta: {title: '视频订单详情'}},
      //用户bug反馈管理
      {path: `userBug/index`, component: require('../view/userBug/index.vue').default, name: 'userBug', meta: {title: '用户bug反馈管理'}},

      // 提高课时费申请
      {path: `raiseLessonFee/index`, component: require('../view/raiseLessonFee/index.vue').default, name: 'raiseLessonFee', meta: {title: '提高课时费申请'}},

    ],
  },
]
