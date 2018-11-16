<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" class="checkNoraml" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="用户ID">
        <el-input v-model="dataForm.id" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="dataForm.nickname" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="dataForm.mobile" clearable></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="dataForm.regdata"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="checkDatas" style="margin-top:4px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="最后登录">
        <el-date-picker
          v-model="dataForm.enddata"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
        class="checkDatas" style="margin-top:4px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" class="checkBtns" style="line-height: 3px;">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <el-tab-pane label="普通用户" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="用户头像">
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
            prop="mobile"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="手机号码">
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
            prop="regdate"
            label-class-name="colorLabel"
            header-align="center"
            align="center"
            :formatter="formatData"
            label="注册时间">
          </el-table-column>
          <el-table-column
            prop="lastlogintime"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            :formatter="formatDataend"
            label="最后登录">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            :formatter="formatTpye"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            class-name="colorRow"
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
                <el-button type="text" size="small" @click="detailHandle(scope.row.id)" style="margin-right:10px;">详情</el-button>
                <el-button type="text" class="btns" size="small"
                           @click="powerHandle"
                           v-if="scope.row.status == 1 ">解封用户</el-button>
                <el-button type="text" class="btns" size="small"
                           @click="powerHandle"
                           v-if="scope.row.status == 0 ">封禁用户</el-button>
              </div>
              <div v-else>
              <el-button type="text" size="small" @click="detailHandle(scope.row.id)" style="margin-right:10px;">详情</el-button>
              <el-button type="text" class="btns" size="small"
                         @click="stateHandle(scope.row.id,scope.row.status)"
                         v-if="scope.row.status == 1 ">解封用户</el-button>
              <el-button type="text" class="btns" size="small"
                         @click="stateHandle(scope.row.id,scope.row.status)"
                         v-if="scope.row.status == 0 ">封禁用户</el-button>
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
    <detail-update v-if="detailVisible" ref="detail" @refreshDataList="getDataList"></detail-update>
  </div>
</template>

<script>
  import detailUpdate from './normal-detail.vue'
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
        detailVisible: false,
        dataListLoading: false,
        dataListSelections: [],
        activeName2: 'first',
        typeName: 0
      }
    },
    components: {
      detailUpdate
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
      formatData(data){
        return moment(data.regdate).format('YYYY-MM-DD HH:mm:ss')
      },
      formatDataend(data){
        return moment(data.lastlogintime).format('YYYY-MM-DD HH:mm:ss')
      },
      formatSex: function (row, column, cellValue) {
        if (cellValue == "1"){
          return '男';
        }else if (cellValue == "2"){
          return '女';
        } else if (cellValue == "0"){
          return '未知';
        }
      },
      formatStatus: function (row, column, cellValue) {
        if (cellValue == "0"){
          return '正常';
        }else if (cellValue == "1"){
          return '禁封';
        }
      },
      formatTpye: function (row, column, cellValue) {
        if (cellValue == "0"){
          return '普通用户';
        }else if (cellValue == "1"){
          return '马甲用户';
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
      // 新增 编辑
      detailHandle (id) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.detail.init(id)
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mcn/getlistuser'),
          method: 'get',
          params: this.$http.adornParams({
            id:this.dataForm.id,
            mobile:this.dataForm.mobile,
            nikename: this.dataForm.nickname,
            page: this.pageIndex - 1,
            pagesize: this.pageSize,
            regdate1:this.dataForm.regdata == undefined ? '' : this.dataForm.regdata[0], //new Date(this.dataForm.regdata).getTime(),
            regdate2:this.dataForm.regdata == undefined ? '' : this.dataForm.regdata[1],
            lastlogintime1: this.dataForm.enddata == undefined ? '' : this.dataForm.enddata[0],
            lastlogintime2: this.dataForm.enddata == undefined ? '' : this.dataForm.enddata[1],
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            this.dataList = data.data.list
            this.totalPage = data.data.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
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
      //
      stateHandle (id,status) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行${status == 1 ? '解封' : '封禁'}操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(status == 0){
            status = 1
          }else {
            status = 0
          }
          this.$http({
            url: this.$http.adornUrl('/mcn/fengjinuser'),
            method: 'post',
            data: this.$http.adornData({
              id: id,
              status: status,
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
        })
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
  .main-title-top{
    width: 100%;
    height: 50px;
  label {
    width: 210px;
    margin-bottom: 10px;
    float: left;
  span {
    margin-right: 10px;
  }
  input {
    display: inline-block;
    width: 80px;
    height: 20px;
    border: 1px solid #dcdcdc;
  }
  }
  .btnCheck{
    float: left;
    background: #409EFF;
    color: #fff;
    padding: 6px 15px;
    border-radius: 100px;
    cursor: pointer;
    margin-top: -5px;
  }
  }
</style>
