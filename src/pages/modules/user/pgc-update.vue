<template>
  <el-dialog
    :title="!dataForm.id ? '添加用户' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
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
      <el-form-item label="分类" prop="classify" :class="{ 'is-required': !dataForm.id }">
        <el-select v-model="dataForm.classify" placeholder="选择分类">
          <el-option v-for="item in classifyOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分级" prop="grade" :class="{ 'is-required': !dataForm.id }">
        <el-select v-model="dataForm.grade">
          <el-option v-for="item in rankOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签名" prop="sign">
        <el-input v-model="dataForm.sign"></el-input>
      </el-form-item>
      <el-form-item label="爬虫地址" prop="pachongAd">
        <el-input v-model="dataForm.pachongAd"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contant">
        <el-input v-model="dataForm.contant"></el-input>
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
        classifyOptions: [{
          value: '1',
          label: '一级分类'
        }],
        rankOptions: [{
          value: '1',
          label: '一级'
        },
          {
            value: '2',
            label: '二级'
          },
          {
            value: '3',
            label: '三级'
          },
          {
            value: '4',
            label: '四级'
          },
          {
            value: '5',
            label: '五级'
          }],
        checkList: [],
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
          email: ''
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
          ],
          majiaNo: [
            {required: true, message: '请选择马甲号', trigger: 'blur'}
          ],
//          grade: [
//            {required: true, message: '请选择分级', trigger: 'blur'}
//          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
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
          // 频道
          this.$http({
            url: this.$http.adornUrl('/mcn/getType'),
            method: 'get',
            params: this.$http.adornParams({
              type: this.typeName,
              token: this.$cookie.get('token')
            })
          }).then(({data}) => {
            if (data.resultCode == 0) {
//              this.dataList = data.data
            } else {
              this.dataList = []
            }
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/mcn/infopgc'),
              method: 'get',
              params: this.$http.adornParams({
                'id': this.dataForm.id,
                'token': this.$cookie.get('token')
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
                this.dataForm.contant = data.data.name
                this.dataForm.email = data.data.mail
                if (data.data.classify == 1) {
                  this.dataForm.classify = '一级分类'
                } else if (data.data.classify == 2) {
                  this.dataForm.classify = '二级分类'
                }
                if (data.data.rank == 1) {
                  this.dataForm.grade = '一级'
                } else if (data.data.rank == 2) {
                  this.dataForm.grade = '二级'
                } else if (data.data.rank == 3) {
                  this.dataForm.grade = '三级'
                } else if (data.data.rank == 4) {
                  this.dataForm.grade = '四级'
                } else if (data.data.rank == 5) {
                  this.dataForm.grade = '五级'
                }
              }
            })
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
              url: this.$http.adornUrl('/mcn/uppgc'),
              method: 'post',
              data: this.$http.adornData({
                id:this.dataForm.id,
                headurl: this.imageUrl,
                nickname: this.dataForm.roleName,
                mobile: this.dataForm.mobile,
                sex: this.dataForm.sex,
                type: this.dataForm.majiaNo,
                classify: this.dataForm.classify,
                rank: this.dataForm.grade,
                sign: this.dataForm.sign,
                url: this.dataForm.pachongAd,
                name: this.dataForm.contant,
                mail: this.dataForm.email,
                token: this.$cookie.get('token')
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
