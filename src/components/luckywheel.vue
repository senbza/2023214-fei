<template>

  <div class="container">
    <div class="lucky-wheel">
      <div class="lucky-title"></div>
      <div class="state" @click="showPopup">
        <span>奖品说明</span>
      </div>
      <div class="state1" @click="getToMyPrize">
        <span>我的奖品</span>
      </div>
      <div class="wheel-main">
        <div class="wheel-pointer" @click="beginRotate()"></div>
        <div class="wheel-bg" :style="rotateStyle">
          <div class="prize-list">
            <div class="prize-item" v-for="(item, index) in prizeList" :key="index" :style="item.style">
              <div class="prize-pic">
                <img :src="item.icon" />
              </div>
              <div class="prize-type">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main-bg"></div>
      <div class="bg-p"></div>
      <div class="content" v-if="!realNumber">
        <van-cell-group inset>
          <van-field v-model="num" label="抽奖号码" placeholder="" />
        </van-cell-group>
        <van-button class="btn" type="primary" @click="submit" block>提交号码</van-button>
        <van-button class="btn" type="primary" @click="getChance" block>获取抽奖机会</van-button>
      </div>
      <div v-else>
        <p class="drawClass">您输入的抽奖号码为{{ this.realNumber }}</p>
        <van-button class="btn" type="primary" @click="again" block>再次抽奖</van-button>
      </div>
      <div class="tip">
        <div class="tip-title">活动规则</div>
        <div class="tip-content">
          <p>1.情人节专属抽奖。10元一次绝无空奖。</p>
          <p>2.累计抽20次以后送5次抽奖机会。</p>
          <p>3.所有抽奖奖品均可在的【我的奖品】中查询。</p>
        </div>
      </div>
    </div>
    <div class="toast" v-show="prize">
      <div class="toast-container">
        <img :src="toastIcon" class="toast-picture" />
        <div class="close" @click="closeToast()"></div>
        <div class="toast-title">{{ toastTitle }}</div>
        <div class="toast-btn">
          <div class="toast-cancel" @click="closeToast">关闭</div>
        </div>
      </div>
    </div>
    <div class="toast-mask" v-show="prize"></div>
    <van-popup v-model="show" style="width:80%;padding: 10px;">
      <div class="prize">
        <span>奖品1</span>
        <p>微信红包6.6元</p>
      </div>
      <div class="prize">
        <span>奖品2</span>
        <p>微信红包8.8元</p>
      </div>
      <div class="prize">
        <span>奖品3</span>
        <p>微信红包131.4元</p>
      </div>
      <div class="prize">
        <span>奖品4</span>
        <p>微信红包20元</p>
      </div>
      <div class="prize">
        <span>奖品5</span>
        <p>辣条一包</p>
      </div>
      <div class="prize">
        <span>奖品6</span>
        <p>价值1000元淘宝购物卷</p>
      </div>
      <div class="prize">
        <span>奖品7</span>
        <p>情人节豪华套餐</p>
      </div>
      <div class="prize">
        <span>奖品8</span>
        <p>价值1500元淘宝购物卷一个</p>
      </div>
    </van-popup>
    <van-popup v-model="showChance" style="width:80%;padding: 10px;">
      <div>
        <p>微信转账10元获得一次抽奖机会，绝无空奖</p>
        <img src="../assets/img/871676190425_.pic.jpg" class="img" alt="" srcset="">
      </div>
    </van-popup>
    <van-popup v-model="myPrize" style="width:80%;padding: 10px;">
      <div v-for="(item, index) in myPrizeList" :key="index">
        <van-cell-group>
          <van-cell :title="item.name" :value="item.description" />
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { prizeList } from './config'
const CIRCLE_ANGLE = 360

const config = {
  // 总旋转时间
  duration: 4000,
  // 旋转圈数
  circle: 8,
  mode: 'ease-in-out'
}

export default {
  data() {
    return {
      count: 10, // 剩余抽奖次数
      duration: 3000, // 转盘旋转时间
      prizeList: [], // 奖品列表
      rotateAngle: 0, // 旋转角度
      index: 0,
      prize: null,
      status: [],
      num: '',
      realNumber: '',
      show: false,
      showChance: false,
      myPrize: false,
      myPrizeList: []
    };
  },
  created() {
    this.status = ['09910', '08761', '07364', '07360', '87784', '93930', '787631', '8938381', '83830', '11220', '88991', '77331', '88333', '87877341', '8484840', 'aaaad1', 'bbbbbc0', '77kfk0', '77471', '84884841', '9999990', '888883', '819191813', '9999900003', '888776663']
    this.myPrizeList = JSON.parse(localStorage.getItem('table')) || []
    const haveSmoked = JSON.parse(localStorage.getItem('hand')) || []
    let commonValues = this.status.filter(value => !haveSmoked.includes(value));
    localStorage.setItem('status', JSON.stringify(commonValues));

    // 初始化一些值
    this.angleList = []
    // 是否正在旋转
    this.isRotating = false
    // 基本配置
    this.config = config

    // 获取奖品列表
    this.initPrizeList();
  },
  computed: {
    rotateStyle() {
      return `
        -webkit-transition: transform ${this.config.duration}ms ${this.config.mode};
        transition: transform ${this.config.duration}ms ${this.config.mode};
        -webkit-transform: rotate(${this.rotateAngle}deg);
            transform: rotate(${this.rotateAngle}deg);`
    },
    toastTitle() {
      return this.prize && this.prize.isPrize === 1
        ? "恭喜您，获得" +
        this.prize.name
        : "未中奖";
    },
    toastIcon() {
      return this.prize && this.prize.isPrize === 1
        ? require("../assets/img/congratulation.png")
        : require("../assets/img/sorry.png");
    }
  },
  methods: {
    initPrizeList() {
      // 这里可以发起请求，从服务端获取奖品列表
      // 这里使用模拟数据

      this.prizeList = this.formatPrizeList(prizeList)
    },
    getToMyPrize() {
      this.myPrize = true
    },
    showPopup() {
      this.show = true;
    },
    // 格式化奖品列表，计算每个奖品的位置
    formatPrizeList(list) {
      // 记录每个奖的位置
      const angleList = []

      const l = list.length
      // 计算单个奖项所占的角度
      const average = CIRCLE_ANGLE / l

      const half = average / 2

      // 循环计算给每个奖项添加style属性
      list.forEach((item, i) => {

        // 每个奖项旋转的位置为 当前 i * 平均值 + 平均值 / 2
        const angle = -((i * average) + half)
        // 增加 style
        item.style = `-webkit-transform: rotate(${angle}deg);
                      transform: rotate(${angle}deg);`

        // 记录每个奖项的角度范围
        angleList.push((i * average) + half)
      })

      this.angleList = angleList

      return list
    },
    submit() {
      if (localStorage.getItem('status').includes(this.num)) {
        this.realNumber = this.num
      } else {
        this.$toast('请输入正确的抽奖号码')
        return
      }
    },
    again() {
      this.realNumber = '',
        this.num = ''
    },
    beginRotate() {
      // 添加次数校验

      if (!this.realNumber) {
        this.$toast('请先输入抽奖码，并且提交抽奖码才可抽奖哦')
        return
      }
      const status = JSON.parse(localStorage.getItem('status')) || []
      const indexFind = status.find((item, index) => {
        return this.realNumber == item
      })

      if (!indexFind) {
        this.$toast('抽奖号码已被使用请重新购买')
      } else {
        console.log(indexFind);
        const random = indexFind.charAt(indexFind.length - 1);
        console.log(random);
        // 随机获取下标
        this.index = Number(random)
        // 开始旋转
        this.rotating()
      }
    },
    random(max, min = 0) {
      return parseInt(Math.random() * (max - min + 1) + min)
    },
    rotating() {
      const { isRotating, angleList, config, rotateAngle, index } = this

      if (isRotating) return

      this.isRotating = true

      // 计算角度
      const angle =
        // 初始角度
        rotateAngle +
        // 多旋转的圈数
        config.circle * CIRCLE_ANGLE +
        // 奖项的角度
        angleList[index] -
        (rotateAngle % CIRCLE_ANGLE)


      this.rotateAngle = angle

      // 旋转结束后，允许再次触发
      setTimeout(() => {

        this.rotateOver()
        const status = JSON.parse(localStorage.getItem('status'))
        const newStatus = status.filter((item) => { return item !== this.num })
        localStorage.setItem('status', JSON.stringify(newStatus))
        const haveSmoked = JSON.parse(localStorage.getItem('hand')) || [];
        haveSmoked.push(this.realNumber)
        localStorage.setItem('hand', JSON.stringify(haveSmoked))
      }, config.duration + 1000)
    },
    rotateOver() {
      this.isRotating = false

      this.prize = prizeList[this.index]
      this.myPrizeList = JSON.parse(localStorage.getItem('table')) || []
      this.myPrizeList.push(this.prize)
      localStorage.setItem('table', JSON.stringify(this.myPrizeList))
    },
    //关闭弹窗
    closeToast() {
      this.prize = null;
    },
    getChance() {
      this.showChance = true
    }
  }
};
</script>
<style scoped>
.container {
  width: 100%;
}

.lucky-wheel {
  width: 100%;
  background: rgb(252, 207, 133) url("../assets/img/color_pillar.png") no-repeat center bottom;
  background-size: 100%;
  padding-top: 20px;
}

.drawClass {
  text-align: center;
  color: #fff;
}

.lucky-title {
  width: 100%;
  height: 8.125rem;
  background: url("../assets/img/lucky_title.png") no-repeat center top;
  background-size: 100%;
}

.wheel-main {
  margin: 0 auto;
  position: relative;
  width: 295px;
  height: 295px;
}

.btn {
  width: 343px;
  height: 44px;
  margin: 0 auto;
  margin-top: 10px;
  background-color: #fbc27f;
  border: none;
  border-radius: 8px;
}

.state {
  float: right;
  margin-right: .4rem;
  color: #fc7939;
  margin-bottom: 1rem;
  position: relative;
  z-index: 100
}

.state1 {
  float: left;
  margin-left: .4rem;
  color: #fc7939;
  position: relative;
  z-index: 100
}

.wheel-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: url("../assets/img/draw_wheel.png") no-repeat center top;
  background-size: 100%;
  color: #fff;
}

.wheel-pointer {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: 85px;
  height: 85px;
  background: url("../assets/img/draw_btn.png") no-repeat center top;
  background-size: 100%;
  transform: translate3d(-50%, -50%, 0);
}

.wheel-bg div {
  text-align: center;
}

.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
}

.prize-list .prize-item {
  position: absolute;
  width: 95px;
  height: 150px;
  top: 0;
  left: 50%;
  margin-left: -47.5px;
  transform-origin: 50% 100%;
}

.prize-pic img {
  width: 4.0625rem;
  height: 2.5rem;
  margin-top: 1.5625rem;
}

.prize-count {
  font-size: 0.875rem;
}

.prize-type {
  font-size: 0.75rem;
}

.main {
  position: relative;
  width: 100%;
  min-height: 14.25rem;
  background: rgb(243, 109, 86);
  padding-bottom: 1.6875rem;
}

.main-bg {
  width: 100%;
  height: 6.5625rem;
  position: absolute;
  top: -3.4375rem;
  left: 0;
  background: url("../assets/img/luck_bg.png") no-repeat center top;
  background-size: 100%;
}

.bg-p {
  width: 100%;
  height: 2.95rem;
  background: rgb(252, 207, 133);
}

.content {
  position: absolute;
  top: 0.175rem;
  left: 0;
  background: rgb(243, 109, 86);
  width: 100%;
  height: 100%;
  font-size: 1.125rem;
  color: #ffeb39;
}

.content div {
  text-align: left;
}

.tip {
  position: relative;
  margin: 9.5rem auto 0;
  width: 17.5rem;
  border: 1px solid #fbc27f;
}

.tip-title {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 1rem;
  color: #fccc6e;
  background: rgb(243, 109, 86);
  padding: 0.3125rem 0.625rem;
}

.prize {
  margin-top: .4rem;
}

.prize p {
  font-size: 18px;
  color: #fc7939;
}

.tip-content {
  padding: 1.5625rem 0.625rem;
  font-size: 0.875rem;
  color: #fff8c5;
  line-height: 1.5;
}

.toast-mask {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  width: 100%;
  height: 100%;
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 20000;
  transform: translate(-50%, -50%);
  width: 15.4375rem;
  background: #fff;
  border-radius: 0.3125rem;
  padding: 0.3125rem;
  background-color: rgb(252, 244, 224);
}

.toast-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px dotted #fccc6e;
}

.toast-picture {
  position: absolute;
  top: -6.5rem;
  left: -1.5rem;
  width: 18.75rem;
  height: 8.5625rem;
}

.toast-pictrue-change {
  position: absolute;
  top: -1.5rem;
  left: -1.375rem;
  width: 17.5rem;
  height: 3.125rem;
}

.toast-title {
  padding: 2.8125rem 0;
  font-size: 18px;
  color: #fc7939;
  text-align: center;
}

.toast-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.9375rem;
}

.toast-btn div {
  background-image: -moz-linear-gradient(-18deg,
      rgb(242, 148, 85) 0%,
      rgb(252, 124, 88) 51%,
      rgb(252, 124, 88) 99%);

  background-image: -ms-linear-gradient(-18deg,
      rgb(242, 148, 85) 0%,
      rgb(252, 124, 88) 51%,
      rgb(252, 124, 88) 99%);
  background-image: -webkit-linear-gradient(-18deg,
      rgb(242, 148, 85) 0%,
      rgb(252, 124, 88) 51%,
      rgb(252, 124, 88) 99%);
  box-shadow: 0px 4px 0px 0px rgba(174, 34, 5, 0.7);
  width: 4.6875rem;
  height: 1.875rem;
  border-radius: 1.875rem;
  text-align: center;
  line-height: 1.875rem;
  color: #fff;
}

.close {
  position: absolute;
  top: -0.9375rem;
  right: -0.9375rem;
  width: 2rem;
  height: 2rem;
  background: url("../assets/img/close_store.png") no-repeat center top;
  background-size: 100%;
}

.img {
  width: 100%;
  height: 100%;
}
</style>

