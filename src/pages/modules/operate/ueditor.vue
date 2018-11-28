<template>
  <div>

    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle">
    </el-upload>

    <!--富文本编辑器组件-->
    <el-row>
      <quill-editor
        :content="content"
        v-model="detailContent"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
      >
      </quill-editor>
    </el-row>
  </div>
</template>

<script>

  // 工具栏配置
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ]

  export default {
      data () {
        return {
          imageUrl: '',
          url: '',
          detailContent: '', // 富文本内容
          editorOption: {
            placeholder: '',
            theme: 'snow',  // or 'bubble'
            modules: {
              toolbar: {
                container: toolbarOptions,  // 工具栏
                handlers: {
                  'image': function (value) {
                    if (value) {
                      document.querySelector('.avatar-uploader input').click()
                    } else {
                      this.quill.format('image', false);
                    }
                  }
                }
              }
            }
          }
        }
      },
      props:['content'],
      mounted(){
        this.url = this.$http.adornUrl(`/controll/uploadpic?token=${this.$cookie.get('token')}`)
      },
      methods: {
        onEditorBlur(){//失去焦点事件
        },
        onEditorFocus(){//获得焦点事件
        },
        onEditorChange(e){//内容改变事件
          this.$emit('childByValue', e.html)
          console.log(e.html)
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
          // res为图片服务器返回的数据
          // 获取富文本组件实例
          let quill = this.$refs.myQuillEditor.quill
          if (response.resultCode == 0) {
            // 获取光标所在位置
            let length = quill.getSelection().index;
            // 插入图片  res.info为服务器返回的图片地址
            quill.insertEmbed(length, 'image', response.data)
            // 调整光标到最后
            quill.setSelection(length + 1)
          } else {
            this.$message.error(response.msg)
          }
        }
      }
    }
    </script>

    <style lang="scss">

    </style>
