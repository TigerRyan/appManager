import ajax from './ajax'
// 设置根目录
const ROOT = '/advertise'

// 广告列表
export const getAdsListApi = ({page = 1, pageSize = 10,advName } = {}) => ajax.post(`${ROOT}/getList`, {page, pageSize,advName})
//获取广告详情
export const getAdsDetail = (id) => ajax.get(`/advertise/details/${id}`)

//获取商品
export const getGoodList = ({page = 1, pageSize = 5,name,id} = {}) => ajax.post(`/goods/list`, {page, pageSize,name,id})
//商品详情
export const getGoodDetail = (id) => ajax.get(`/goods/info/${id}`)

//获取分类
export const getCatList = () => ajax.get(`/goodsCategory/list`)

//获取机构
export const getInsList = ({page = 1, pageSize = 5,query,status=2,type =0} = {}) => ajax.post(`/certifcation/mechanism`, {page, pageSize,status,query,type})
//获取机构详情
export const getInsDetail = (id) => ajax.get(`/manage/getMechanismInfo/${id}`)

//获取老师
export const getUserList = ({page = 1, pageSize = 5,name,type=2} = {}) => ajax.post(`/user/list`, {page, pageSize,name,type})
//获取教师详情
export const getUserDetail = (id) => ajax.get(`/user/get/${id}`)


//新增
export const addAds = ({
    advName,advCoverImg,advWeight,advPosition,advPosType,advPosTypeid,advSkiptype ,advLink ,advDatatype ,advDatavalue ,starttime,endtime
} = {}) => ajax.post(`advertise/addAdvertise`, {
    advName,advCoverImg,advWeight,advPosition,advPosType,advPosTypeid,advSkiptype ,advLink ,advDatatype ,advDatavalue,starttime,endtime
})

//更新
export const updateAds = ({
    id,advName,advCoverImg,advWeight,advPosition,advPosType,advPosTypeid,advSkiptype ,advLink ,advDatatype ,advDatavalue ,starttime,endtime
} = {}) => ajax.put(`/advertise/update/${id}`, 
{
    advName,advCoverImg,advWeight,advPosition,advPosType,advPosTypeid,advSkiptype ,advLink ,advDatatype ,advDatavalue,starttime,endtime
})


//删除
export const delAds = (id) => ajax.delete(`/advertise/delete/${id}`)


