<template>
  <div class="mod-role">
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
        <el-tab-pane label="当前汇率" name="first">
          <el-table
            :data="rate"
            border
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="gold_rmb"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="汇率">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="UpdateHandle(scope.row.gold_rmb)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="历史记录" name="second">
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%;">
            <el-table-column
              prop="id"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="id">
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
              label="汇率">
            </el-table-column>
            <el-table-column
              prop="goldRmb"
              header-align="center"
              align="center"
              label-class-name="colorLabel"
              label="支出金额">
            </el-table-column>
            <el-table-column
              prop="creatDate"
              header-align="center"
              align="center"
              :formatter="formatData"
              label-class-name="colorLabel"
              label="创建时间">
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
          roleName: ''
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
        totalPage: 0
      }
    },
    components: {
      Update
    },
    activated () {
      this.getDataList()
    },
    methods: {
      formatData(data){
        return moment(data.creatdate).format('YYYY-MM-DD HH:mm:ss')
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
//            console.log(data)
            this.rate = data.data
          } else {
            this.rate = []
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
