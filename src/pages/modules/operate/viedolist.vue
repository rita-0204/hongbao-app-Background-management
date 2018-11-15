<template>
  <div class="mod-role">
    <el-form :inline="true" class="checkViedo">
      <el-form-item label="视频ID">
        <el-input v-model="videoId" clearable></el-input>
      </el-form-item>
      <el-form-item label="视频标题">
        <el-input v-model="videoName" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属频道">
        <el-select v-model="channel" placeholder="全部">
          <el-option v-for="item in checkList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容分类">
        <el-select v-model="oneClassify" placeholder="请选择" @change="changeMethods">
          <el-option v-for="item in classifyList"
                     :value="item.id" :label="item.name" :key="item.id"></el-option>
        </el-select>
        <el-select v-model="twoClassify" placeholder="请选择" @change="selectGet2">
          <el-option v-for="item in marterList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="userId" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="userName" clearable></el-input>
      </el-form-item>
      <el-form-item label="内容状态">
        <el-select v-model="state" placeholder="全部">
          <el-option v-for="item in stateList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" style="line-height: 3px;">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <el-tab-pane label="视频列表" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            width="100"
            label="视频">
            <template slot-scope="scope">
              <img :src="scope.row.cover" width="80" height="45" class="head_pic"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="视频ID">
          </el-table-column>
          <el-table-column
            prop="title"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="标题">
          </el-table-column>
          <el-table-column
            prop="typename"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="频道">
          </el-table-column>
          <el-table-column
            prop="tag"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="标签">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            label-class-name="colorLabel"
            label="用户">
            <template slot-scope="scope">
              <p>{{scope.row.pgcid}}</p>
              <p>{{scope.row.nickname}}</p>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            :formatter="formatData"
            label-class-name="colorLabel"
            label="发布时间">
          </el-table-column>
          <el-table-column
            class="status"
            prop="status"
            header-align="center"
            align="center"
            class-name="colorRow"
            label="状态"
            label-class-name="colorLabel"
            :formatter="formatSex">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="left"
            label-class-name="colorLabel"
            label="数据">
            <template slot-scope="scope">
              <p>评论：{{scope.row.ping}}</p>
              <p>分享：{{scope.row.share_num}}</p>
              <p>播放次数：{{scope.row.playernum}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="crawlerurl"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="爬虫来源">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="130"
            label-class-name="colorLabel"
            label="操作">
            <template slot-scope="scope">
              <div v-if="userType == 1">
                <!--<el-button type="text" class="btns" size="small" @click="powerHandle">编辑</el-button>-->
                <el-button type="text" size="small" @click="powerHandle">编辑</el-button>
                <el-button type="text" class="btns" size="small" @click="powerHandle"
                           v-if="scope.row.status == 1 ">上线</el-button>
                <el-button type="text" class="btns" size="small" @click="powerHandle"
                           v-if="scope.row.status == 0 ">下线</el-button>
              </div>
              <div v-else>
              <!--<router-link :to="{path:'viedoEdit',query:{ id:scope.row.id }}" tag="button" style="color:#409EFF;cursor: pointer;">编辑</router-link>-->
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id,channel)">编辑</el-button>
              <el-button type="text" class="btns" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                         v-if="scope.row.status == 1 ">上线</el-button>
              <el-button type="text" class="btns" size="small" @click="stateHandle(scope.row.id,scope.row.status)"
                         v-if="scope.row.status == 0 ">下线</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './viedolist-edit'
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
        dateValue:[new Date(new Date().setMonth((new Date().getMonth()-1))),new Date(new Date().setHours(23, 59, 59, 59))],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        activeName2: 'first',
        typeName: 0,
        checkList: [{
          name: '',
          id: ''
        }],
        stateList: [{
          value: '0',
          label: '正常'
        },{
          value: '1',
          label: '下线'
        }],
        state: '0',
        datestart:'',
        dateend:'',
        oneClassify: '',
        twoClassify: '',
        classifyList:'',
        marterList:''
      }
    },
    components: {
      AddOrUpdate
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
        return moment(data.createtime).format('YYYY-MM-DD HH:mm:ss')
      },
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
          url: this.$http.adornUrl('/mcn/selnewslist'),
          method: 'post',
          data: this.$http.adornData({
            type:3,
            token: this.$cookie.get('token'),
            id: this.videoId,
            title: this.videoName,
            pgcid: this.userId,
            nickname: this.userName,
            datestart: moment(this.dateValue[0]).format('YYYY-MM-DD HH:mm:ss'),
            dateend: moment(this.dateValue[1]).format('YYYY-MM-DD HH:mm:ss'),
            status: this.state,
            newstype: this.channel,
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

        // 分类
        this.$http({
          url: this.$http.adornUrl('/mcn/getClassify'),
          method: 'get',
          params: this.$http.adornParams({
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          this.classifyList = data.data
        })

        // 频道
        this.$http({
          url: this.$http.adornUrl('/mcn/getType'),
          method: 'get',
          params: this.$http.adornParams({
            'type': 1,
            'token': this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            this.checkList = data.data
          }
        })
      },
      //  二级连动
      changeMethods(id){
        this.classifyList.map(e => {
          if(e.id == id) {
            this.marterList = e.list
            if(e.list = []){
              this.twoClassify = '请选择'
            }
          }
        })
        this.objs = id//obj.label
      },
      selectGet2 (vId) {
        let obj = {}
        obj = this.twoOptions.find((item) => {
          return item.value === vId
        })
        this.objs2 = vId//obj.label
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
            url: this.$http.adornUrl('/mcn/upmcnnews'),
            method: 'post',
            data: this.$http.adornData({
              'id': id,
              'status': status,
              'token': this.$cookie.get('token')
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
