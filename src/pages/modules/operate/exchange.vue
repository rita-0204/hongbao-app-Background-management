<template>
  <div class="mod-role">
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
        <el-tab-pane label="今日汇率" name="first">
          <el-row :gutter="20" class="top">
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px"
            style="width:500px;">
              <el-form-item label="日期">
                <p style="height:40px;line-height: 40px;">{{data}}</p>
              </el-form-item>
              <el-form-item label="汇率" prop="goldNum">
                <el-input v-model="dataForm.goldNum" placeholder="金币数量"></el-input>
              </el-form-item>
              <el-button v-if="userType == 1" type="primary" @click="powerHandle" style="margin-left:220px;height:30px;line-height: 3px;">保存</el-button>
              <el-button v-else type="primary" @click="Submit()" style="margin-left:220px;height:30px;line-height: 3px;">保存</el-button>
            </el-form>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="历史记录" name="second">
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="creatDate"
              header-align="center"
              align="center"
              :formatter="formatData"
              label-class-name="colorLabel"
              label="日期">
            </el-table-column>
            <el-table-column
              prop="goldRmb"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="汇率">
            </el-table-column>
            <el-table-column
              prop="goldDate"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="支出金币">
            </el-table-column>
            <el-table-column
              prop="rmbDate"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="支出现金">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-tab-pane>
    </el-tabs>
    <!-- 弹窗 修改 -->
    <update v-if="UpdateVisible" ref="Update" @refreshDataList="getDataList"></update>
  </div>
</template>

<script>
  import Update from './exchange-update'
  import moment from 'moment'
  export default {
    data () {
      return {
        dataForm: {
          goldNum: 0
        },
        dataRule: {
          goldNum: [
            { required: true, message: '金币数量不能为空', trigger: 'blur' }
          ]
        },
        dataList: [],
        rate:[],
        dataListLoading: false,
        dataListSelections: [],
        UpdateVisible: false,
        activeName2: 'first',
        typeName: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        data: moment(new Date()).format('YYYY-MM-DD')
      }
    },
    components: {
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
      formatData(data){
        return moment(data.creatDate).format('YYYY-MM-DD HH:mm:ss')
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
        // 历史记录
        this.$http({
          url: this.$http.adornUrl('/mcn/get/notes/list'),
          method: 'post',
          data: this.$http.adornData({
            page: this.pageIndex - 1,
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
//            console.log(data)
            this.dataList = data.data
            this.totalPage = data.data.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
        //  当前汇率
        this.$http({
          url: this.$http.adornUrl('/mcn/get/goldRmb'),
          method: 'get',
          params: this.$http.adornParams({
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            this.dataForm.goldNum = data.data[0].gold_rmb
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
      Submit(){
        this.$http({
          url: this.$http.adornUrl('/mcn/up/goldrmb'),
          method: 'post',
          data: this.$http.adornData({
            gold_rmb: this.dataForm.goldNum,
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 权限
      powerHandle () {
        this.$message({
          message: '您没有权限，请联系管理员',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.getDataList()
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
