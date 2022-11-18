var app = new Vue({
  el: "#guide-audio",
  components: {},
  data: function () {
    return {
      audioList: [],
    };
  },
  watch: {},
  created: function () {
    this.getAudioList();
  },
  mounted: function () {
  },
  methods: {
    getAudioList: function () {
      this.doLoading(true);
      _reqGetGuideAudioList(
        function (err, items) {
          this.doLoading(false);
          if (err) return;
          this.audioList = items.datas;
        }.bind(this)
      );
    },
    handleGuideAudioDetail(id) {
      window.location.href = "./guide-audio-detail.html?id=" + id;
    },
    doLoading(flag) {
      doFgLoading(this, flag);
    },
  },
});
