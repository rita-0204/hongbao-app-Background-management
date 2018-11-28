<template>
  <div class="mod-role">
    <el-form :inline="true" class="checkViedo">
      <el-form-item label="文章ID">
        <el-input v-model="videoId" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章标题">
        <el-input v-model="videoName" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" style="line-height: 3px;">查询</el-button>
        <el-button type="primary" @click="addHandle()" style="height:30px;line-height: 3px;">新增</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon">
      <el-tab-pane label="文章列表" name="first">
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
            label="图文ID">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            width="120"
            label-class-name="colorLabel"
            label="封面">
            <template slot-scope="scope">
              <img :src="scope.row.cover" width="80" height="45" class="head_pic"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="标题">
          </el-table-column>
          <el-table-column
            prop="shareUrl"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="链接地址">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            label-class-name="colorLabel"
            label="作者">
            <template slot-scope="scope">
              <p>{{scope.row.pgcId}}</p>
              <p>{{scope.row.pgcName}}</p>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            :formatter="formatData"
            label-class-name="colorLabel"
            label="创建时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="操作">
            <template slot-scope="scope">
              <div v-if="userType == 1">
                <el-button type="text" size="small" @click="powerHandle">编辑</el-button>
                <el-button type="text" class="btns" size="small" @click="powerHandle">删除</el-button>
              </div>
              <div v-else>
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id,channel)">编辑</el-button>
                <el-button type="text" class="btns" size="small" @click="deleteHandle(scope.row.id,scope.$index)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add v-if="addVisible" ref="add" @refreshDataList="getDataList"></add>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './article-edit'
  import Add from './article-add'
  import moment from 'moment'
  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
        channel:'',
        videoId:'',
        videoName:'',
        userId:'',
        userName:'',
        // 前一年 new Date().setFullYear(new Date().getFullYear()-1)
//        dateValue: [new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000), new Date(new Date().setHours(23, 59, 59, 59))],
        dateValue:'',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        addVisible: false,
        activeName2: 'first',
        typeName: 0,
        state: '0',
        datestart:'',
        dateend:'',
        marterList:''
      }
    },
    components: {
      AddOrUpdate,
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
      formatData(data){
        return moment(data.createDate).format('YYYY-MM-DD HH:mm:ss')
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mcn/get/news/editor'),
          method: 'post',
          data: this.$http.adornData({
            token: this.$cookie.get('token'),
            id: this.videoId,
            title: this.videoName,
            datestart: this.dateValue == undefined ? '' : this.dateValue[0],
            dateend: this.dateValue == undefined ? '' : this.dateValue[1],
            page: this.pageIndex - 1,
            pagesize: this.pageSize
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
      // 删除
      deleteHandle (id,index) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/mcn/up/news/editor'),
            method: 'post',
            data: this.$http.adornData({
              id: id,
              status: 1,
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
        }).catch(() => {})
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
      addOrUpdateHandle (id,channel) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,channel)
        })
      },
      // 新增 / 修改
      addHandle () {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.add.init()
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
    height: 100px;
      label{
        width:178px;
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
          padding:0 8.6%;
          width:auto;
          option{
            text-align: center;
          }
        }
      }
    .content-class{
      width:495px;
      input{
        width:118px;
      }
  }
  .block{
    width: 425px;
    float: right;
    height: 23px;
  }
  .btnCheck{
    float: right;
    background: #409EFF;
    color: #fff;
    padding: 6px 15px;
    border-radius: 100px;
    cursor: pointer;
    margin-top: -65px;
  }
  }
</style>
