var app = new Vue({
  el: "#visit",
  data: function () {
    return {};
  },
  created: function () {},
  mounted: function () {
    this.doLoading(true);
    this.getWXAppId();
  },
  methods: {
    getWXAppId() {
      var ua = navigator.userAgent.toLowerCase();
      var isWX = ua.indexOf("micromessenger") != -1;
      var openId = getURLParam(OPENID_KEY);
      // if (!isWX || !openId) {
      if (!openId) {
        this.$toast("请通过微信公众账号进入预约界面");
      }else {
        setFgCookie(OPENID_KEY, openId);
        _reqGetToken(function (err, data) {
            this.doLoading(false);
            if (err) return;
            if (data.code == 102) {
                this.bindPhoneShow = true;
            } else if (data.code == 200) {
                setFgCookie(TOKEN_KEY, data.data.token);
                this.userInfo = data.data.userdata;
            } else {
                this.$toast(data.message);
            }
        }.bind(this), {
            type: 1,
            code: openId
        });
      }
    },
    doLoading(flag) {
        doFgLoading(this, flag);
    },
  },
});
/***************************    整体组件信息结束    ****************************************/
