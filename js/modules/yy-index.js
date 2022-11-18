var SMS_CODE_TIMEOUT = 60;
/***************************    选择参观日期开始    ****************************************/
Vue.component('count-down', {
    props: {
        timeout: {
            type: [Number],
            default: null
        }
    },
    model: {
        prop: 'timeout',
        event: 'change'
    },
    template: '<template>{{timeout}}</template>',
    data: function () {
        return {
            interval: null
        }
    },
    created: function () {
        if (this.timeout <= 0) return;
        this.Interval = setInterval(function () {
            if (--this.timeout <= 0) {
                this.Interval && clearInterval(this.Interval);
            }
            this.$emit('change', this.timeout);
        }.bind(this), 1000);
    },

    mounted: function () {

    },
    methods: {}
});
/***************************    选择参观日期结束    ****************************************/


/***************************    整体组件信息开始    ****************************************/
var app = new Vue({
    el: '#fg-app',
    components: {},
    data: {
        data: null,
        bindPhoneShow: false,
        bindForm: {
            phone: '',
            msgCode: '',
        },
        setupPwdShow: false,
        setupPwdForm: {
            password: ''
        },
        msgCodeDisabled: false,
        msgCodeCount: 0,
        pattern: /\d{6}/,
        userInfo: null,
        msgChecked: true,
        xzShow: false,
        wtShow: false,
        notices: ""
    },
    watch: {
        'bindForm.phone': function (val, oldVal) {
            this.msgCodeDisabled = validatePhone(val);
        }

    },
    created: function () {
        this.getNotices();
    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
        this.doLoading(true);
        this.getWXAppId();
    },
    methods: {
        // 校验函数返回 true 表示校验通过，false 表示不通过
        validator(val) {
            if (val === '' || !validatePhone(val)) {
                return false;
            }
            return true;
        },

        // 校验函数返回 true 表示校验通过，false 表示不通过
        validatorMsgCode(val) {
            if (val === '' || !/^\d{6}$/.test(val)) {
                return false;
            }
            return true;
        },
        // 校验函数返回 true 表示校验通过，false 表示不通过
        validatorMsgCode1(val) {
            if (!this.msgChecked) {
                return false;
            }
            return true;
        },

        validatorPwd(val) {
            if (/^[0-9A-Za-z]{6, 32}$/.test(val)) {
                return true;
            }
            return false;
        },
        onFailed(errorInfo) {
            console.log('failed', errorInfo);
        },
        onSubmit(values) {
            var openId = getURLParam('openId');
            this.doLoading(true);
            _reqSendBindPhone(function (err, data) {
                this.doLoading(false);
                if (err) {
                    this.$toast('绑定手机号码失败');
                    return;
                }
                if (data.code == 200 && data.data) {
                    this.bindPhoneShow = false;
                    setFgCookie(TOKEN_KEY, data.data.token);
                    this.userInfo = data.data;
                    this.getWXAppId();
                } else {
                    this.$toast(data.message);
                }
            }.bind(this), {
                SMSCode: this.bindForm.msgCode,
                mobile: this.bindForm.phone,
                wxCode: openId
            });
        },

        onSubmit1(values) {
            this.doLoading(true);
            _reqSendSetupPwd(function () {
                this.setupPwdShow = false;
                this.doLoading(false);
            }.bind(this));
        },
        getWXAppId() {
            var ua = navigator.userAgent.toLowerCase();
            var isWX = ua.indexOf('micromessenger') != -1;
            var openId = getURLParam(OPENID_KEY);
            // if (!isWX || !openId) {
            if (!openId) {
                this.$toast('请通过微信公众账号进入预约界面');
            } else {
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
        sendMsg() {
            _reqGetSMSCode(function () {
                this.msgChecked = true;
                this.msgCodeCount = SMS_CODE_TIMEOUT;
            }.bind(this), {
                mobile: this.bindForm.phone,
                type: 1
            });

        },
        clickSettingBtn() {
            window.location.href = './setting.html';
        },
        doClickHref(href) {
            window.location.href = href;
        },
        getNotices: function () {
          _reqGetNotices(function (err, data) {
            if (err) return;
            let content = "";
            data.forEach((t) => {
              content +="    " + t.title + "：" + t.content;
            });
            this.notices = content;
          }.bind(this));
        }
    }
});
/***************************    整体组件信息结束    ****************************************/
