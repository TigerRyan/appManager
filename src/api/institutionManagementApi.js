import ajax from './ajax'
// 根路径
const ROOT = '/manage'

// 获取机构列表   POST /manage/mechanism/{status}
export const getOrganListApi = ({
    page = 1,
    pageSize = 10,
    start,
    end,
    type,
    query,
    status = 0,
  }) =>
  ajax.post(`${ROOT}/mechanism/${status}`, {
    page,
    pageSize,
    start,
    end,
    type,
    query,
  })

// 设置 或取消推荐机构  PUT /manage/recommend/{mechanismId}/{type}
export const changeOrganTypeApi = ({
    mechanismId,
    type,
    videoUrl,
    imgUrl
  }) =>
  ajax.put(`${ROOT}/recommend/${mechanismId}/${type}`, {
    videoUrl,
    imgUrl
  })

// 导出机构会员列表
// POST /certifcation/exportMechanisms
export const exportMechanismsApi = ({
    start,
    end
  } = {}) =>
  ajax.post('/certifcation/exportMechanisms', {
    start,
    end
  })


// 获取服务商列表   POST /manage/provider
export const getProviderListApi = ({
    page = 1,
    pageSize = 10,
    start,
    end,
    type,
    query,
  }) =>
  ajax.post(`${ROOT}/provider`, {
    page,
    pageSize,
    start,
    end,
    type,
    query,
  })
// 查询服务商机构会员个人详情
export const personalProviderApi = (providerId) => ajax.get(`${ROOT}/personal/${providerId}`)
// 查询服务商机构会员企业详情
export const companyProviderApi = (providerId) => ajax.get(`${ROOT}/company/${providerId}`)
// 分页查询所属机构列表
export const searchProviderApi = ({
  page = 1,
  pageSize = 10,
  start,
  end,
  keyWord,
  providerId
}) => ajax.post(`${ROOT}/list/${providerId}`, {
  page,
  pageSize,
  start,
  end,
  keyWord
})

//通过地址查询列表
///manage/position
export const searchPositionApi = ({
  page = 1,
  pageSize = 10,
  start,
  end,
  latitude,
  longitude
}) => ajax.post(`${ROOT}/position`, {
  page,
  pageSize,
  start,
  end,
  latitude,
  longitude,
})

///manage/info/{id}/{details}
export const putManageInfoApi = ({
  id,
  details
}) => ajax.put(`${ROOT}/info/${id}`, {
  details
})
