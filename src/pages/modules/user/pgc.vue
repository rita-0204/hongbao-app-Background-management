<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="userType == 1" type="primary" @click="powerHandle" style="height:30px;line-height: 3px;">新增</el-button>
        <el-button v-else type="primary" @click="addEditHander()" style="height:30px;line-height: 3px;">新增</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="用户ID">
        <el-input v-model="dataForm.id" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="dataForm.nickname" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" class="checkBtns" style="line-height: 3px;margin-top:6px;">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <el-tab-pane label="PGC用户" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            label="用户头像"
            header-align="center"
            align="center"
            label-class-name="colorLabel">
            <template slot-scope="scope">
              <img :src="scope.row.headurl" width="40" height="40" class="head_pic"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="用户ID">
          </el-table-column>
          <el-table-column
            prop="nickname"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="用户昵称">
          </el-table-column>
          <el-table-column
            prop="sex"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            :formatter="formatSex"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            :formatter="formatType"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="typeName"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="频道">
          </el-table-column>
          <el-table-column
            prop="url"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="爬虫链接">
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            :formatter="formatStatus"
            label="状态">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="操作">
            <template slot-scope="scope">
              <div v-if="userType == 1">
                <el-button type="text" size="small" @click="powerHandle" style="margin-right:10px;">编辑</el-button>
                <el-button type="text" class="btns" size="small" @click="powerHandle">删除</el-button>
              </div>
              <div v-else>
              <el-button type="text" size="small" @click="updateEditHander(scope.row.id)" style="margin-right:10px;">编辑</el-button>
              <el-button type="text" class="btns" size="small" @click="deleteHandle(scope.row.id,scope.$index)">删除</el-button>
              </div>
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
  import AddOrEditUpdate from './pgc-add'
  import Update from './pgc-update'

  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
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
    computed:{
      //得到管理员type
      userType:{
        get(){
          return this.$store.state.user.type
        }
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      formatSex: function (row, column, cellValue) {
        if (cellValue == "1"){
          return '男';
        }else if (cellValue == "2"){
          return '女';
        } else if (cellValue == "0"){
          return '未知';
        }
      },
      formatType: function (row, column, cellValue) {
        if (cellValue == "1"){
          return 'PGC';
        }else if (cellValue == "0"){
          return '马甲';
        }
      },
      formatStatus: function (row, column, cellValue) {
        if (cellValue == "0"){
          return '待审核';
        }else if (cellValue == "1"){
          return '审核中';
        }else if (cellValue == "2"){
          return '审核通过';
        }else if (cellValue == "3"){
          return '审核不通过';
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
              url: this.$http.adornUrl('/mcn/getpgclist'),
              method: 'get',
              params: this.$http.adornParams({
                nickname: this.dataForm.nickname,
                id: this.dataForm.id,
                page: this.pageIndex - 1,
                pagesize: this.pageSize,
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
            url: this.$http.adornUrl('/mcn/delpgc'),
            method: 'get',
            params: this.$http.adornParams({
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
      },
      // 权限
      powerHandle () {
        this.$message({
          message: '您没有权限，请联系管理员',
          type: 'success',
          duration: 1500,
          onClose: () => {
//            this.getDataList()
          }
        })
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
