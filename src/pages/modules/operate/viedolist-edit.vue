<template>
  <el-dialog
    :title="!dataForm.id ? '视频编辑' : '视频编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" class="viedoDialog">
      <video ref="video" controls preload="auto"></video>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
               label-width="80px" class="formWidth">
        <el-form-item label="视频ID" prop="remark">
          <el-input v-model="dataForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
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
        <el-form-item label="用户ID" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="输入用户ID" style="width:30%;"></el-input>
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
              <el-checkbox style="margin-left:0;line-height: 30px;" v-for="item in checkList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="封面" prop="coverImg">
          <div style="display:flex;">
            <div class="info-item" style="flex:1;"></div>
            <div class="info-item" style="flex:1;margin-left:-300px;margin-top:30px;">
              <label class="btn btn-orange" for="uploads" style="display:inline-block;width: 70px;padding: 0;text-align: center;margin-left:-120px;line-height: 28px;">选择图片</label>
              <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
              <input type="button" class="btn btn-blue" value="确定" @click="finish('blob')">
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
      </el-form>
      <span slot="footer" class="dialog-footer" style="width:85%;margin: 30px auto 0;display:block;text-align: center">
        <el-button @click="visible = false" style="height:30px;line-height: 3px;">返回</el-button>
        <el-button type="primary" @click="Submit()" native-type="button" style="height:30px;line-height: 3px;">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
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
          img: 'https://timgmb05.bdimg.com/timg?searchbox_feed&quality=80&wh_rate=0&size=f660_370&ref=http%3A%2F%2Fwww.baidu.com&sec=1541581009&di=65c57f8da3837f27748d236820a02468&src=http%3A%2F%2Fpic.rmb.bdstatic.com%2F8f838900e1b7b3c83f0b71ad0fdc7f51.jpg',
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
        visible: false,
        dataForm: {
          id: 0,
          remark: '',
          title: '',
          userName: '',
          checked: [0,1],
          tag:[]
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
        marterList:'',
        dynamicTags: [],
        inputVisible: false,
        inputValue: ''
      }
    },
    components: {
      VueCropper,
    },
    methods: {
      init(id,channel) {
        this.url = this.$http.adornUrl(`/controll/uploadpic?token=${this.$cookie.get('token')}`)
        this.dataForm.id = id
        this.visible = true
//        this.$nextTick(() => {
//          this.$refs['dataForm'].resetFields()
//        })
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
//              newstype:channel,
              token: this.$cookie.get('token')
            })
          }).then(({data}) => {
            if (data.resultCode == 0) {
              this.dataForm.id = data.data.id
              this.dataForm.title = data.data.title
              // 数组去重
              var str = data.data.tags.filter(function(element,index,self){
                return self.indexOf(element) === index;
              });

              this.dynamicTags = str
              if(str[0] == ''){
                this.dynamicTags = []
              }
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
//              var string = String(data.data.cover)
//              var str = string.split('@')[0]
              this.option.img = data.data.cover
              this.downImg = data.data.cover
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
      Submit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/upmcnnews'),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id,
                title:this.dataForm.title,
                tag:this.dynamicTags.toString(),
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
      imgLoad (msg) {
//        console.log('imgLoad')
        console.log(msg)
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
    height: 260px;
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
    width:55%
  }
  .btncutImg{
    float: right;
    margin: 50px 265px 0 0;
  }

  video{
    width:400px;
    height:225px;
    position: fixed;
    right:20%;
    /*top:0;*/
  }
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
