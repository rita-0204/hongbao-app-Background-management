<template>
  <el-dialog
    :title="!dataForm.id ? '用户详情' : '用户详情'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <img :src="imageUrl" class="avatar">
      <el-form-item label="作者名称" prop="roleName">
        <el-input v-model="dataForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex" :class="{ 'is-required': !dataForm.id }">
        <div style="line-height: 38px;">
          <el-radio-group v-model="dataForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="0">未知</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="马甲号" prop="majiaNo" :class="{ 'is-required': !dataForm.id }">
        <div style="line-height: 38px;">
          <el-radio v-model="dataForm.majiaNo" :label="1">是</el-radio>
          <el-radio v-model="dataForm.majiaNo" :label="0">否</el-radio>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {isEmail, isMobile} from '@/utils/validate'

  export default {
    data() {
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        imageUrl: '',
        url: '',
        value: '',
        checkList: [],
        visible: false,
        imgUrl: '',
        dataForm: {
          id: 0,
          roleName: '',
          remark: '',
          mobile: '',
          majiaNo: 1,
          sex: 0
        }
      }
    },
    methods: {
      init(id) {
        this.visible = true
        this.$http({
          url: this.$http.adornUrl('/mcn/infopgc'),
          method: 'get',
          params: this.$http.adornParams({
            'id': id,
            'token': this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data.resultCode == 0) {
            this.imageUrl = data.data.headurl
            this.dataForm.roleName = data.data.nickname
            this.dataForm.mobile = data.data.mobile
            this.dataForm.sex = data.data.sex
            this.dataForm.majiaNo = data.data.type
          }
        })
      }
    }
  }
</script>
<style lang="scss" type="stylesheet/scss" scoped>
  .avatar {
    width: 100px;
    height: 100px;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
    display: block;
    border:1px solid #999;
  }
</style>
