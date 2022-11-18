_checkCookie();
var SMS_CODE_TIMEOUT = 5;
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
    },
    watch: {
        'bindForm.phone': function (val, oldVal) {
            this.msgCodeDisabled = validatePhone(val);
        }

    },
    created: function () {
    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
        // this.doLoading(true);
        // this.getWXAppId();
    },
    methods: {
        // 校验函数返回 true 表示校验通过，false 表示不通过
        validator(val) {
            if (val === '' || !validatePhone(val)) {
                return false;
            }
            return true;
        },

        validatorPwd(val) {
            if (/^[0-9A-Za-z]{6, 32}$/.test(val)) {
                return  true;
            }
            return  false;
        },
        onFailed(errorInfo) {
            console.log('failed', errorInfo);
        },
        onSubmit(values) {
            this.doLoading(true);
            _reqSendBindPhone(function () {
                this.bindPhoneShow = false;
                this.doLoading(false);
                this.setupPwdShow = true;
            }.bind(this));
        },

        onSubmit1(values) {
            this.doLoading(true);
            _reqSendSetupPwd(function () {
                this.setupPwdShow = false;
                this.doLoading(false);
            }.bind(this));
        },
        getWXAppId() {
            _reqGetWXAppId(function () {
                this.doLoading(false);
                this.bindPhoneShow = true;
            }.bind(this));
        },
        doLoading(flag) {
            doFgLoading(this, flag);
        },
        sendMsg() {
            this.msgCodeCount = SMS_CODE_TIMEOUT;
        },
        doClickHref(href) {
            window.location.href = href;
        }
    }
});
/***************************    整体组件信息结束    ****************************************/
