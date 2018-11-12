<template>
  <el-dialog
    :title="!dataForm.id ? '授权' : '授权'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="id"
          ref="menuListTree"
          :default-expand-all="true"
          show-checkbox>
        </el-tree>
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
          children: 'list'
        },
        dataForm: {
          id: 0
        }
      }
    },
    methods: {
      init (id,acl) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/controll/get/menu'),
          method: 'post',
          data: this.$http.adornData({
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data.data, 'id')
        }).then(() => {
          if(acl == undefined){
            this.visible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
              this.$refs.menuListTree.setCheckedKeys([])
            })
          }else{
            var str = acl.split(",");
            var dataIntArr=[];//保存转换后的整型字符串
            // 转成整数数组
            str.forEach(function(data,index,arr){
              dataIntArr.push(+data);
            });
            // 删除方法
            Array.prototype.remove = function(val) {
              var index = this.indexOf(val);
              if (index > -1) {
                this.splice(index, 1);
              }
            };
            dataIntArr.remove(1);
            dataIntArr.remove(2);
            dataIntArr.remove(3);
            dataIntArr.remove(4);
            this.visible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
              this.$refs.menuListTree.setCheckedKeys(dataIntArr)
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/controll/up/group'),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id,
                token: this.$cookie.get('token'),
                acl: [].concat(this.$refs.menuListTree.getCheckedKeys(), this.$refs.menuListTree.getHalfCheckedKeys()).toString()
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
