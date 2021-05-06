<template>
  <view class="edit-password">
    <input type="text" value="" />
    <view class="edit-form">
      <view class="edit-input"><input placeholder-style="line-height: 89rpx;" v-model="form.oldPassword"  placeholder="请输入旧密码" type="password" /></view>
      <view class="edit-input"><input placeholder-style="line-height: 89rpx;"  v-model="form.password"  placeholder="请输入新密码" type="password" /></view>
      <view class="edit-input"><input placeholder-style="line-height: 89rpx;"  v-model="form.checkPassword"  placeholder="请确认新密码" type="password" /></view>
    </view>
    <view class="edit-btn">
      <text>密码长度至少8位，必须包含大小写字母和数字，不能含有空格</text>
      <button @tap="edit">修改密码</button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import { changePassword } from '../../api/my/index.js';
export default {
  data() {
    return {
      form: {
        oldPassword: '',
        password: '',
        checkPassword: ''
      }
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  onLoad() {},
  methods: {
    edit() {
      if (!this.form.oldPassword) {
        this.$message('旧密码不能为空','','top');
        return;
      }
      if (!this.form.password) {
        this.$message('新密码不能为空','','top');
        return;
      }
      if (!this.form.checkPassword) {
        this.$message('确认密码不能为空','','top');
        return;
      }
      if (this.form.password !== this.form.checkPassword) {
        this.$message('新密码两次输入不同','','top');
        return
      }
      let form = {...this.form, id: this.user.userId}
      this.$loading('修改中')
      changePassword(form).then(res => {
        console.log(res)
        if(res.status){
          this.$message('修改成功', 'success', '')
        } else {
          this.$message(res.message)
        }
        uni.hideLoading()
      })
    }
  }
};
</script>

<style lang="scss">
.edit-password {
   .edit-btn {
     text {
       color: #898989;
       font-size: 25rpx;
       text-align: left;
       margin-left: 30rpx;
     }
    button {
       height: 89rpx;
       background-color: #00a8ff;
       border-radius: 42rpx;
       font-size: 39rpx;
      line-height: 89rpx;
      color: #ffffff;
       margin: 30rpx;
    }
  }
   .edit-form {
     .edit-input {
       input {
         height: 89rpx;
         // line-height: 20rpx;
         border-radius: 42rpx;
         border: solid 2rpx #e5e5e5;
         padding: 10rpx;
         margin: 30rpx;
         font-size: 31rpx;
       }
     }
   }
 }
</style>
