<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addEditHander()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="版本">
        <el-input v-model="dataForm.edition" clearable></el-input>
      </el-form-item>
      <el-form-item label="渠道">
        <el-input v-model="dataForm.channel" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon">
      <el-tab-pane label="版本管理" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="edition"
            header-align="center"
            align="center"
            label="版本">
          </el-table-column>
          <el-table-column
            prop="channel"
            header-align="center"
            align="center"
            label="渠道">
          </el-table-column>
          <el-table-column
            prop="uploading"
            header-align="center"
            align="center"
            label="文件">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            :formatter="formatData"
            label="更新时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateEditHander(scope.row)">编辑</el-button>
              <el-button type="text" class="btns" size="small" @click="deleteHandle(scope.row.id,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <add-or-edit-update v-if="addEditVisible" ref="addEdit" @refreshDataList="getDataList"></add-or-edit-update>
    <update v-if="updateVisible" ref="updateEdit" @refreshDataList="getDataList"></update>
  </div>
</template>

<script>
  import AddOrEditUpdate from './version-add'
  import Update from './version-update'
  import moment from 'moment'
  export default {
    data () {
      return {
        dataForm: {
          edition: '',
          channel:''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addEditVisible: false,
        updateVisible:false,
        dataListSelections: [],
        activeName2: 'first',
        typeName: 0
      }
    },
    components: {
      AddOrEditUpdate,
      Update
    },
    activated () {
      this.getDataList()
    },
    methods: {
      formatData(data){
        return moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
      },
      // 编辑
      updateEditHander (id) {
        this.updateVisible = true
        this.$nextTick(() => {
          this.$refs.updateEdit.init(id)
        })
      },
      // 新增
      addEditHander (id) {
        this.addEditVisible = true
        this.$nextTick(() => {
          this.$refs.addEdit.init(id)
        })
      },
      // 获取数据列表
      getDataList (index) {
        this.dataListLoading = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/get/app/list'),
              method: 'post',
              data: this.$http.adornData({
                edition:this.dataForm.edition,
                channel:this.dataForm.channel,
                page: this.pageIndex - 1,
                token: this.$cookie.get('token')
              })
            }).then(({data}) => {
//              console.log(data)
              if (data.resultCode == 0) {
                this.dataList = data.data.list
                this.totalPage = data.data.total
              } else {
                this.dataList = []
                this.totalPage = 0
              }
              this.dataListLoading = false
            })
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
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
            url: this.$http.adornUrl('/mcn/up/app/channel'),
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
  .btns{
    margin-left:0;
  }
</style>
