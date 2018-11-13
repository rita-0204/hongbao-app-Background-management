<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" class="checkNoraml" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="手机号码">
        <el-input v-model="dataForm.mobile" clearable></el-input>
      </el-form-item>
      <el-form-item label="提现状态">
        <el-select v-model="status" placeholder="全部">
          <el-option v-for="item in statusList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提现方式">
        <el-select v-model="type" placeholder="全部">
          <el-option v-for="item in typeList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提现时间">
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
      <el-form-item label="到账时间">
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
            prop="mobile"
            label-class-name="colorLabel"
            header-align="center"
            align="center"
            label="昵称">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label-class-name="colorLabel"
            header-align="center"
            align="center"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="nickname"
            label-class-name="colorLabel"
            header-align="center"
            align="center"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="idcard"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="身份证号">
          </el-table-column>
          <el-table-column
            prop="rmb"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="提现金额">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            :formatter="formatType"
            label-class-name="colorLabel"
            label="提现方式">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
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
            prop="succTime"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
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
        status:'',
        statusList: [{
          value: '',
          label: '全部'
        },{
          value: 0,
          label: '成功'
        },{
          value: 1,
          label: '提现中'
        },{
          value: 2,
          label: '打款失败'
        },{
          value: 3,
          label: '审核中'
        },{
          value: 4,
          label: '审核通过'
        },{
          value: 5,
          label: '订单发送成功'
        },{
          value:6,
          label: '待打款(暂停处理)'
        },{
          value: 7,
          label: '退款成功'
        }],
        type:'',
        typeList: [{
          value: '',
          label: '全部'
        },{
          value: 1,
          label: '支付宝'
        },{
          value: 2,
          label: '微信'
        }],
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
        return moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
      },
      formatDataend(data){
        return moment(data.succTime).format('YYYY-MM-DD HH:mm:ss')
      },
      formatStatus: function (row, column, cellValue) {
        if (cellValue == "0"){
          return '成功';
        }else if (cellValue == "1"){
          return '提现中';
        }else if (cellValue == "2"){
          return '打款失败';
        }else if (cellValue == "3"){
          return '审核中';
        }else if (cellValue == "4"){
          return '审核通过';
        }else if (cellValue == "5"){
          return '订单发送成功';
        }else if (cellValue == "6"){
          return '待打款(暂停处理)';
        }else if (cellValue == "7"){
          return '退款成功';
        }
      },
      formatType: function (row, column, cellValue) {
        if (cellValue == "1"){
          return '支付宝';
        }else if (cellValue == "2"){
          return '微信';
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mcn/get/app/record'),
          method: 'post',
          data: this.$http.adornData({
            type:this.type,
            mobile:this.dataForm.mobile,
            status: this.status,
            createTime1:this.dataForm.regdata == undefined ? '' : this.dataForm.regdata[0], //new Date(this.dataForm.regdata).getTime(),
            createTime2:this.dataForm.regdata == undefined ? '' : this.dataForm.regdata[1],
            succTime1: this.dataForm.enddata == undefined ? '' : this.dataForm.enddata[0],
            succTime2: this.dataForm.enddata == undefined ? '' : this.dataForm.enddata[1],
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
