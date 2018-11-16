<template>
  <el-dialog
    :title="!id ? '用户详情' : '用户详情'"
    :close-on-click-modal="false"
    :visible.sync="visible" class="normalDialog">
    <el-row :gutter="20" class="top">
      <el-col :span="4">
        <img :src="imageUrl" alt="" class="avatar" style="margin:0 auto;">
      </el-col>
      <el-col :p="2">
        <el-col :span="25" style="font-size:28px;margin-bottom:20px;">{{roleName}}</el-col>
        <el-col :span="15">{{tag}}这个家伙很懒，什么也没留下</el-col>
      </el-col>
      <el-row :gutter="10" style="float:right;" class="totalDetail">
        <el-col :p="2">
          <el-col :span="25">当前余额：</el-col><el-col :span="8">{{rmb}} 元</el-col>
        </el-col>
        <el-col :p="2">
          <el-col :span="25">今日金币：</el-col><el-col :span="8">{{gold}}</el-col>
        </el-col>
        <el-col :p="2">
          <el-col :span="35">累计收入：</el-col><el-col :span="8">{{sumRmb}} 元</el-col>
        </el-col>
        <el-col :p="2">
          <el-col :span="35">累计金币：</el-col><el-col :span="8">{{sumGold}}</el-col>
        </el-col>
      </el-row>
    </el-row>
    <el-row :gutter="20" class="detail" style="padding:0 50px;">
      <el-col :p="3">
        <el-col :span="6">用户ID：</el-col><el-col :span="4">{{userId}}</el-col>
      </el-col>
      <el-col :p="3">
        <el-col :span="6">手机号：</el-col><el-col :span="6">{{mobile}}</el-col>
      </el-col>
      <el-col :p="3">
        <el-col :span="5">性别：</el-col><el-col :span="6">{{sex}}</el-col>
      </el-col>
      <el-col :p="3">
        <el-col :span="7">注册时间：</el-col><el-col :span="15">{{regdate | dateFrm}}</el-col>
      </el-col>
      <el-col :p="3">
        <el-col :span="7">所在地区：</el-col><el-col :span="9">{{address}}</el-col>
      </el-col>
      <el-col :p="3">
        <el-col :span="6">生日：</el-col><el-col :span="6">{{birthday}}</el-col>
      </el-col>
      <el-col :p="3">
        <el-col :span="5">状态：</el-col><el-col :span="6">{{status}}</el-col>
      </el-col>
      <el-col :p="3">
        <el-col :span="7">最后登录：</el-col><el-col :span="15">{{endtime | dateFrm}}</el-col>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <el-tab-pane label="金币明细" name="first">
        <el-date-picker
          v-model="valueData1"
          type="daterange"
          range-separator="至"
          :clearable="false"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="checkDatas" style="margin-bottom:20px;"
          @change="getDataList(userid)">
        </el-date-picker>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="类型">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="备注">
            <template slot-scope="scope">
              <el-button type="text" size="small">{{scope.row.typeName}}</el-button>
              <el-button type="text" size="small">{{scope.row.newsId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="creatdate"
            header-align="center"
            align="center"
            :formatter="formatData"
            label-class-name="colorLabel"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="gold"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="金币">
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
      <el-tab-pane label="现金明细" name="second">
        <el-date-picker
          v-model="valueData2"
          type="daterange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="checkDatas" style="margin-bottom:20px;"
          @change="getDataList(userid)">
        </el-date-picker>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="原因">
          </el-table-column>
          <el-table-column
            class="creatdate"
            prop="status"
            :formatter="formatData"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="gold"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="金币">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle1"
          @current-change="currentChangeHandle1"
          :current-page="pageIndex1"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize1"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="好友列表" name="three">
        <el-date-picker
          v-model="valueData3"
          type="daterange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="checkDatas" style="margin-bottom:20px;"
          @change="getDataList2()">
        </el-date-picker>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="用户">
          </el-table-column>
          <el-table-column
            prop="regDate"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="注册时间">
          </el-table-column>
          <el-table-column
            prop="day1"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="第一天">
          </el-table-column>
          <el-table-column
            prop="day2"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="第二天">
          </el-table-column>
          <el-table-column
            prop="day3"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="第三天">
          </el-table-column>
          <el-table-column
            prop="num"
            header-align="center"
            align="center"
            label-class-name="colorLabel"
            label="邀请人数">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle2"
          @current-change="currentChangeHandle2"
          :current-page="pageIndex2"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize2"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import {isEmail, isMobile} from '@/utils/validate'
  import moment from 'moment'
  export default {
    data() {
      return {
        imageUrl: '',
        roleName: '',
        userId:'',
        mobile:'',
        tag:'',
        id:'',
        sex:0,
        rmb:'',
        sumRmb:'',
        gold:'',
        sumGold:'',
        regdate:'',
        address:'',
        birthday:'',
        status:'',
        endtime:'',
        visible: false,
        activeName2: 'first',
        dataList: [],
        dataListLoading: false,
        valueData1:'',
        valueData2:'',
        valueData3:'',
        pageIndex2: 1,
        pageSize2: 10,
        pageIndex1: 1,
        pageSize1: 10,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        startDate1:'',
        endDate1:'',
        typeName:0,
        userid:'',
        page:''
      }
    },
    filters:{
      dateFrm: function(el){
        return moment(el).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
      init(id) {
        var vm = this;
        vm.userid = id
        vm.visible = true
        vm.activeName2 = 'first'
        vm.pageIndex1 = 1,
        vm.pageIndex2 = 1
        vm.$http({
          url: vm.$http.adornUrl('/mcn/userInfo'),
          method: 'get',
          params: vm.$http.adornParams({
            id: id,
            token: vm.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            vm.imageUrl = data.data.headurl
            vm.roleName = data.data.nickname
            vm.tag = data.data.tag
            vm.userId = data.data.id
            vm.mobile = data.data.mobile
            if(data.data.sex == 0){
              vm.sex = '未知'
            }else if(data.data.sex == 1){
              vm.sex = '男'
            }else if(data.data.sex == 2){
              vm.sex = '女'
            }
            vm.rmb = data.data.rmb
            vm.sumRmb = data.data.sumRmb
            vm.gold = data.data.gold
            vm.sumGold = data.data.sumGold
            vm.regdate = data.data.regdate
            vm.address = data.data.region
            vm.birthday = data.data.birthday
            if(data.data.sex == 0){
              vm.status = '正常'
            }else if(data.data.sex == 1){
              vm.status = '封禁'
            }
            vm.endtime = data.data.lastlogintime
          }
        })
        vm.getDataList (id)
      },
      formatData(data){
        return moment(data.creatdate).format('YYYY-MM-DD HH:mm:ss')
      },
      handleClick(tab, event) {
        if(tab.name == 'first'){
          this.typeName = 0;
          this.pageIndex = 1
          this.getDataList (this.userid)
        }else if(tab.name == 'second'){
          this.typeName = 1
          this.pageIndex1 = 1
          this.getDataList (this.userid)
        }else if(tab.name == 'three'){
          this.getDataList2 (this.userid)
        }
      },
      // 获取数据列表
      getDataList (id) {
        this.dataListLoading = true
        if(this.typeName == 1){
          this.startDate1 = this.valueData2[0]
          this.endDate1 = this.valueData2[1]
          this.page = this.pageIndex1 - 1
        }else if(this.typeName == 0){
          this.startDate1 = this.valueData1[0]
          this.endDate1 = this.valueData1[1]
          this.page = this.pageIndex - 1
        }
        this.$http({
          url: this.$http.adornUrl('/mcn/get/pay/list'),
          method: 'post',
          data: this.$http.adornData({
            type: this.typeName,
            userid: id,
            token: this.$cookie.get('token'),
            startDate1:this.startDate1,
            endDate1:this.endDate1,
            page: this.page,
            pagesize: this.pageSize
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
//            console.log(data)
            this.dataList = data.data.list
            this.totalPage = data.data.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      getDataList2 (id) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/mcn/get/user/friend'),
          method: 'post',
          data: this.$http.adornData({
            userid: 9656,
            token: this.$cookie.get('token'),
            startDate1:this.valueData3[0],
            endDate1:this.valueData3[1],
            page: this.pageIndex2 - 1,
            pagesize: this.pageSize2
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
//            console.log(data)
            this.dataList = data.data.list
            this.totalPage = data.data.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle2 (val) {
        this.pageSize2 = val
        this.pageIndex2 = 1
        this.getDataList2(this.userid)
      },
      // 当前页
      currentChangeHandle2 (val) {
        this.pageIndex2 = val
        this.getDataList2(this.userid)
      },
      // 每页数
      sizeChangeHandle1 (val) {
        this.pageSize1 = val
        this.pageIndex1 = 1
        this.getDataList(this.userid)
      },
      // 当前页
      currentChangeHandle1 (val) {
        this.pageIndex1 = val
        this.getDataList(this.userid)
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList(this.userid)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.userid)
      }
    }
  }
</script>
<style lang="scss" type="stylesheet/scss" scoped>
  .top{
    border-bottom: 1px solid #cccccc;
    padding-bottom: 20px;
    margin-bottom: 20px;
    .el-col-24{
      margin-bottom: 10px;
      float:left;
      width:25%;
    }
  }
  .totalDetail{
    .el-col-24{
      margin-bottom: 10px;
      float:left;
      width:38%;
      font-weight:bold;
      .el-col{
        font-size:18px;
      }
    }
  }
  .avatar {
    width: 100px;
    height: 100px;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
    display: block;
    border:1px solid #999;
  }
  .detail{
    margin-bottom:20px;
    .el-col-24{
      margin-bottom: 10px;
      float:left;
      width:25%;
    }
  }
</style>
