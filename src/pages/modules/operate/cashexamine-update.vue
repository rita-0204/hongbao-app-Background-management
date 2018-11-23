<template>
  <el-dialog
    :title="!dataForm.id ? '原因' : '原因'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="原因" prop="default">
        <el-input type="textarea" v-model="dataForm.default" :placeholder="dataForm.default"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" style="height:30px;line-height: 3px;">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" style="height:30px;line-height: 3px;">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        numType:'',
        visible: false,
        dataForm: {
          id: 0,
          default: ''
        },
        dataRule: {
          default: [
            { required: true, message: '原因不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (obj) {
        this.dataForm.id = obj.id
        this.visible = true
        this.dataForm.default = obj.cause
        this.dataForm.status = obj.status
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/up/user/record'),
              method: 'post',
              data: this.$http.adornData({
                cause: this.dataForm.default,
                id: this.dataForm.id,
                status: 3,
                token: this.$cookie.get('token')
              })
            }).then(({data}) => {
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
