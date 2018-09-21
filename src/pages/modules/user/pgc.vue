<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addHander()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="用户ID">
        <el-input v-model="dataForm.id" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="dataForm.nickname" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName2" type="card" class="tabs-icon" @tab-click="handleClick">
      <el-tab-pane label="PGC用户" name="first">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            label="用户头像"
            header-align="center"
            align="center"
            width="80">
            <template slot-scope="scope">
              <img :src="scope.row.headUrl" width="40" height="40" class="head_pic"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            width="100"
            label="用户ID">
          </el-table-column>
          <el-table-column
            prop="nickname"
            header-align="center"
            align="center"
            width="150"
            label="用户昵称">
          </el-table-column>
          <el-table-column
            prop="sex"
            header-align="center"
            align="center"
            width="60"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            width="60"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="100"
            label="一级分类">
          </el-table-column>
          <el-table-column
            prop="rank"
            header-align="center"
            align="center"
            width="160"
            label="分级">
          </el-table-column>
          <el-table-column
            prop="url"
            header-align="center"
            align="center"
            width="200"
            label="爬虫链接">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="100"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="edit(scope.row.id)">编辑</el-button>
              <el-button type="text" class="btns" size="small" @click="stateHandle(scope.row.id,scope.row.status)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <add-update v-if="addVisible" ref="add" @refreshDataList="getDataList"></add-update>
    <edit-update v-if="editVisible" ref="edit" @refreshDataList="getDataList"></edit-update>
  </div>
</template>

<script>
  import AddUpdate from './pgc-add'
  import editUpdate from './pgc-edit'

  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        editVisible:false,
        addVisible: false,
        dataListSelections: [],
        activeName2: 'first',
        typeName: 0
      }
    },
    components: {
      AddUpdate,
      editUpdate
    },
    created(){
//      console.log(333,this.cookie.get('token'))
    },
    activated () {
      this.getDataList()
    },
    methods: {
      formatSex: function (row, column, cellValue) {
        if (cellValue == "1"){
          return '下线';
        }else if (cellValue == "0"){
          return '正常';
        }
      },
      handleClick(tab, event) {
        if(tab.name == 'first'){
          this.typeName = 0;
        }else if(tab.name == 'second'){
          this.typeName = 1
        }
        this.getDataList ()
      },
      // 新增
      addHander () {
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs.add.init()
        })
      },
      // 编辑
      edit (id) {
        this.editVisible = true
        this.$nextTick(() => {
          this.$refs.edit.init(id)
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/mcn/getpgclist'),
              method: 'get',
              params: this.$http.adornParams({
                'nickname': this.dataForm.nickname,
                'id': this.dataForm.id,
                'page': this.pageIndex - 1,
                'token': this.$cookie.get('token')
              })
            }).then(({data}) => {
              console.log(data)
              if (data.resultCode == 0) {
                this.dataList = data.data.list
                this.totalPage = data.data.total
              } else {
                this.dataList = []
                this.totalPage = 0
              }
              this.dataListLoading = false
            })
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="stylesheet/scss" scoped>
  .mod-role{
    .tabs-icon{
      position: static;
    }
  }
  .btns{
    margin-left:0;
  }
</style>
