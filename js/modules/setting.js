// _checkCookie(2);
/***************************    整体组件信息开始    ****************************************/
var app = new Vue({
    el: '#fg-app',
    components: {},
    data: {
        data: null,
        userInfo: null
    },
    watch: {},
    created: function () {
        this.getWXAppId()
         // this.getUserInfo();
    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
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
        // getUserInfo: function () {
        //     this.doLoading(true);
        //     // this.userInfo = {phone: "13816459295"};
        //     _reqGetUserInfo(function (err, resp) {
        //         this.doLoading(false);
        //         if (err) return;
        //         if (resp.code == 200) {
        //             this.userInfo = resp.data;
        //         } else {
        //             this.$toast(resp.message);
        //         }
        //     }.bind(this));
        // },
        doLoading(flag) {
            doFgLoading(this, flag);
        },
        doClickHref(href) {
            window.location.href = href;
        }
    }
});
/***************************    整体组件信息结束    ****************************************/
