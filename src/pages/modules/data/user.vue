<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" class="checkNoraml" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-form-item label="指标">
          <el-select v-model="test" placeholder="不限" >
            <el-option v-for="item in testList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channel" multiple placeholder="不限" @change="changeMethods(1)">
            <el-option v-for="item in checkList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本">
          <el-select v-model="version" multiple placeholder="不限" @change="changeMethods(2)">
            <el-option v-for="item in versionList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" class="checkBtns" style="line-height: 3px;">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="detail">
      <el-col :p="3" class="title">
        <el-col :span="3">活跃用户</el-col><el-col :span="3">新增用户</el-col><el-col :span="3">新增注册</el-col>
        <el-col :span="3">启动次数</el-col><el-col :span="3">平均启动</el-col><el-col :span="3">次均停留</el-col>
        <el-col :span="3">人均停留</el-col>
      </el-col>
      <el-col :p="3">
        <el-col :span="3">{{1000}}</el-col><el-col :span="3">{{1000}}</el-col><el-col :span="3">{{1000}}</el-col>
        <el-col :span="3">{{1000}}</el-col><el-col :span="3">{{1000}}</el-col><el-col :span="3">{{1000 | dateFrm}}</el-col>
        <el-col :span="3">{{1000 | dateFrm}}</el-col>
      </el-col>
    </el-row>
    <echarts :data="testList"></echarts>
    <span style="color:#409EFF;cursor: pointer;margin-right:5px;">导出表格</span>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon">
      <el-tab-pane label="明细数据" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="regdate"
            label-class-name="colorLabel"
            header-align="center"
            align="center"
            :formatter="formatData"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="渠道">
          </el-table-column>
          <el-table-column
            prop="nickname"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="活跃用户">
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="新增用户">
          </el-table-column>
          <el-table-column
            prop="sex"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="新增注册">
          </el-table-column>
          <el-table-column
            prop="lastlogintime"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="启动次数">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="平均启动">
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="人均停留">
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="次日留存">
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="3日留存">
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="7日留存">
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="14日留存">
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="30日留存">
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
  import echarts from './echarts.vue'
  import moment from 'moment'
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
        typeName: 0,
        dateValue: [new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000), new Date(new Date().setHours(23, 59, 59, 59)-24*60*60*1000)],
        channel:'',
        checkList: [{
          name: '',
          id: ''
        }],
        version:'',
        versionList: [{
          id: 0,
          name: 'V1.0.0'
        },{
          id: 1,
          name: 'V1.0.1'
        },{
          id: 2,
          name: 'V1.0.2'
        },{
          id: 3,
          name: 'V1.0.3'
        }],
        test:'',
        testList:[
          {
            id:0,
            'name': '邮件营销',
            'type': 'line',
            'stack': '总量',
            'data': [ 120, 132, 101, 134, 90, 230, 210 ]
          },
          {
            id:1,
            'name': '联盟广告',
            'type': 'line',
            'stack': '总量',
            'data': [ 220, 182, 191, 234, 290, 330, 310 ]
          },
          {
            id:2,
            'name': '视频广告',
            'type': 'line',
            'stack': '总量',
            'data': [ 150, 232, 201, 154, 190, 330, 410 ]
          },
          {
            id:3,
            'name': '直接访问',
            'type': 'line',
            'stack': '总量',
            'data': [ 320, 332, 301, 334, 390, 330, 320 ]
          },
          {
            id:4,
            'name': '搜索引擎',
            'type': 'line',
            'stack': '总量',
            'data': [ 820, 932, 901, 934, 1290, 1330, 1320 ]
          }
        ]
      }
    },
    components: {
      echarts
    },
    filters:{
      dateFrm: function(el){
        return moment(el).format('HH:mm:ss')
      }
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
      this.init()
      this.getDataList()
    },
    methods: {
      formatData(data){
        return moment(data.regdate).format('YYYY-MM-DD HH:mm:ss')
      },
      init(){
        // 频道
        this.$http({
          url: this.$http.adornUrl('/mcn/getType'),
          method: 'get',
          params: this.$http.adornParams({
            type: 1,
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            this.checkList = data.data
          }
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
          this.$http({
              url: this.$http.adornUrl('/mcn/getlistuser'),
              method: 'get',
              params: this.$http.adornParams({
                channel:this.channel.toString(),
                version:this.version.toString(),
                page: this.pageIndex - 1,
                pagesize: this.pageSize,
                datestart: moment(this.dateValue[0]).format('YYYY-MM-DD HH:mm:ss'),
                dateend: moment(this.dateValue[1]).format('YYYY-MM-DD HH:mm:ss'),
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
      //  多版本多渠道
      changeMethods(id){
          if(this.channel.length > 1 && this.version.length > 1){
            if(id == 2){
              this.version.length = 1
              return alert('多渠道只能选择一个版本')
            }else if(id == 1){
              this.channel.length = 1
              return alert('多版本只能选择一个渠道')
            }
          }
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
  .detail{
    .el-col{
      font-size:24px;
      margin-bottom: 10px;
    }
  .el-col-3{
    width:13.5%;
  }
  }
</style>
