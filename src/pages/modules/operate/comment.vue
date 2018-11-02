<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="用户ID">
        <el-input v-model="dataForm.userid" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="dataForm.nickname" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <el-tab-pane label="评论审核" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            label="用户头像"
            header-align="center"
            label-class-name="colorLabel"
            align="center"
            width="100">
              <template slot-scope="scope">
                <img :src="scope.row.headUrl" width="40" height="40" class="head_pic"/>
              </template>
          </el-table-column>
          <el-table-column
            prop="userid"
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
            prop="content"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="评论内容">
          </el-table-column>
          <el-table-column
            prop="title"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="内容标题">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            width="80"
            :formatter="formatSex"
            label="内容类型">
          </el-table-column>
          <el-table-column
            prop="creatdate"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            :formatter="formatData"
            label="评论时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="100"
            label-class-name="colorLabel"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="UpdateHandle(scope.row.id,3)">通过</el-button>
              <el-button type="text" size="small" @click="UpdateHandle(scope.row.id,2)">不通过</el-button>
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
  </div>
</template>

<script>
  import moment from 'moment'
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
        dataListSelections: [],
        activeName2: 'first',
        typeName: 0
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      formatData(data){
        return moment(data.creatdate).format('YYYY-MM-DD HH:mm:ss')
      },
      formatSex: function (row, column, cellValue) {
        if (cellValue == "3"){
          return '视频';
        }else {
          return '图文';
        }
      },
      UpdateHandle(id,status){
        this.$confirm(`确定对[id=${id}]进行${status == 2 ? '通过' : '不通过'}操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/mcn/updateComment'),
            method: 'post',
            data: this.$http.adornData({
              'id': id,
              'status': status,//2是不通过  3是通过
              'token': this.$cookie.get('token')
            })
          }).then(({data}) => {
            if (data.resultCode == 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.data.msg)
            }
          })
        })
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
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
//            console.log(this.dataForm.userid,this.dataForm.nickname)
            this.$http({
              url: this.$http.adornUrl('/mcn/getselectlistcomment'),
              method: 'get',
              params: this.$http.adornParams({
                nickname: this.dataForm.nickname,
                userid: this.dataForm.userid,
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
