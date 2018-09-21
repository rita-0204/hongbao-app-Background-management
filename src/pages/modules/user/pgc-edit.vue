<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '添加用户'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="作者头像" prop="roleName">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="作者名称" prop="roleName">
        <el-input v-model="dataForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="roleName">
        <el-input v-model="dataForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="roleName">
        <div style="line-height: 38px;">
          <el-radio-group v-model="radio2">
            <el-radio :label="3">男</el-radio>
            <el-radio :label="6">女</el-radio>
            <el-radio :label="9">未知</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="马甲号" prop="roleName">
        <div style="line-height: 38px;">
          <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="2">否</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="分类" prop="roleName">
        <el-select v-model="value" placeholder="选择分类">
          <el-option v-for="item in options1"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分级" prop="roleName">
        <el-select v-model="value">
          <el-option v-for="item in options2"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="签名" prop="remark">
      <el-input v-model="dataForm.remark"></el-input>
    </el-form-item>
    <el-form-item label="爬虫地址" prop="remark">
      <el-input v-model="dataForm.remark"></el-input>
    </el-form-item>
    <el-form-item label="联系人" prop="remark">
      <el-input v-model="dataForm.remark"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="remark">
      <el-input v-model="dataForm.remark"></el-input>
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
        imageUrl: '',
        value:'',
        options:[{
          value: '选项1',
          label: '一级分类'
        }],
        options1:[{
          value: '选项1',
          label: '二级分类'
        }],
        options2:[{
          value: '选项1',
          label: '选择分类'
        }],
        radio: '1',
        radio2: 9,
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
        this.visible = true
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
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
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
