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
    return new Date(new Date(json_date).getTime() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

/***************************    整体组件信息开始    ****************************************/
var app = new Vue({
    el: '#fg-app',
    components: {},
    data: {
        tabIndex: 0,
        data: null,
        editForm: {
            name: '',
            cardNum: ''
        },
        yyStateMap: yyStateMap,
        images: [],
        imageShow: false,

        items: [],
        loading: false,
        finished: false,
        refreshing: false,
        empty: false,

        popupShow: true,
    },
    watch: {},
    created: function () {
    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
        // this.doLoading(true);
    },
    methods: {
        clickQRCode: function (item) {
            this.images = [item.qrcode];
            this.imageShow = true;
        },
        changeShow: function (items, index) {
            items[index].show = true;
            this.items = items;
        },

        onRefresh() {
            // 清空列表数据
            this.finished = false;
            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
        },

        validator(val) {
            return val !== '';
        },
        validatorNameLength(val) {
            return !(val.trim().length < 2);
        },

        onSubmit(values) {
            this.loading = true;
            var fromData = JSON.parse(JSON.stringify(this.editForm));
            fromData.no = fromData.cardNum;
            _reqGetSearchAppoInfo(function (err, data) {
                this.loading = false;
                if (err) {
                    this.$toast('查询异常');
                    return;
                }
                this.items = data;
                this.data = fromData;
                this.popupShow = false;
            }.bind(this), fromData);
        },

        onFailed(errorInfo) {
            console.log('failed', errorInfo);
        },

        clickSearch() {
            this.editForm = JSON.parse(JSON.stringify(this.data));
            this.popupShow = true;
        }
    }
});
/***************************    整体组件信息结束    ****************************************/
