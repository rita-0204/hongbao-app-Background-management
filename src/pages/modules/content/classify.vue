<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addHandle(typeName)" style="height:30px;line-height: 3px;">新增</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon">
      <el-tab-pane label="分类管理" name="first">
        <el-table
          :data="dataList"
          border
          style="width: 100%;">
          <table-tree-column
            prop="name"lef
            header-align="center"
            treeKey="id"
            class-name="pad-left"
            label-class-name="colorLabel"
            label="分类名称">
          </table-tree-column>
          <el-table-column
            prop="createtime"
            header-align="center"
            align="center"
            :formatter="formatData"
            label-class-name="colorLabel"
            :show-overflow-tooltip="true"
            label="创建时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="300"
            label-class-name="colorLabel"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="UpdateHandle(scope.row.id)">修改</el-button>
              <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
              <el-button v-if="scope.row.pid == 0" type="text" size="small" @click="addHandle(scope.row.id)">添加子分类</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 弹窗, 新增 / 修改 -->
    <update v-if="UpdateVisible" ref="Update" @refreshDataList="getDataList"></update>
    <add v-if="addVisible" ref="add" @refreshDataList="getDataList"></add>
  </div>
</template>

<script>
  import Update from './classify-update'
  import Add from './classify-add'
  import TableTreeColumn from '@/components/table-tree-column'
  import { treeDataTranslate } from '@/utils'
  import moment from 'moment'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        activeName2: 'first',
        dataListLoading: false,
        addOrUpdateVisible: false,
        UpdateVisible: false,
        addVisible: false,
        typeName: 0
      }
    },
    components: {
      Update,
      Add,
      TableTreeColumn
    },
    computed:{
      classifyList:{
        get(){
          return this.$store.state.list.classifyList //接收store储存数据
        },
        set(val){
          this.$store.commit('list/updateList',val) //向store/同步提交
        }
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      formatData(data){
        return moment(data.createtime).format('YYYY-MM-DD HH:mm:ss')
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mcn/getClassify'),
          method: 'get',
          params: this.$http.adornParams({
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data.data, 'id')
          this.classifyList = data.data
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      UpdateHandle (id) {
        this.UpdateVisible = true
        this.$nextTick(() => {
          this.$refs.Update.init(id)
        })
      },
      addHandle (id) {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.add.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/mcn/updateClassify`),
            method: 'post',
            data: this.$http.adornData({
              id: id,
              status: 1,
              token: this.$cookie.get('token')
            })
          }).then(({data}) => {
            if (data.resultCode == 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="stylesheet/scss" scoped>
  .mod-menu{
    padding: 20px;
    .tabs-icon{
      position: static;
    }
  }
</style>
