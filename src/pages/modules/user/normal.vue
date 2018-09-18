<template>
  <div class="mod-role">
    <div class="main-title-top">
      <label><span>用户ID</span><input type="text"></label>
      <label><span>用户昵称</span><input type="text"></label>
      <label><span>手机号码</span><input type="text"></label>
      <div class="btnCheck">查 询</div>
    </div>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <el-tab-pane label="普通用户" name="first">
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
            label="用户头像">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="100"
            label="用户ID">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="170"
            label="用户昵称">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="140"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="60"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="160"
            label="注册时间">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="100"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="100"
            label="状态">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="100"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">详情</el-button>
              <el-button type="text" class="btns" size="small" @click="stateHandle(scope.row.id,scope.row.status)">封禁用户</el-button>
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
