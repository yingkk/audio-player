var app = new Vue({
  el: "#collection-detail",
  components: {},
  data: function () {
    return {
      collectionDetail: {},
    };
  },
  watch: {},
  created: function () {
    this.getCollectionDetail();
  },
  mounted: function () {
  },
  methods: {
    getCollectionDetail: function () {
      const collectionId = getURLParam("id");
      if (!collectionId) return this.$toast("藏品欣赏载入出错");
      this.doLoading(true);
      _reqGetGuideCollectionDetail(
        function (err, data) {
          if (err) return;
          this.doLoading(false);
          this.collectionDetail = data;
        }.bind(this),
        {
          id: collectionId
        });
    },
    doLoading(flag) {
      doFgLoading(this, flag);
    }
  }
});
