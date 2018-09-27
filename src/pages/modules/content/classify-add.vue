<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '添加子分类'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="分类名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="分类名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          roleName: '',
          remark: ''
        },
        dataRule: {
          roleName: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
          ]
        },
        pidLable: ''
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.dataForm.id){
              this.pidLable = 0
            }else{
              this.pidLable = this.dataForm.id
            }
            this.$http({
              url: this.$http.adornUrl('/mcn/insertClassify'),
              method: 'post',
              data: this.$http.adornData({
                'pid': this.pidLable,
                'name': this.dataForm.roleName,
                'token': this.$cookie.get('token')
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
                this.$message.error(data.data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
