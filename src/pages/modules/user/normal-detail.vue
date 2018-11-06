<template>
  <el-dialog
    :title="!id ? '用户详情' : '用户详情'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-row :gutter="20" class="top">
      <el-col :span="6">
        <img :src="imageUrl" alt="" class="avatar">
      </el-col>
      <el-col :span="6">{{roleName}}</el-col>
      <el-col :span="6">{{tag}}</el-col>
    </el-row>
    <el-row :gutter="20" class="detail">
      <el-col :span="5">用户ID：</el-col><el-col :span="6">{{userId}}</el-col>
      <el-col :span="5">手机号：</el-col><el-col :span="6">{{mobile}}</el-col>
      <el-col :span="5">性别：</el-col><el-col :span="6">{{sex}}</el-col>
      <el-col :span="5">注册时间：</el-col><el-col :span="6">{{regdate}}</el-col>
      <el-col :span="5">所在地区：</el-col><el-col :span="6">{{address}}</el-col>
      <el-col :span="5">生日：</el-col><el-col :span="6">{{birthday}}</el-col>
      <el-col :span="5">状态：</el-col><el-col :span="6">{{status}}</el-col>
      <el-col :span="5">最后登录：</el-col><el-col :span="6">{{endtime}}</el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import {isEmail, isMobile} from '@/utils/validate'

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
        regdate:'',
        address:'',
        birthday:'',
        status:'',
        endtime:'',
        visible: false
      }
    },
    methods: {
      init(id) {
        this.visible = true
        this.$http({
          url: this.$http.adornUrl('/mcn/infopgc'),
          method: 'get',
          params: this.$http.adornParams({
            id: id,
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            this.imageUrl = data.data.headurl
            this.roleName = data.data.nickname
            this.tag = data.data.tag
            this.sex = data.data.sex
            this.userId = data.data.id
            this.mobile = data.data.mobile
            this.regdate = data.data.regdate
            this.address = data.data.region
            this.birthday = data.data.birthday
            this.status = data.data.status
            this.endtime = data.data.lastLoginTime
          }
        })
      }
    }
  }
</script>
<style lang="scss" type="stylesheet/scss" scoped>
  .top{
    border-bottom: 1px solid #cccccc;
    padding-bottom: 20px;
    margin-bottom: 20px;
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
    .el-col{
      margin-bottom: 20px;
    }
  }
</style>
