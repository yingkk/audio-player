_checkCookie();
var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/***************************    整体组件信息开始    ****************************************/
var app = new Vue({
    el: '#fg-app',
    components: {},
    data: {
        data: null,
        actLists:[],
        loaded: false
    },
    watch: {},
    created: function () {
        this.getActLists();
    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
        // this.doLoading(true);
    },
    methods: {
        getActLists: function () {
            this.doLoading(true);
            _reqGetActLists(function (err, items) {
                this.doLoading(false);
                if (err) return;
                this.loaded = true;
                this.actLists = items.filter(function (val) {
                    return val.data;
                }.bind(this)).map(function (val) {
                    if (val.data.actDate) {
                        val.data.appoCutoffTimeStr = val.data.appoCutoffTime.replace('-', '年').replace('-', '月').replace(' ', '日 ')
                        val.data.actDateStr = val.data.actDate.replace('-', '年').replace('-', '月') + '日';
                        val.data.weekday = weekdays[new Date(val.data.actDate.replace(/-/g, '/')).getDay()];
                    }
                    val.data.imageURL = _fgConfig.imgURL.replace(IMAGE_KEY, val.data.actCover).replace(SIZE_KEY, '120x147');
                    return val;
                });
            }.bind(this), {
                type: 2
            });
        },
        clickActBtn: function (item) {
            if (item.data.setAppo < 3) {
                window.location.href = './act-group-form.html?id=' + item.data.id + '&type=0' ;
            } else {
                window.location.href = './act-group-form1.html?id=' + item.data.id + '&type=3' ;
            }
        },
        clickItem: function (item) {
            if (item.data.setAppo < 3) {
                window.location.href = './act-all-detail.html?id=' + item.data.id + '&type=0' ;
            } else {
                window.location.href = './act-all-detail.html?id=' + item.data.id + '&type=3' ;
            }
        },
        doLoading(flag) {
            doFgLoading(this, flag);
        },

    }
});
/***************************    整体组件信息结束    ****************************************/
