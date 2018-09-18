<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '添加推送'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="标题" prop="roleName">
        <el-input v-model="dataForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="roleName">
        <el-input
          v-model="dataForm.roleName"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="设备" prop="roleName">
        <el-radio-group v-model="radio2">
          <el-radio :label="3">全部</el-radio>
          <el-radio :label="6">ios</el-radio>
          <el-radio :label="9">Android</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型" prop="roleName">
        <el-radio v-model="radio" label="1">图文</el-radio>
        <el-radio v-model="radio" label="2">视频</el-radio>
        <el-input v-model="dataForm.remark" placeholder="输入图文ID"></el-input>
      </el-form-item>
      <el-form-item label="发送" prop="roleName">
        <el-radio v-model="radio3" label="1">立即</el-radio>
        <el-radio v-model="radio3" label="2">定时</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        textarea:'',
        radio:"1",
        radio2:3,
        radio3:'',
        value:'',
        options:[{
          value: '选项1',
          label: '一级分类'
        }],
        options1:[{
          value: '选项1',
          label: '二级分类'
        }],
        checkList: [],
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
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
//        this.$http({
//          url: this.$http.adornUrl('/sys/menu/list'),
//          method: 'get',
//          params: this.$http.adornParams()
//        }).then(({data}) => {
//          this.menuList = treeDataTranslate(data, 'menuId')
//        }).then(() => {
        this.visible = true
//          this.$nextTick(() => {
//            this.$refs['dataForm'].resetFields()
//            this.$refs.menuListTree.setCheckedKeys([])
//          })
//        }).then(() => {
//          if (this.dataForm.id) {
//            this.$http({
//              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
//              method: 'get',
//              params: this.$http.adornParams()
//            }).then(({data}) => {
//              if (data && data.code === 0) {
//                this.dataForm.roleName = data.role.roleName
//                this.dataForm.remark = data.role.remark
//                var idx = data.role.menuIdList.indexOf(this.tempKey)
//                if (idx !== -1) {
//                  data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
//                }
//                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
//              }
//            })
//          }
//        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/updeateType'),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'name': this.dataForm.roleName
              })
            }).then(({data}) => {
              console.log(data,2626)
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
