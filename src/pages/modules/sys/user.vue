<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="用户名">
        <el-input v-model="dataForm.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" class="checkBtns" style="line-height: 3px;margin-top:6px;">查询</el-button>
        <el-button type="primary" @click="addHandle(typeName)" style="height:30px;line-height: 3px;margin-top:6px;">新增</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon">
      <el-tab-pane label="用户管理" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="username"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="truename"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="昵称">
          </el-table-column>
          <el-table-column
            prop="gname"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="角色">
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
              <el-button type="text" size="small" @click="UpdateHandle(scope.row)">修改</el-button>
              <el-button type="text" class="btns" size="small" @click="deleteHandle(scope.row.id,scope.$index)">删除</el-button>
              <el-button type="text" class="btns" size="small" @click="changeHandle(scope.row.id,scope.$index)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 弹窗, 新增 / 修改 -->
    <update v-if="UpdateVisible" ref="Update" @refreshDataList="getDataList"></update>
    <add v-if="addVisible" ref="add" @refreshDataList="getDataList"></add>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'
  import Update from './user-update'
  import Add from './user-add'
  import moment from 'moment'
  export default {
    data () {
      return {
        dataForm: {
          edition: '',
          channel:''
        },
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        UpdateVisible: false,
        addVisible: false,
        activeName2: 'first',
        addOrUpdateVisible: false,
        typeName: 0
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
      // 重置密码
      changeHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[重置密码]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/controll/up/possword'),
            method: 'post',
            data: this.$http.adornData({
              id: id,
              token: this.$cookie.get('token')
            })
          }).then(({data}) => {
            if (data.resultCode == 0) {
              this.$message({
                message: '重置成功',
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
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/controll/get/user/all/page'),
          method: 'post',
          data: this.$http.adornData({
            username: this.dataForm.name,
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            this.dataList = data.data.list
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      // 修改
      UpdateHandle (obj) {
        this.UpdateVisible = true
        this.$nextTick(() => {
          this.$refs.Update.init(obj)
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
      deleteHandle (id,index) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/controll/up/person'),
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
  .mod-role{
  .tabs-icon{
    position: static;
  }
  }
</style>
