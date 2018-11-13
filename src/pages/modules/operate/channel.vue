<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="userType == 1" type="primary" @click="powerHandle" style="height:30px;line-height: 3px;">新增</el-button>
        <el-button v-else type="primary" @click="addHandle(typeName)" style="height:30px;line-height: 3px;">新增</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
        <el-tab-pane label="图文频道" name="first">
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="sort"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="频道名称">
            </el-table-column>
            <el-table-column
              class="time"
              prop="status"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="状态"
              class-name="colorRow"
              :formatter="formatSex">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="操作">
              <template slot-scope="scope">
                <div v-if="userType == 1">
                  <el-button type="text" size="small" @click="powerHandle">修改</el-button>
                  <el-button type="text" size="small" v-if="scope.row.status == 1" @click="powerHandle">上线</el-button>
                  <el-button type="text" size="small" v-if="scope.row.status == 0" @click="powerHandle">下线</el-button>
                </div>
                <div v-else>
                <el-button type="text" size="small" @click="UpdateHandle(scope.row.id,scope.row.name,scope.row.sort,0)">修改</el-button>
                <el-button type="text" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                v-if="scope.row.status == 1 ">上线</el-button>
                <el-button type="text" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                           v-if="scope.row.status == 0 ">下线</el-button>
                </div>
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
              prop="sort"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="频道名称">
            </el-table-column>
            <el-table-column
              class="time"
              prop="status"
              header-align="center"
              align="center"
              class-name="colorRow"
              label-class-name="colorLabel"
              label="状态"
              :formatter="formatSex">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="操作">
              <template slot-scope="scope">
                <div v-if="userType == 1">
                  <el-button type="text" size="small" @click="powerHandle">修改</el-button>
                  <el-button type="text" size="small" v-if="scope.row.status == 1" @click="powerHandle">上线</el-button>
                  <el-button type="text" size="small" v-if="scope.row.status == 0" @click="powerHandle">下线</el-button>
                </div>
                <div v-else>
                  <el-button type="text" size="small" @click="UpdateHandle(scope.row.id,scope.row.name,scope.row.sort,1)">修改</el-button>
                  <el-button type="text" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                             v-if="scope.row.status == 1 ">上线
                  </el-button>
                  <el-button type="text" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                             v-if="scope.row.status == 0 ">下线
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
    </el-tabs>
    <!-- 弹窗, 新增 / 修改 -->
    <update v-if="UpdateVisible" ref="Update" @refreshDataList="getDataList"></update>
    <add v-if="addVisible" ref="add" @refreshDataList="getDataList"></add>
  </div>
</template>

<script>
  import Update from './channel-update'
  import Add from './channel-add'
  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        UpdateVisible: false,
        addVisible: false,
        activeName2: 'first',
        typeName: 0
      }
    },
    components: {
      Update,
      Add
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
            type: this.typeName,
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
//            console.log(data)
            this.dataList = data.data
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      UpdateHandle (id,name,sort, num) {
        this.UpdateVisible = true
        this.$nextTick(() => {
          this.$refs.Update.init(id,name,sort, num)
        })
      },
      addHandle (type) {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.add.init(type)
        })
      },
      //上线
      stateHandle (id,status) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行${status == 1 ? '上线' : '下线'}操作?`, '提示', {
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
</style>
