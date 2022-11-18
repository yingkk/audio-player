var app = new Vue({
    el: '#collect',
    components: {},
    data:function() {
        return {
            collectionList:[]
        }
    },
    watch: {},
    created: function () {
        this.getCollectionList();
    },
    mounted: function () {
    },
    methods: {
        getCollectionList: function () {
            this.doLoading(true);
            _reqGetGuideCollectionList(function (err, items) {
                this.doLoading(false);
                if (err) return;
                this.loaded = true;
                this.collectionList = items.datas;
            }.bind(this));
        },
        handleGuideCollectDetail(id) {
            window.location.href = './collection-detail.html?id=' + id;
        },
        doLoading(flag) {
            doFgLoading(this, flag);
        }
    }
});