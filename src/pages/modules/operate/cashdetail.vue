<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" class="checkNoraml" ref="dataForm" @keyup.enter.native="getDataList()">
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
    <el-tabs v-model="activeName2" type="card" class="tabs-icon">
      <el-tab-pane label="提现明细" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="nickname"
            header-align="center"
            align="center"
            label="昵称">
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="sex"
            header-align="center"
            align="center"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label="身份证号">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label="提现金额">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label="提现方式">
          </el-table-column>
          <el-table-column
            prop="regdate"
            header-align="center"
            align="center"
            :formatter="formatData"
            label="提现时间">
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
            prop="lastlogintime"
            header-align="center"
            align="center"
            :formatter="formatDataend"
            label="到账时间">
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
        return moment(data.regdate).format('YYYY-MM-DD HH:mm:ss')
      },
      formatDataend(data){
        return moment(data.lastlogintime).format('YYYY-MM-DD HH:mm:ss')
      },
      formatStatus: function (row, column, cellValue) {
        if (cellValue == "0"){
          return '正常';
        }else if (cellValue == "1"){
          return '禁封';
        }
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
