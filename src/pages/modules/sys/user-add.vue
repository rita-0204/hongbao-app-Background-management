<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="用户名" prop="menuNum">
        <el-input v-model="dataForm.menuNum" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="menuName">
        <el-input v-model="dataForm.menuName" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="menuPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input type="password" v-model="dataForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="menuAginPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input type="password" v-model="dataForm.comfirmPassword" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="Classify2" :class="{ 'is-required': !dataForm.id }">
        <el-select v-model="Classify" placeholder="请选择" @change="selectGet2">
          <el-option v-for="item in classifyList"
                     :value="item.id" :label="item.name" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="Classify1" :class="{ 'is-required': !dataForm.id }">
        <el-select v-model="type" placeholder="请选择">
          <el-option v-for="item in typeList"
                     :value="item.status" :label="item.value" :key="item.status"></el-option>
        </el-select>
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
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          menuNum:'',
          menuName:'',
          password:'',
          comfirmPassword:''
        },
        dataRule: {
          menuNum: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          menuName: [
            { required: true, message: '昵称不能为空', trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          Classify: [
            { required: true, message: '角色不能为空', trigger: 'blur' }
          ]
        },
        Classify: '',
        classifyList:'',
        type:0,
        typeList:[{
          status:0,
          value:'业务员'
        },{
          status:1,
          value:'管理层'
        }]
      }
    },
    methods: {
      init (type) {
        this.dataForm.id = type
        this.visible = true
        this.$nextTick(() => {
          this.dataForm.password = ''
          this.dataForm.comfirmPassword = ''
          this.Classify = ''
          this.$refs['dataForm'].resetFields()
        })
        // 分类
        this.$http({
          url: this.$http.adornUrl('/controll/get/group/all'),
          method: 'post',
          data: this.$http.adornData({
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          this.classifyList = data.data
        })
      },
      selectGet2 (vId) {
        this.Classify = vId//obj.label
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/controll/add/pserson'),
              method: 'post',
              data: this.$http.adornData({
                username: this.dataForm.menuNum,
                truename: this.dataForm.menuName,
                gid: this.Classify,
                type: this.type,
                password: this.dataForm.password,
                comfirmPassword: this.dataForm.comfirmPassword,
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
                this.$message.error(data.data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
