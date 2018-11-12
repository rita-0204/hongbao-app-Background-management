<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addHandle()" style="height:30px;line-height: 3px;">新增</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon">
      <el-tab-pane label="角色管理" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="createtime"
            header-align="center"
            align="center"
            :formatter="formatData"
            label-class-name="colorLabel"
            label="创建时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.id !== 1" size="small" @click="UpdateHandle(scope.row.id,scope.row.name)">修改</el-button>
              <el-button type="text" v-if="scope.row.id !== 1" class="btns" size="small" @click="deleteHandle(scope.row.id,scope.$index)">删除</el-button>
              <el-button type="text" v-if="scope.row.id !== 1" class="btns" size="small" @click="accessHandle(scope.row.id,scope.row.acl)">授权</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <update v-if="UpdateVisible" ref="Update" @refreshDataList="getDataList"></update>
    <add v-if="addVisible" ref="add" @refreshDataList="getDataList"></add>
  </div>
</template>

<script>
  import AddOrUpdate from './role-add-or-update'
  import Update from './role-update'
  import Add from './role-add'
  import moment from 'moment'
  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        UpdateVisible: false,
        addVisible: false,
        activeName2: 'first',
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      Update,
      Add
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
          url: this.$http.adornUrl('/controll/get/group/all'),
          method: 'post',
          data: this.$http.adornData({
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            this.dataList = data.data
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      // 授权
      accessHandle (id,acl) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,acl)
        })
      },
     // 修改
      UpdateHandle (id,name) {
        this.UpdateVisible = true
        this.$nextTick(() => {
          this.$refs.Update.init(id,name)
        })
      },
      // 新增
      addHandle (type) {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.add.init(type)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/controll/del/group'),
            method: 'post',
            data: this.$http.adornData({
              id: id,
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
