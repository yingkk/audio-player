_checkCookie(2);
var sexMap = {'男': 1, '女': 0};
/***************************    整体组件信息开始    ****************************************/
var app = new Vue({
    el: '#fg-app',
    components: {},
    data: {
        form: null,
        sexColumns:['女', '男'],
        pattern: /\d{6}/,
        showSexPicker: false
    },
    watch: {


    },
    created: function () {
        this.getUserInfo();
    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
        // this.doLoading(true);

    },
    methods: {
        // 校验函数返回 true 表示校验通过，false 表示不通过
        validator(val) {
            if (!val || val === '') {
                return false;
            }
            return true;
        },
        validatorIDCard(val) {
            if (!val || val == '') {
                return true;
            }
            return validateIdCard(val);
        },
        validatorPhone(val) {
            if (!val || val == '') {
                return true;
            }
            return validatePhone(val);
        },
        onFailed(errorInfo) {
            console.log('failed', errorInfo);
        },
        onSubmit(values) {
            this.doLoading(true);
            _reqSendEditUserInfo(function (err, data) {
                if (!err) {
                    window.history.go(-1);
                }
            }.bind(this), this.form);

        },
        doLoading(flag) {
            doFgLoading(this, flag);
        },
        onSexConfirm(val) {
            this.form.sex = sexMap[val];
            this.showSexPicker = false;
        },

        getUserInfo: function () {
            this.doLoading(true);
            _reqGetUserInfo(function (err, resp) {
                this.doLoading(false);
                if (err) return;
                if (resp.code == 200) {
                    this.form = resp.data;
                } else {
                    this.$toast(resp.message);
                }
            }.bind(this));
        },
        clickBack:function () {
            window.history.go(-1);
        },
        clickCancelAccount: function() {
            this.$dialog.alert({
                title: '提示',
                message: '此操作将永久注销该账号，历史预约数据全部清空，请谨慎操作，是否继续？',
                showCancelButton: true,
            }).then(() => {
                _reqSendCancelAccount(function(err, resp){
                    if(err) return;
                    if (resp.state == 0) {
                        this.$toast("注销成功!");
                        setTimeout(function() {
                            removeFgCookie(TOKEN_KEY);
                            _toLogin();
                        }, 3000);
                    } else {
                        this.$toast("注销失败，请联系管理员");
                    }
                }.bind(this))
                // on confirm
            }).catch(() => {
                // on cancel
            });
        }
    }
});
/***************************    整体组件信息结束    ****************************************/
