<template>
  <div class="home">
    <nav>
      <ul>
        <li class="fl"
            v-for="(item,index) in nameList"
            @click="getCurrent(index,item.name)"
            v-bind:class="{active:index === current}"
            :key="item.name">{{ item.title }}</li>
      </ul>
    </nav>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <ul>
        <li v-for="(item,index) in getLists" class="homeLists" @click="getUrl(item.click_url)">
          <h2>{{ item.title }}</h2>
          <div class="imgs">
            <div class="moreImg"
                 v-if="item.image_type === 2"
                 v-for="(srcs,index) in item.image_list">
              <img :src="srcs.url" alt="">
            </div>
            <div v-if="item.image_type === 0"
                 v-for="(srcs,index) in item.image_list">
                 <img :src="srcs.url" alt="">
            </div>
            <div v-if="item.image_type === 1"
                 v-for="(srcs,index) in item.image_list">
              <img :src="srcs.url" alt="">
            </div>
            <div v-if="item.image_type === 3"
                 v-for="(srcs,index) in item.image_list">
              <img :src="srcs.url" alt="">
            </div>
          </div>
          <div class="info" v-if="item.is_ad === 1">
            <span class="active">广告</span>
            <span>{{ item.content_src }}</span>
          </div>
           <div class="info" v-else>
             <span>{{ item.content_src }}</span>
           </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import px2rem from "../util/px2rem";
  import CryptoJS from 'crypto-js';
  import Qs from 'qs'
  export default {
  name: 'HelloWorld',
  data () {
    return {
      name:'',
      current:0,
      nameList:[
        {title: '推荐',name:'__all__'},
        {title: '热点',name:'news_hot'},
        {title: '本地',name:'news_local'},
        {title: '社会',name:'news_society'},
        {title: '娱乐',name:'news_entertainment'},
        {title: '科技',name:'news_tech'},
        {title: '汽车',name:'news_car'},
        {title: '财经',name:'news_finance'},
        {title: '军事',name:'news_military'},
        {title: '体育',name:'news_sports'},
        {title: '宠物',name:'news_pet'},
        {title: '人文',name:'news_culture'},
        {title: '国际',name:'news_world'},
        {title: '时尚',name:'news_fashion'},
        {title: '游戏',name:'news_game'},
        {title: '旅游',name:'news_travel'},
        {title: '历史',name:'news_history'},
        {title: '探索',name:'news_discovery'}
      ],
      msg: 'Welcome to Your Vue.js App',
      getLists:{},
      dataParams:{},
      busy: false ,//是否正在加载过程中
      category: '__all__'
    }
  },
  created() {
    px2rem();
    this.getParams();
    this.getList();
  },
  methods: {
    getCurrent(index,category){
      this.current = index;
      this.category = category;
      this.getParams(category);
      this.getList();
    },
    getParams(category) {
      var $self = this;
      var channel = 45,   //开发者ID
        token = '21eca450aed98b5ba97ed856ba549fb6',	//授权对应的token值，用于进行权限验证，请联系工作人员获取。
        adSlotId = '', //广告位ID
        adnum = 50, // 请求条数，默认为1
        q, //JSON信息加密串
        k = 117, //应用ID
        eventime = Date.parse(new Date()),//13位时间戳,请求时间
        client_ip = '220.122.178.5', //终端用户IP地址，必须是外网IP   待定
        mac = '',//客户端的mac，安卓必传
        v = '1.0',//API版本号（1.0）
        imei = '', //安卓必传
        androidid = '', //安卓的AndroidID，安卓必传
        idfa = '', //ios必传
        openudid = '', //ios必传
        ua = 'TW96aWxsYS81LjAgKExpbnV4OyBVOyBBbmRyb2lkIDQuMzsgZW4tdXM7IFNNLU45MDBUIEJ1aWxkL0pTUzE1SikgQXBwbGVXZWJLaXQvNTM0LjMwIChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi80LjAgTW9iaWxlIFNhZmFyaS81MzQuMzA=',  //浏览器UserAgent的base64编码
        jsonStr = '',
        pvString = '',
        clickString = '',
        iphonename = '';
      var devicetype, brand, telModel, os_version, device_size, operator, network;
      try {
        devicetype = window.locJs.getDeviceType();
        brand = window.locJs.getBrand();
        telModel = window.locJs.getTelModel();
        os_version = window.locJs.getOSVersion();
        device_size = window.locJs.getDeviceSize();
        operator = window.locJs.getOperator();
        network = window.locJs.getNetwork();
        telModel = telModel.replace(/\s+/g, "");
      } catch (err) {
        //console.log(err);
      }
      if (devicetype == '' || devicetype == undefined) {
        devicetype = 1; //设备类型 0.未知    1.手机   2:平板电脑
      }
      if (brand == '' || brand == undefined) {
        brand = 'SAMSUNG';  //手机品牌
      }
      if (telModel == '' || telModel == undefined) {
        telModel = 'SM-N900T'; //设备型号，小写，去掉空格
      }
      if (os_version == '' || os_version == undefined) {
        os_version = '4.3'; //操作系统版本号
      }
      if (device_size == '' || device_size == undefined) {
        device_size = '1920*1080'; //屏幕分辨率
      }
      if (operator == '' || operator == undefined) {
        operator = 1; //运营商类型  可能取值：0.未知1.移动2.联通3.电信
      }
      if (network == '' || network == undefined) {
        network = 1; //网络类型 可能取值：0.未知1.wifi 2.2G3.3G 4.4G
      }
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        k = 117;
        adSlotId = 842;
        try {
          imei = window.locJs.getImei();
          androidid = window.locJs.getAndroidID();
          mac = window.locJs.getMac();
        } catch (err) {
          //console.log(err);
        }
        if (imei == '' || imei == undefined) {
          imei = '864022031069759';
        }
        if (androidid == '' || androidid == undefined) {
          androidid = '10fd56ba5616fa26';
        }
        if (mac == '' || mac == undefined) {
          mac = '9c:fb:d5:c9:50:cb';
        }
      } else if (isiOS) {
        iphonename = telModel.indexOf("iPhone");
        telModel = telModel.substring(iphonename, telModel.length);//取后部分
        // console.log(telModel)
        k = 118;
        adSlotId = 841;
        try {
          idfa = window.locJs.getIDFA();
          openudid = window.locJs.getDevicceId();
        } catch (err) {
          //console.log(err);
        }
        if (idfa == '' || idfa == undefined) {
          idfa = '729B500E-6ABA-4277-93F9-C425F5C21C7E';
        }
        if (openudid == '' || openudid == undefined) {
          openudid = 'df6409e0b5e4840624dec94b787442ff13b59b29'
        }

      }
      jsonStr = '{"channel": ' + channel + ',"token": "' + token + '","imp": {"adSlotId":' + adSlotId + ',"category": "' + $self.category + '","adnum":' + adnum + ',"eventime":' + eventime + ',"ext": null},"device": {"ua":"' + ua + '","client_ip":"' + client_ip + '","devicetype":' + devicetype + ',"brand":"' + brand + '","telModel":"' + telModel + '","os_version":"' + os_version + '","device_size":"' + device_size + '","androidid":"' + androidid + '","imei":"' + imei + '","openudid":"' + openudid + '","idfa":"' + idfa + '","mac":"' + mac + '","operator":' + operator + ',"network":' + network + ',"ext": null},"ext": ""}';
      jsonStr = $self.encryptByDES(jsonStr, token);
      $self.dataParams = Qs.stringify({
        q: jsonStr,
        k: k,
        v: v
      });
    },
    getList(flag) {
      let vm = this;
      this.$http.post('/getContent', vm.dataParams)
        .then((response) => {
          let resData = response.data.data
          console.log(response.data.data);
          if (response.data.status == 'ok') {
            if(flag){  //如果flag为true则表示分页
              vm.getLists =vm.getLists.concat(resData.adList)  //concat数组串联进行合并
              if(resData.adSize === 0 || resData.adSlotId === 0){  //如果数据加载完 那么禁用滚动时间 this.busy设置为true
                console.log(123,vm.getLists)

                vm.busy = true;
              }else{
                vm.busy = false;
              }
            }else{
              //第一次进入页面 完全不需要数据拼接的
              vm.getLists = resData.adList;
              vm.busy = false;
            }

          }else{
            vm.getLists = []
          }
        })
    },
    //当属性滚动的时候  加载  滚动加载
    loadMore(){
      this.busy=true  //将无限滚动给禁用
      setTimeout(() => {  //发送请求有时间间隔第一个滚动时间结束后才发送第二个请求
        // this.page++;  //滚动之后加载第二页
        this.getList(true);
      }, 500);
    },
    encryptByDES(message, key) {
      var keyHex = CryptoJS.enc.Utf8.parse(key);
      var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.ciphertext.toString();
    },
    getUrl(e) {
      window.location.href = e;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="stylesheet/scss" scoped>
.home{
  font-size:0.24rem;
  padding: 0 0.3rem;
  nav{
    width:100%;
    height:0.7rem;
    overflow-x: auto;
    ul{
      width:200%;
    }
    .active{
      color: #ef4d40;
      border-bottom: 0.04rem solid #ef4d40;
    }
    li{
      height:0.64rem;
      display:inline-block;
      font-size:0.28rem;
      margin-right:0.4rem;
    }
  }
  .homeLists{
    border-bottom:1px solid #dcdcdc;
    h2{
      font-size: 0.34rem;
      margin:0.1rem auto;
    }
    img{
      width:100%;
    }
    .imgs{
      display:-webkit-box;
      .moreImg{
        margin-left:0.1rem;
        -moz-box-flex: 1;
        -webkit-box-flex: 1;
      }
    }
    .info{
      margin:0.15rem auto;
      .active{
        padding:0 0.15rem;
        -webkit-border-radius: 1rem;
        -moz-border-radius: 1rem;
        border-radius: 1rem;
        border: 1px solid #4cbaff;
        color: #4cbaff;
      }
    }
  }
  .homeLists:last-child{
    border:none;
  }
}
</style>
