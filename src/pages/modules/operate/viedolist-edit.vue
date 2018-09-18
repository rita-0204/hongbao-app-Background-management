<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '视频编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="视频ID" prop="remark">
        <el-input v-model="dataForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="roleName">
        <el-input v-model="dataForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="remark">
        <el-input v-model="dataForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="remark">
        <el-select v-model="value" placeholder="一级分类" style="margin-right:10px;">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="value" placeholder="二级分类">
          <el-option v-for="item in options1"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分级" prop="remark">
        <el-select v-model="value">
          <el-option v-for="item in options2"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="频道" prop="roleName">
        <template>
          <el-checkbox-group v-model="checkList" style="width:100%;">
            <el-checkbox label="推荐"></el-checkbox>
            <el-checkbox label="搞笑"></el-checkbox>
            <el-checkbox label="娱乐"></el-checkbox>
            <el-checkbox label="社会"></el-checkbox>
            <el-checkbox label="生活"></el-checkbox>
            <el-checkbox label="音乐"></el-checkbox>
            <el-checkbox label="美食"></el-checkbox>
            <el-checkbox label="纪录"></el-checkbox>
            <el-checkbox label="旅行"></el-checkbox>
            <el-checkbox label="二次元"></el-checkbox>
            <el-checkbox label="汽车"></el-checkbox>
            <el-checkbox label="运动"></el-checkbox>
            <el-checkbox label="科技"></el-checkbox>
            <el-checkbox label="时尚"></el-checkbox>
            <el-checkbox label="创意"></el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form-item>
      <el-form-item label="用户" prop="roleName">
        <el-select v-model="value">
          <el-option v-for="item in options3"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面" prop="roleName">
        <croppa v-model="myCroppa" :width="160" :height="90"></croppa>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        myCroppa: {},
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
          label: '分级'
        }],
        options3:[{
          value: '选项1',
          label: '用户'
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
