<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-form-item label="版本" prop="edition">
        <el-input v-model="dataForm.edition"></el-input>
      </el-form-item>
      <el-form-item label="更新" prop="explain">
        <el-input v-model="dataForm.explain"></el-input>
      </el-form-item>
      <el-form-item label="渠道" prop="channel">
        <el-input v-model="dataForm.channel"></el-input>
      </el-form-item>
      <el-form-item label="文件" prop="headImg" class="files" :class="{ 'is-required': !dataForm.id }">
        <p class="imageUrl"><span>{{dataForm.imageUrl}}</span></p>
        <el-upload
          class="avatar-uploader uploaderStyle"
          :show-file-list="false"
          :action="url"
          :on-success="successHandle">
          上传文件
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" style="height:30px;line-height: 3px;">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()" style="height:30px;line-height: 3px;">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {isEmail, isMobile} from '@/utils/validate'

  export default {
    data() {
      return {
        url: '',
        value: '',
        visible: false,
        imgUrl: '',
        dataForm: {
          edition: '',
          channel: '',
          explain: '',
          imageUrl: ''
        },
        dataRule: {
          edition: [
            {required: true, message: '版本不能为空', trigger: 'blur'}
          ],
          channel: [
            {required: true, message: '渠道不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init(id) {
        this.url = this.$http.adornUrl(`/mcn/up/app?token=${this.$cookie.get('token')}`)
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.dataForm.imageUrl = ''
          this.$refs['dataForm'].resetFields()
        })
      },
      // 上传成功
      successHandle(response, file) {
        if (response.resultCode == 0) {
          this.dataForm.imageUrl = response.data
        } else {
          this.$message.error(response.msg)
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/add/app/channel'),
              method: 'post',
              data: this.$http.adornData({
                edition:this.dataForm.edition,
                channel:this.dataForm.channel,
                explain:this.dataForm.explain,
                uploading:this.dataForm.imageUrl,
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
<style lang="scss" type="stylesheet/scss" scoped>
  .imageUrl{
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding-left: 10px;
    line-height: 30px;
    min-height: 30px;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
  }
  .files .avatar-uploader{
    margin-top:20px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    height:40px;
    line-height:40px;
    width:80px;
    text-align: center;
  }

</style>
