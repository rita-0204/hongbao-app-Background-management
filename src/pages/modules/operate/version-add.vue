<template>
  <el-dialog
    :title="!dataForm.id ? '添加用户' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-form-item label="作者头像" prop="headImg" :class="{ 'is-required': !dataForm.id }">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="url"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="作者名称" prop="roleName">
        <el-input v-model="dataForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {isEmail, isMobile} from '@/utils/validate'

  export default {
    data() {
      return {
        imageUrl: '',
        url: '',
        value: '',
        visible: false,
        imgUrl: '',
        dataForm: {
          id: 0,
          roleName: '',
          remark: '',
          mobile: '',
          majiaNo: 1,
          sex: 0,
          classify: '',
          grade: '',
          sign: '',
          pachongAd: '',
          contant: '',
          email: '',
          checked: ''
        },
        dataRule: {
          roleName: [
            {required: true, message: '作者名称不能为空', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init(id) {
        this.url = this.$http.adornUrl(`/controll/uploadpic?token=${this.$cookie.get('token')}`)
        this.urlShow = this.$http.adornUrl(`/controll/picshow?token=${this.$cookie.get('token')}`)
        this.dataForm.id = id || 0
        this.visible = true
//        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {

          this.$http({
            url: this.$http.adornUrl('/mcn/infopgc'),
            method: 'get',
            params: this.$http.adornParams({
              id: this.dataForm.id,
              token: this.$cookie.get('token')
            })
          }).then(({data}) => {
            if (data.resultCode == 0) {
              this.imageUrl = data.data.headurl
              this.dataForm.roleName = data.data.nickname
              this.dataForm.mobile = data.data.mobile
              this.dataForm.sex = data.data.sex
              this.dataForm.majiaNo = data.data.type
              this.dataForm.sign = data.data.sign
              this.dataForm.pachongAd = data.data.url
            }
          })
        }
      },
      // 上传之前
      beforeUploadHandle(file) {
        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
          this.$message.error('只支持jpg、png、gif格式的图片！')
          return false
        }
      },
      // 上传成功
      successHandle(response, file) {
        if (response.resultCode == 0) {
          this.imageUrl = this.urlShow + '&url=' + response.data
//          this.imageUrl = URL.createObjectURL(file.raw)
//          this.imgUrl = response.data
        } else {
          this.$message.error(response.msg)
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/pgcadd'),
              method: 'post',
              data: this.$http.adornData({
                'headurl': this.imageUrl,
                'nickname': this.dataForm.roleName,
                'mobile': this.dataForm.mobile,
                'sex': this.dataForm.sex,
                'type': this.dataForm.majiaNo,
                'classify': this.dataForm.classify,
                'rank': this.dataForm.grade,
                'sign': this.dataForm.sign,
                'url': this.dataForm.pachongAd,
                'name': this.dataForm.contant,
                'mail': this.dataForm.email,
                'token': this.$cookie.get('token')
              })
            }).then(({data}) => {
//              console.log(data,2626)
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
          }
        })
      }
    }
  }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 90px;
    height: 90px;
    line-height: 90px;
    text-align: center;
  }

  .avatar {
    width: 90px;
    height: 90px;
    display: block;
  }
</style>
