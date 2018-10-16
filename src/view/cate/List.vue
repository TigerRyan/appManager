<style>
  .manage .content .content_data .el-tree .el-tree-node:last-child .el-tree-node__content{
    border-bottom: 1px solid #D1DAE5;
  }
</style>
<template>
  <div class="content_data">
    <Breadcrumb/>
    <el-button type="primary" @click="create({id:0},$event)">添加一级分类</el-button>
    <div v-loading="loading" element-loading-text="拼命加载中...">
      <el-tree :data="data" :props="options" node-key="id" :render-content="renderContent" :defaultExpandAll="false"/>
    </div>
    <el-dialog :title="item.title" customClass="my-dialog" :visible.sync="item.show" width="600px" :modalAppendToBody="false">
      <el-form :model="item" ref="item" labelWidth="120px">
        <el-form-item label="上级分类：" :rules="[{required: true, message: '请选择上级分类...', trigger: 'blur'}]">
          <el-select v-model="item.parentId" filterable placeholder="请选择上级分类...">
            <el-option v-for="item in items" :key="item.id" :label="item.itemName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称：" :rules="[{required: true, message: '请输入分类名称...', trigger: 'blur'}]">
          <el-input v-model="item.itemName"/>
        </el-form-item>
        <el-form-item label="分类图标：">
          <Avatar :url="item.itemIcon" @success="item.itemIcon = $event"></Avatar>
        </el-form-item>
        <el-form-item label="分类优先级：">
          <el-input-number v-model="item.sortNum" :min="0" :max="9999" :step="1"/>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button @click="item.show = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/jsx">
  import {getEduItemTreeApi, delEduItemApi, updateEduItemApi, createEduItemApi, getEduItemApi} from '../../api/baseApi'
  import {success, error, confirm} from '../../actions'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import Avatar from '../../components/Avatar.vue'

  export default {
    name: 'serviceList',
    data() {
      return {
        options: {label: 'itemName', children: 'children'},
        items: [{id: 0, itemName: '顶级分类'}],
        data: [],
        loading: true,
        item: {show: false, itemName: '', itemIcon: '', itemDesc: '', sortNum: 0, parentId: 0},
      }
    },
    components: {Breadcrumb, Avatar},
    methods: {
      renderContent(h, {node, data, store}) {
        return (
          <div class="tree_data">
            <div class="tree_name" style={{width: 300 - ((node.level - 1) * 15) + 'px'}}><i class={data.itemIcon || 'el-icon-item'}/>{data.itemName}</div>
            <div class="tree_content" width="width:500px;float:right;">
              <span style="float:right;width:240px;text-align:right;">
                {data.itemLevels >= 3 ? '' : <el-button plain={true} type="primary" size="mini" on-click={(e) => this.create(data, e)}>新增子级</el-button>}
                <el-button plain={true} type="primary" size="mini" on-click={(e) => this.edit(data, e)}>修改</el-button>
                <el-button plain={true} type="danger" size="mini" on-click={(e) => this.del(data, store, e)}>删除</el-button>
              </span>
              <span style="float:right;width:100px;">{data.sortNum}</span>
            </div>
          </div>)
      },
      edit(data, e) {
        e.stopPropagation()
        this.item = {...this.item, ...data, title: `修改分类“${data.itemName}”`, show: true}
      },
      save() {
        this.$refs.item.validate((valid) => {
          if (valid) {
            const fn = this.item.id ? updateEduItemApi(this.item) : createEduItemApi(this.item)
            fn.then(() => {
              success(`修改成功！`)
              this.item.show = false
              this.getTree()
            })
          } else {
            return false
          }
        })
      },
      getTree() {
        this.loading = true
        getEduItemTreeApi().then(data => {
          this.data = data
          this.loading = false
        })
      },
      create({id}, e) {
        e.stopPropagation()
        this.item = {itemName: '', itemIcon: '', itemDesc: '', sortNum: 0, parentId: id, title: `创建分类`, show: true}
      },
      del(data, store, e) {
        e.stopPropagation()
        confirm(`确认删除分类“${data.itemName}”?`, 'error', '删除确认').then(() => delEduItemApi(data.id).then(() => {
          success(`删除分类“${data.itemName}“成功！`)
          store.remove(data)
        }).catch(({msg}) => error(msg || '操作失败！请稍后重试...')))
      },
    },
    created() {
      getEduItemApi().then(items => {
        this.items = [...this.items, ...items]
      })
      this.getTree()
    },
  }
</script>
