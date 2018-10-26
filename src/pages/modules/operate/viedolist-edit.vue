<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '视频编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <video ref="video" controls preload="auto"></video>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="视频ID" prop="remark">
        <el-input v-model="dataForm.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="remark">
        <el-input v-model="dataForm.tag"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="remark">
        <el-select v-model="oneClassify" placeholder="一级分类" style="margin-right:10px;">
          <el-option v-for="item in oneOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="twoClassify" placeholder="二级分类">
          <el-option v-for="item in twoOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分级" prop="remark">
        <el-select v-model="rank">
          <el-option v-for="item in rankOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="频道" prop="channel" >
        <template>
          <el-checkbox-group v-model="dataForm.checked" style="width:100%;margin-top:10px;">
            <el-checkbox v-for="item in checkList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form-item>
      <el-form-item label="用户ID" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="输入用户ID"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="coverImg">
        <div class="cut">
          <vue-cropper ref="cropper" :img="coverImg" :output-size="optionImg.size" :output-type="optionImg.outputType" :info="true" :full="optionImg.full"
                       :can-move="optionImg.canMove" :can-move-box="optionImg.canMoveBox" :fixed-box="optionImg.fixedBox" :original="optionImg.original"
                       :auto-crop="optionImg.autoCrop" :auto-crop-width="optionImg.autoCropWidth" :auto-crop-height="optionImg.autoCropHeight" :center-box="optionImg.centerBox"
                       :high="optionImg.high" ></vue-cropper>
        </div>
        <img :src="downImg" alt="" style="position: absolute;right: 80px;top: 0;">
        <el-button type="primary" class="btncutImg" @click="uploadCroppedImage">确认裁剪</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  import { VueCropper }  from 'vue-cropper'
  export default {
    data() {
      return {
        optionImg: {
          img: 'https://avatars3.githubusercontent.com/u/15681693',
          size: 1,
          full: false,
          outputType: 'png',
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 160,
          autoCropHeight: 90,
          centerBox: false,
          high: true
        },
        oneClassify: '',
        twoClassify: '',
        rank: '1',
        value: '',
        coverImg:'',
        oneOptions: [{
          value: '选项1',
          label: '一级分类'
        }],
        twoOptions: [{
          value: '选项1',
          label: '二级分类'
        }],
        rankOptions: [{
          value: '1',
          label: '一级'
        }, {
          value: '2',
          label: '二级'
        }],
        options3: [{
          value: '选项1',
          label: '用户'
        }],
        checkList: [{
          name: '',
          id: ''
        }],
        visible: false,
        dataForm: {
          id: 0,
          remark: '',
          title: '',
          userName: '',
          checked: [0,1],
        },
        dataRule: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          channel: [
            {required: true, message: '频道不能为空', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '用户ID不能为空', trigger: 'blur'}
          ],
          coverImg: [
            {required: true, message: '请设置封面', trigger: 'blur'}
          ]
        },
        downImg:'',
        video:''
      }
    },
    components: {
      VueCropper,
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0
        this.visible = true
        // 分类
        this.$http({
          url: this.$http.adornUrl('/mcn/getClassify'),
          method: 'get',
          params: this.$http.adornParams({
            'token': this.$cookie.get('token')
          })
        }).then(({data}) => {
          var classifyList = data.data
          var oneClassifyList = ''
          var twoClassifyList = [];
//          console.log(classifyList)
          for (var i = 0; i < classifyList.length; i++) {
            oneClassifyList = oneClassifyList + '{"label":"' + classifyList[i].name + '","value":"' + classifyList[i].id + '"}' + ','
            var storeList = classifyList[i].list;
            for (var i in storeList) {
              twoClassifyList.push({
                label: storeList[i].name,
                value: storeList[i].id
              });
            }
          }
          //去除最后一个逗号
          oneClassifyList = oneClassifyList.substring(0, oneClassifyList.length - 1);
          oneClassifyList = '[' + oneClassifyList + ']';
          //将json 字符串转成json对象
          var obj_oneClassify = JSON.parse(oneClassifyList)
          this.oneOptions = obj_oneClassify
          this.twoOptions = twoClassifyList
        }).then(() => {

          // 频道
          this.$http({
            url: this.$http.adornUrl('/mcn/getType'),
            method: 'get',
            params: this.$http.adornParams({
              'type': 1,
              'token': this.$cookie.get('token')
            })
          }).then(({data}) => {
            if (data.resultCode == 0) {
              this.checkList = data.data
            }
          })

          this.$http({
            url: this.$http.adornUrl(`/mcn/newsinfo`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id,
              'token': this.$cookie.get('token')
            })
          }).then(({data}) => {
//            console.log(data)
            if (data.resultCode == 0) {
              this.dataForm.id = data.data.id
              this.dataForm.title = data.data.title
              var storeListOne = this.oneOptions;
              for (var i in storeListOne) {
                if (storeListOne[i].value == data.data.classify1) {
                  this.oneClassify = storeListOne[i].label
                }
              }
              var storeListTwo = this.twoOptions;
              for (var i in storeListTwo) {
                if (storeListTwo[i].value == data.data.classify2) {
                  this.twoClassify = storeListTwo[i].label
                }
              }
              this.dataForm.userName = data.data.pgcid
              this.dataForm.checked = data.data.newsconcern.split(",").map(Number)
              this.coverImg = data.data.cover
              this.$refs.video.src = data.data.video
            }
          })
        })
      },
      uploadCroppedImage() {
        // 输出
        this.$refs.cropper.getCropData((data) => {
//          console.log(data)
          this.downImg = data
        })
      },
        // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/newsinfo'),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'token': this.$cookie.get('token')
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

<style lang="scss">
  .btncutImg{
    float: right;
    margin: 50px 265px 0 0;
  }
  .cut{
    width:160px;
    height:90px;
  }
</style>
