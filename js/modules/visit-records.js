_checkCookie();
var yyStateMap = {
    0: "预约",
    1: "待审核",
    2: "审核通过",
    3: "审核不通过",
    4: "部分取票",
    5: "已取票",
    6: "部分进馆",
    7: "已进馆",
    8: "已退票",
    9: "已逾期"
};
var yyJJMap = {
    0: '30分钟讲解服务',
    1: '60分钟讲解服务',
    2: '60分钟以上讲解服务'
};


function fgChangeDate(date) {
    var json_date = new Date(date.substr(0, 19).replace(/T/g, ' ').replace(/-/g, '/')).toJSON();
    return new Date(new Date(json_date).getTime() + 16 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

/***************************    整体组件信息开始    ****************************************/
var app = new Vue({
    el: '#fg-app',
    components: {},
    data: {
        tabIndex: 0,


        yyStateMap: yyStateMap,
        images: [],
        imageShow: false,

        items: [],
        loading: false,
        finished: false,
        refreshing: false,
        empty: false,

        items1: [],
        loading1: false,
        finished1: false,
        refreshing1: false,
        empty1: false,

        userInfo: null
    },
    watch: {},
    created: function () {
        this.getUserInfo();
        this['reqTabIndex' + this.tabIndex]();
    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
        // this.doLoading(true);
        // this.getWXAppId();
    },
    methods: {
        getUserInfo: function () {
            // this.doLoading(true);
            _reqGetUserInfo(function (err, resp) {
                // this.doLoading(false);
                if (err) return;
                if (resp.code == 200) {
                    this.userInfo = resp.data;
                    this['reqTabIndex' + this.tabIndex]();
                } else {
                    this.$toast(resp.message);
                }
            }.bind(this));
        },
        clickQRCode: function (item) {
            this.images = [item.qrcode];
            this.imageShow = true;
        },
        changeShow: function (items, index) {
            items[index].show = true;
            this.items = items;
        },
        changeShow1: function (items, index) {
            items[index].show = true;
            this.items1 = items;
        },
        reqTabIndex0: function () {
            if (_fgConfig.prod && !this.userInfo) return;
            _reqGetVisitAppoed(function (err, items) {
                this.loading = false;
                this.refreshing = false;
                if (err) return;
                this.finished = true;
                this.items = items.map(function (val) {
                    val.orderTime = fgChangeDate(val.orderTime);
                    val.visitDate = fgChangeDate(val.visitDate).split(' ')[0];
                    val.show = false;
                    return val;
                }.bind(this));
                this.empty = !this.items.length;
            }.bind(this), {
                userId: globalUserInfoId(),
                type: 0
            })
        },
        reqTabIndex1: function () {
            if (_fgConfig.prod && !this.userInfo) return;
            _reqGetVisitAppoed(function (err, items) {
                this.loading1 = false;
                this.refreshing1 = false;
                if (err) return;
                this.finished1 = true;
                this.items1 = items.map(function (val) {
                    val.orderTime = fgChangeDate(val.orderTime);
                    val.visitDate = fgChangeDate(val.visitDate).split(' ')[0];
                    val.show = false;
                    return val;
                }.bind(this));
                this.empty1 = !this.items1.length;
            }.bind(this), {
                userId: globalUserInfoId(),
                type: 1
            })
        },


        onRefresh() {
            // 清空列表数据
            this.finished = false;
            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
            this.reqTabIndex0();
        },
        onRefresh1() {
            // 清空列表数据
            this.finished1 = false;
            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading1 = true;
            this.reqTabIndex1();
        },
        cancelVisitAppo(item) {
            this.$dialog.confirm({
                title: '提示',
                message: '此操作将取消该预约, 是否继续?',
            }).then(function () {
                this.$toast.loading({message: '加载中...', forbidClick: true});
                _reqSendAppoCancel(function (err, data) {
                    this.$toast.clear();
                    if (err) return;
                    if (data.state == 0) {
                        this.$toast.success('取消成功');
                    } else {
                        this.$toast(data.message);
                    }
                    this['reqTabIndex' + this.tabIndex]();
                }.bind(this), {
                    VisitType: 0,
                    appoId: item.id
                });
            }.bind(this));
        },
    }
});
/***************************    整体组件信息结束    ****************************************/
