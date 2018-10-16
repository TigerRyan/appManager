import ajax from './ajax'
// 设置根目录
const ROOT = '/goodsCategory'

// 获取商品类目列表
export const getgoodsCategory = () => ajax.get(`${ROOT}/list`)

// 删除商品类目列表
// /goodsCategory/delete/{id}
export const delgoodsCategory = id => ajax.delete(`${ROOT}/delete/${id}`)

// 新增商品类目
// /goodsCategory/add
export const addgoodsCategory = obj => ajax.post(`${ROOT}/add`, obj)

// 修改商品类目  /goodsCategory/update/{id}
export const updategoodsCategory = (id,obj) => ajax.put(`${ROOT}/update/${id}`,obj)
// export const updategoodsCategory = ({ id, parentId, name, icon, weight }) =>
//   ajax.put(`${ROOT}/update$/${id}`, {parentId, name, icon, weight })
