<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="序号" prop="menuNum" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.menuNum" placeholder="序号"></el-input>
      </el-form-item>
      <el-form-item label="资源名称" prop="menuName">
        <el-input v-model="dataForm.menuName" placeholder="资源名称"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="menuUrl">
        <el-input v-model="dataForm.menuUrl" placeholder="链接"></el-input>
      </el-form-item>
      <el-form-item label="父ID" prop="menuPid">
        <el-input v-model="dataForm.menuPid" placeholder="父ID"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" style="height:30px;line-height: 3px;">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" style="height:30px;line-height: 3px;">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {},
        dataRule: {
          menuNum: [
            {required: true, message: '序号不能为空', trigger: 'blur'}
          ],
          menuName: [
            {required: true, message: '资源名称不能为空', trigger: 'blur'}
          ],
          menuPid: [
            {required: true, message: '父ID不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (sequence,id,name,url,pid) {
        this.dataForm.id = id
        this.visible = true
        this.dataForm.menuNum = sequence
        this.dataForm.menuName = name
        this.dataForm.menuUrl = url
        this.dataForm.menuPid = pid
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/controll/up/menu'),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id,
                sequence: this.dataForm.menuNum,
                name: this.dataForm.menuName,
                url: this.dataForm.menuUrl,
                pid: this.dataForm.menuPid,
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
