<template>
  <div style="padding:50px 0;" v-show="visible">
    <video ref="video" controls preload="auto"></video>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px" class="formWidth">
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
        <el-select v-model="oneClassify" placeholder="请选择" @change="changeMethods">
          <el-option v-for="item in classifyList"
                     :value="item.id" :label="item.name" :key="item.id"></el-option>
        </el-select>
        <el-select v-model="twoClassify" placeholder="请选择" @change="selectGet2">
          <el-option v-for="item in marterList" :label="item.name" :value="item.id" :key="item.id"></el-option>
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
          <vue-cropper ref="cropper" :img="optionImg.img" :output-size="optionImg.size" :output-type="optionImg.outputType" :info="true" :full="optionImg.full"
                       :can-move="optionImg.canMove" :can-move-box="optionImg.canMoveBox" :fixed-box="optionImg.fixedBox" :original="optionImg.original"
                       :auto-crop="optionImg.autoCrop" :auto-crop-width="optionImg.autoCropWidth" :auto-crop-height="optionImg.autoCropHeight" :center-box="optionImg.centerBox"
                       :high="optionImg.high" ></vue-cropper>
        </div>
        <el-upload
          class="viedo-uploader"
          :show-file-list="false"
          :action="url"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span style="display:inline-block;position:absolute;right:150px;top: 115px;">预览</span>
        <div style="width:162px;height:92px;border:1px solid red;position: absolute;right: 80px;top: 0;">
          <img :src="downImg" alt="" style="width:160px;height:90px;">
        </div>
        <el-button type="primary" class="btncutImg" @click="uploadCroppedImage($event, 1)">确认裁剪</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" style="margin: 0 auto;display:block;text-align: center">
      <el-button @click="goBack()">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </div>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  import { VueCropper }  from 'vue-cropper'
  export default {
    data() {
      return {
        imageUrl: '',
        url: '',
        optionImg: {
          img: '',
          size: 1,
          full: false,
          outputType: 'png,jpeg',
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
        rank: 1,
        value: '',
        coverImg:'',
        rankOptions: [{
          value: 0,
          label: '请选择'
        },{
          value: 1,
          label: '一级'
        }, {
          value: 2,
          label: '二级'
        },{
          value: 3,
          label: '三级'
        },{
          value: 4,
          label: '四级'
        },{
          value: 5,
          label: '五级'
        }],
        options3: [{
          value: '选项1',
          label: '用户'
        }],
        checkList: [{
          name: '',
          id: ''
        }],
        visible: true,
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
          userName: [
            {required: true, message: '用户ID不能为空', trigger: 'blur'}
          ]
        },
        downImg:'',
        video:'',
        objs: null,
        objs2: null,
        classifyList:'',
        marterList:''
      }
    },
    components: {
      VueCropper,
    },
//    created() {
//      this.init(this.$route.query.id);
//    },
    activated () {
//      this.visible = true
      this.init(this.$route.query.id);
    },
    methods: {
      init(id) {
        this.url = this.$http.adornUrl(`/controll/uploadpic?token=${this.$cookie.get('token')}`)
        this.dataForm.id = id
        // 分类
        this.$http({
          url: this.$http.adornUrl('/mcn/getClassify'),
          method: 'get',
          params: this.$http.adornParams({
            token: this.$cookie.get('token')
          })
        }).then(({data}) => {
          this.classifyList = data.data
        }).then(() => {
          // 频道
          this.$http({
            url: this.$http.adornUrl('/mcn/getType'),
            method: 'get',
            params: this.$http.adornParams({
              type: 1,
              token: this.$cookie.get('token')
            })
          }).then(({data}) => {
            if (data.resultCode == 0) {
              this.checkList = data.data
            }
          })
          //  编辑
          this.$http({
            url: this.$http.adornUrl(`/mcn/newsinfo`),
            method: 'post',
            data: this.$http.adornData({
              id: id,
              token: this.$cookie.get('token')
            })
          }).then(({data}) => {
            if (data.resultCode == 0) {
              this.dataForm.id = data.data.id
              this.dataForm.title = data.data.title
              this.oneClassify = data.data.classify1
              this.twoClassify = data.data.classify2
              this.classifyList.map(e => {
                if(e.id == this.oneClassify) {
                  this.marterList = e.list
                }
              })
              this.rank = data.data.grade
              this.dataForm.userName = data.data.pgcid
              this.dataForm.checked = data.data.newsconcern.split(",").map(Number)

              /*
                 string 字符串;
                 str 指定字符;
                 split(),用于把一个字符串分割成字符串数组;
                 split(str)[0],读取数组中索引为0的值（第一个值）,所有数组索引默认从0开始;
               */
              var string = String(data.data.cover)
              var str = string.split('@')[0]
              this.optionImg.img = str
              this.downImg = str
              this.$refs.video.src = data.data.video
            }
          })
        })
      },
      //  二级连动
      changeMethods(id){
        this.classifyList.map(e => {
          if(e.id == id) {
            this.marterList = e.list
            if(e.list = []){
              this.twoClassify = '请选择'
            }
          }
        })
        this.objs = id//obj.label
      },
      selectGet2 (vId) {
        this.objs2 = vId//obj.label
      },
      //  上传图片
      uploadCroppedImage(e, num) {
        this.$refs.cropper.getCropData((data) => {
          // 输出 预览
          this.downImg = data
          this.$refs.cropper.getCropBlob((data) => {
            let img = window.URL.createObjectURL(data)
            let formData = new FormData();
            formData.append("file", data, this.fileName);
            this.$http.post(this.$http.adornUrl(`/controll/uploadpic?token=${this.$cookie.get('token')}`), formData, {
              contentType: false,
              processData: false,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
              .then((response) => {
                this.downImg = response.data.data;
              })
          })
        })
      },
      // 上传之前
      beforeUploadHandle(file) {
        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
          this.$message.error('只支持jpg、png、gif格式的图片！')
          return false
        }
      },
      // 上传成功
      successHandle(response, file) {
        if (response.resultCode == 0) {
//          this.imageUrl = response.data
          this.optionImg.img = response.data
        } else {
          this.$message.error(response.msg)
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/upmcnnews'),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id,
                title:this.dataForm.title,
                tag:this.dataForm.tag,
                classify1:this.objs,
                classify2:this.objs2,
                grade: this.rank,
                newsconcern: this.dataForm.checked.toString(),
                pgcid:this.dataForm.userName,
                cover:this.downImg,
                token: this.$cookie.get('token'),
              })
            }).then(({data}) => {
              if (data.resultCode == 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({
                      path: '/viedoList'
                    })

//                    this.downImg = ''
//                    this.visible = false;
//                    this.init(this.dataForm.id);
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      goBack(){
//        this.init(this.$route.query.id);
        this.$router.go(-1)
//        this.$router.push({
//          path: '/viedoList'
//        })
//        this.visible = false;
      }
    }
  }
</script>

<style lang="scss">
  .el-dialog{
    width:72%;
  }
  .formWidth{
    width:600px;
  }
  .btncutImg{
    float: right;
    margin: 50px 265px 0 0;
  }
  .cut{
    width:160px;
    height:90px;
  }
  video{
    width:400px;
    height:300px;
    position: fixed;
    right:180px;
    /*top:0;*/
  }
</style>
