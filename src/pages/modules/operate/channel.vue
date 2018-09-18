<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="isAuth('')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <!--<el-tabs class="aaa">-->
        <el-tab-pane label="图文频道" name="first">
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label="频道名称">
            </el-table-column>
            <el-table-column
              class="time"
              prop="status"
              header-align="center"
              align="center"
              width="350"
              label="状态"
              :formatter="formatSex">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="250"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                v-if="scope.row.status == 1 ">
                  上线
                </el-button>
                <el-button type="text" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                           v-if="scope.row.status == 0 ">
                  下线
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="视频频道" name="second">
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label="频道名称">
            </el-table-column>
            <el-table-column
              class="time"
              prop="status"
              header-align="center"
              align="center"
              width="350"
              label="状态"
              :formatter="formatSex">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="250"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                           v-if="scope.row.status == 1 ">
                  上线
                </el-button>
                <el-button type="text" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                           v-if="scope.row.status == 0 ">
                  下线
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      <!--</el-tabs>-->
    </el-tabs>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './channel-change-or-update'
  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
        dataList: [],
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
</style>
