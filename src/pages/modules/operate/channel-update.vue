<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item v-if="numType == 1" label="频道名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="频道名称"></el-input>
      </el-form-item>
      <el-form-item v-if="numType == 0" label="图文名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="图文名称"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="roleNum" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.roleNum" placeholder="序号"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
        numType:'',
        visible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          roleName: '',
          remark: '',
          roleNum: ''
        },
        dataRule: {
          roleName: [
            { required: true, message: '频道名称不能为空', trigger: 'blur' }
          ],
          roleNum: [
            { required: true, message: '序号不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id,name,sort, num) {
        this.dataForm.id = id || 0
        this.visible = true
        this.dataForm.roleNum = sort
        this.dataForm.roleName = name
        this.numType = num
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/updeateType'),
              method: 'post',
              data: this.$http.adornData({
                sort: this.dataForm.roleNum,
                id: this.dataForm.id,
                name: this.dataForm.roleName,
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
