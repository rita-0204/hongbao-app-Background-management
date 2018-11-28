<template>
  <el-dialog
    title="文章新增"
    size="small" @close='closeHandle()'
    :visible.sync="visible" class="articleDialog">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
               label-width="80px" class="formWidth">
        <el-form-item label="标题" prop="title" :class="{ 'is-required': !dataForm.id }">
          <el-input v-model="dataForm.title"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="remark">
          <div style="width:550px;overflow:hidden;">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)" style="margin-bottom:10px;">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
          </div>
        </el-form-item>
        <el-form-item label="用户ID" prop="username" :class="{ 'is-required': !dataForm.id }">
          <el-input v-model="dataForm.userid" placeholder="输入用户ID" style="width:30%;"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="coverImg">
          <div style="display:flex;">
            <div class="info-item" style="flex:1;"></div>
            <div class="info-item" style="flex:1;margin-left:-550px;">
              <label class="btn btn-orange" for="uploads" style="display:inline-block;width: 70px;padding: 0;text-align: center;margin-left:-120px;line-height: 28px;">选择图片</label>
              <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
              <input type="button" class="btn btn-blue" value="确定" @click="uploadCroppedImage('blob')">
              <div class="line" style="margin-left: -280px;margin-top: 85px;">
                <div class="cropper-content" style="margin-top:-60px;width:600px;">
                  <div class="cropper">
                    <vueCropper
                      ref="cropper"
                      :img="option.img"
                      :outputSize="option.size"
                      :outputType="option.outputType"
                      :info="true"
                      :full="option.full"
                      :canMove="option.canMove"
                      :canMoveBox="option.canMoveBox"
                      :original="option.original"
                      :autoCrop="option.autoCrop"
                      :autoCropWidth="option.autoCropWidth"
                      :autoCropHeight="option.autoCropHeight"
                      :fixed="option.fixed"
                      :withCredentials="option.withCredentials"
                      :fixedNumber="option.fixedNumber"
                      @realTime="realTime"
                      @imgLoad="imgLoad"
                    ></vueCropper>
                  </div>
                  <div style="margin-left:20px;">
                    <div class="show-preview" :style="{'width': '150px', 'height':'155px',  'overflow': 'hidden', 'margin': '5px'}">
                      <div :style="previews.div" class="preview">
                        <img :src="previews.url" :style="previews.img">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="详情" prop="detail">
          <AddOrUpdate v-on:childByValue="childByValue"></AddOrUpdate>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer" style="width:85%;margin: 30px auto 0;display:block;text-align: center">
        <el-button @click="closeHandle()" style="height:30px;line-height: 3px;">返回</el-button>
        <el-button type="primary" @click="Submit()" native-type="button" style="height:30px;line-height: 3px;">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import AddOrUpdate from './ueditor.vue'
  import {treeDataTranslate} from '@/utils'
  import { VueCropper }  from 'vue-cropper'
  export default {
    data() {
      return {
        headImg:'',
        //剪切图片上传
        crap: false,
        previews: {},
        option: {
          img: '',
          outputSize:1, //剪切后的图片质量（0.1-1）
          full: true,//输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 160,
          autoCropHeight: 90,
          fixedNumber: [16, 9],
          fixed: true,
          withCredentials: true
        },
        fileName:'',  //本机文件地址
//        downImg: '#',
        imgFile:'',
        uploadImgRelaPath:'', //上传后的图片的地址（不带服务器域名）
        imageUrl: '',
        url: '',
        rank: 1,
        value: '',
        coverImg:'',
        visible: false,
        dataForm: {
          id: 0,
          remark: '',
          title: '',
          checked: [0,1],
          tag:[]
        },
        dataRule: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          userid: [
            {required: true, message: '用户ID不能为空', trigger: 'blur'}
          ]
        },
        downImg:'',
        video:'',
        classifyList:'',
        marterList:'',
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        content:''
      }
    },
    components: {
      VueCropper,
      AddOrUpdate
    },
    inject:['reload'],
    methods: {
      init() {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dynamicTags = []
          this.downImg = ''
          this.dataForm.userid = ''
          this.content = ''
        })
      },
      closeHandle(done){
        this.visible = false
        this.reload()
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
//          this.optionImg.img = response.data
        } else {
          this.$message.error(response.msg)
        }
      },
      // 表单提交
      Submit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/add/news/editor'),
              method: 'post',
              data: this.$http.adornData({
                title:this.dataForm.title,
                tag:this.dynamicTags.toString(),
                pgcId:this.dataForm.userid,
                cover:this.downImg,
                content:this.content,
                token: this.$cookie.get('token'),
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
      },
      goBack(){
        this.$router.go(-1)
      },
      // 标签
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //放大/缩小
      changeScale(num) {
//        console.log('changeScale')
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      //上传图片（点击上传按钮）
      finish(type) {
        let vm = this;
        vm.$refs.cropper.getCropData((data) => {
          // 输出 预览
          vm.$refs.cropper.getCropBlob((data) => {
            let img = window.URL.createObjectURL(data)
            let formData = new FormData();
            formData.append("file", data, this.fileName);
            vm.$http.post(this.$http.adornUrl(`/controll/uploadpic?token=${this.$cookie.get('token')}`), formData, {
              contentType: false,
              processData: false,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
              .then((response) => {
//                vm.previews = response.data.data;
//                console.log(vm.previews)
              })
          })
        })

      },
      // 实时预览函数
      realTime(data) {
//        console.log('realTime')
        this.previews = data
      },
      //选择本地图片
      uploadImg(e, num) {
//        console.log('uploadImg');
        var _this = this;
        //上传图片
        var file = e.target.files[0]
        _this.fileName = file.name;
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader();
        reader.onload =(e) => {
          let data;
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          }
          else {
            data = e.target.result
          }
          if (num === 1) {
            _this.option.img = data
          } else if (num === 2) {
            _this.option.img = data
          }
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file);
      },
      imgLoad (msg) {},
      // 正文子组件传值
      childByValue: function (childValue) {
        // childValue就是子组件传过来的值
        this.content = childValue
      }
    }
  }
</script>

<style lang="scss" type="stylesheet/scss" scoped>
  .info {
    width: 720px;
    margin: 0 auto;
  .oper-dv {
    height:20px;
    text-align:right;
    margin-right:100px;
  a {
    font-weight: 500;
  &:last-child {
     margin-left: 30px;
   }
  }
  }
  .info-item {
    margin-top: 15px;
  label {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  .sel-img-dv {
    position: relative;
  .sel-file {
    position: absolute;
    width: 90px;
    height: 30px;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }
  .sel-btn {
    position: absolute;
    cursor: pointer;
    z-index: 1;
  }
  }
  }
  }

  .cropper-content{
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
  .cropper{
    width: 260px;
    height: 160px;
  }
  .show-preview{
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  .preview{
    overflow: hidden;
    /*border-radius: 50%;*/
    border:1px solid #cccccc;
    background: #cccccc;
    margin-left: 40px;
  }
  }
  }
  .cropper-content .show-preview .preview {margin-left: 0;}
  .el-dialog{
    width:85%;
  }
  .formWidth{
    width:90%
  }
  .btncutImg{
    float: right;
    margin: 50px 265px 0 0;
  }

  /*video{*/
    /*width:400px;*/
    /*height:225px;*/
    /*position: fixed;*/
    /*right:20%;*/
    /*!*top:0;*!*/
  /*}*/
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .btn-orange{
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    margin-right:20px;
  }
  .btn-orange:hover{
    color:#409EFF;
    border: 1px solid #409EFF;
  }
  .btn-blue{
    cursor: pointer;
  }
  .btn-blue:hover{
    color:#409EFF;
  }

</style>
