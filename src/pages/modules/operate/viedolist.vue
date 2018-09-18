<template>
  <div class="mod-role">
    <div class="main-title-top">
        <label><span>视频ID</span><input type="text"></label>
        <label><span>视频标题</span><input type="text"></label>
        <label>
          <span>所属频道</span>
          <select>
            <option value="">全部</option>
          </select>
        </label>
        <label class="content-class">
          <span>内容分类</span>
          <select>
            <option value="">一级分类</option>
          </select>
          <i></i>
          <select>
            <option value="">二级分类</option>
          </select>
        </label>
        <label><span>用户ID</span><input type="text"></label>
        <label><span>用户昵称</span><input type="text"></label>
        <label>
          <span>内容状态</span>
          <select>
            <option value="">全部</option>
          </select>
        </label>
        <label class="content-class">
          <span>发布时间</span>
          <input type="text">
          <i>-</i>
          <input type="text">
        </label>
        <div class="btnCheck">查 询</div>
    </div>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <el-tab-pane label="视频列表" name="first">
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
            label="视频">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="60"
            label="视频ID">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="150"
            label="标题">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="60"
            label="频道">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="60"
            label="分类">
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
            width="160"
            label="用户昵称">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="145"
            label="发布时间">
          </el-table-column>
          <el-table-column
            class="time"
            prop="status"
            header-align="center"
            align="center"
            width="60"
            label="状态"
            :formatter="formatSex">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="80"
            label="数据">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="50"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
              <el-button type="text" class="btns" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                         v-if="scope.row.status == 1 ">上线</el-button>
              <el-button type="text" class="btns" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                         v-if="scope.row.status == 0 ">下线</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './viedolist-update'
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
        addOrUpdateVisible: false,
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
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //上线
      stateHandle (id,status) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行${status == 0 ? '上线' : '下线'}操作?`, '提示', {
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
            url: this.$http.adornUrl('/mcn/updeateType'),
            method: 'post',
            data: this.$http.adornData({
              'id': id,
              'status': status
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
    height: 100px;
      label{
        width:210px;
        margin-bottom:10px;
        float:left;
        span{
          margin-right:10px;
        }
        i{
          width:10px;
          display:inline-block;
          text-align: center;
        }
        input{
          display:inline-block;
          width: 80px;
          height: 20px;
          border: 1px solid #dcdcdc;
        }
        select{
          padding:0 6%;
          width:auto;
          option{
            text-align: center;
          }
        }
      }
    .content-class{
      width:330px;
      input{
        width:118px;
      }
  }
  .btnCheck{
    float: right;
    background: #409EFF;
    color: #fff;
    padding: 6px 15px;
    border-radius: 100px;
    cursor: pointer;
    margin-top: -20px;
  }
  }
</style>
