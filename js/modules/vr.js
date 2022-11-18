var app = new Vue({
    el: '#vr',
    components: {},
    data:function() {
        return {
            vrList:[]
        }
    },
    watch: {},
    created: function () {
        this.getVrList();
    },
    mounted: function () {
    },
    methods: {
        getVrList: function () {
            this.doLoading(true);
            _reqGetGuideVrList(function (err, items) {
                this.doLoading(false);
                if (err) return;
                this.vrList = items.datas;
            }.bind(this));
        },
        handleGuideVrDetail(item) {
            if(!item.url) return this.$toast('暂无体验');
            window.location.href = item.url;
        },
        doLoading(flag) {
            doFgLoading(this, flag);
        }
    }
});