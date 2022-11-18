_checkCookie();
var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/***************************    整体组件信息开始    ****************************************/
var app = new Vue({
    el: '#fg-app',
    components: {},
    data: {
        data: null,
        actProps: []
    },
    watch: {

    },
    created: function () {

    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
        this.getActDetail();
    },
    methods: {
        getActDetail: function () {
            var actId = getURLParam('id');
            var type = getURLParam('type') || 0;
            if (!actId) {
                alert('活动载入出错');
            }
            this.doLoading(true);
            _reqGetActDetail(function (err, data) {
                this.doLoading(false);
                if (err) return;
                if (data.data.setAppo < 3) {
                    data.data.actDateStr = data.data.actDate.replace('-', '年').replace('-', '月') + '日';
                    data.data.appoCutoffTimeStr = data.data.appoCutoffTime.replace('-', '年').replace('-', '月').replace(' ', '日 ')
                    data.data.weekday = weekdays[new Date(data.data.actDate.replace(/-/g, '/')).getDay()];
                }
                data.data.imageURL = _fgConfig.imgURL.replace(IMAGE_KEY, data.data.actCover).replace(SIZE_KEY, '400X180');
                data.data.actDescribe =
                    removeNodesFromHtmlText(data.data.actDescribe,
                        ['table', 'tbody', 'tr', 'td', 'th', 'ul', 'ol', 'li'])
                        .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p class="rich-p"')
                        .replace(/<p>/ig, '<p class="rich-p">')
                        .replace(/float:/ig, 'test:')
                        .replace(/<span/ig, '<span class="rich-span"')
                        .replace(/<strong/ig, '<strong class="rich-span"')
                        .replace(/\<img/ig, '<img class="rich-img"');
                if (data.data.annex) {
                    data.data.files = data.data.annex.map(function (val) {
                        return _fgConfig.imgOldURL.replace(IMAGE_KEY, val);
                    })
                }
                this.data = data;
                this.actProps = data.data.props ? data.data.props.split(',') : [];
            }.bind(this), {
                type: type,
                actId: actId
            });
        },
        doLoading(flag) {
            doFgLoading(this, flag);
        },
    }
});
/***************************    整体组件信息结束    ****************************************/
