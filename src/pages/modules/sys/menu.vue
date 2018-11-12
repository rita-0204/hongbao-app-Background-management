<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="资源名称">
        <el-input v-model="dataForm.name" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" class="checkBtns" style="line-height: 3px;margin-top:6px;">查询</el-button>
        <el-button type="primary" @click="addHandle(typeName)" style="height:30px;line-height: 3px;margin-top:6px;">新增</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
        <el-tab-pane label="资源管理" name="first">
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="sequence"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="id"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="资源ID">
            </el-table-column>
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="资源名称">
            </el-table-column>
            <el-table-column
              prop="url"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="链接">
            </el-table-column>
            <el-table-column
              prop="pid"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="父ID">
            </el-table-column>
            <el-table-column
              prop="status"
              header-align="center"
              align="center"
              class-name="colorRow"
              label-class-name="colorLabel"
              :formatter="formatSex"
              label="状态">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="UpdateHandle(scope.row.sequence,scope.row.id,scope.row.name,scope.row.url,scope.row.pid)">修改</el-button>
                <el-button type="text" class="btns" size="small" @click="deleteHandle(scope.row.id,scope.$index)">删除</el-button>
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
  import Update from './menu-update'
  import Add from './menu-add'
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
        typeName: 0
      }
    },
    components: {
      Update,
      Add
    },
    activated () {
      this.getDataList()
    },
    methods: {
      formatSex: function (row, column, cellValue) {
        if (cellValue == "1"){
          return '禁用';
        }else if (cellValue == "0"){
          return '启用';
        }
      },
      handleClick(tab, event) {
        if(tab.name == 'first'){
          this.typeName = 0;
        }else if(tab.name == 'second'){
          this.typeName = 1
        }
        this.getDataList ()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/controll/get/menu'),
          method: 'post',
          data: this.$http.adornData({
            name: this.dataForm.name,
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
      // 修改
      UpdateHandle (sequence,id,name,url,pid) {
        this.UpdateVisible = true
        this.$nextTick(() => {
          this.$refs.Update.init(sequence,id,name,url,pid)
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
            url: this.$http.adornUrl('/controll/up/menu'),
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
