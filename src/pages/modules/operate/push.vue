<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="isAuth('')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="main-title-top">
      <label>
        <span class="fl">推送时间</span>
        <div class="block fl">
          <el-date-picker
            v-model="value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </label>
      <div class="btnCheck">查 询</div>
    </div>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <el-tab-pane label="推送管理" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="100"
            label="通知ID">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="100"
            label="内容类型">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="180"
            label="标题">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="100"
            label="目标设备">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="150"
            label="推送时间">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="80"
            label="发送数">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="80"
            label="到达数">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="80"
            label="打开数">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="80"
            label="到达率">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="80"
            label="打开率">
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './push-add'
  export default {
    data () {
      return {
        value6: '',
        dataForm: {
          roleName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        dataListSelections: [],
        activeName2: 'first',
        typeName: 0
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      formatSex: function (row, column, cellValue) {
        if (cellValue == "1"){
          return '下线';
        }else if (cellValue == "0"){
          return '正常';
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mcn/getType'),
          method: 'get',
          params: this.$http.adornParams({
            'type': this.typeName,
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
      width: 430px;
      margin-bottom: 10px;
      float: left;
    span {
      margin-right: 10px;
    }
    i{
      margin:0 10px;
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
