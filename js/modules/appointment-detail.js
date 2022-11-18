var app = new Vue({
  el: "#appointment-detail",
  components: {},
  data: function () {
    return {
      id: null,
      type: 0,
      actDetail: {},

      //audio
      audioPath: "",
      progressPoint: 0,
      max: 100,
      currentTime: 0,
      duration: 0, //audio总时长
      isAudioPlay: false,

      showVideoDialog: false,
    };
  },
  watch: {},
  created: function () {
    this.id = getURLParam("id");
    this.type = getURLParam("type");
    this.getActDetail();
  },
  mounted: function () {},
  methods: {
    changeProgress: function () {
      const range = this.$refs.range;
      this.progressPoint = parseInt(range.value);
      this.currentTime = this.duration * (this.progressPoint / this.max);
      const audio = this.$refs.audio;
      audio.currentTime = this.currentTime;
    },
    timeUpdate: function (e) {
      this.currentTime = e.target.currentTime;
      if (!this.currentTime) return false;
      this.progressPoint = 100 * (this.currentTime / this.duration);
      if (this.progressPoint === this.max) {
        this.isAudioPlay = false;
      }
    },
    listenCanPlay() {
      const audio = this.$refs.audio;
      this.duration = audio.duration;
    },
    handlePlayAudio: function () {
      const audio = this.$refs.audio;
      if (audio.paused) {
        audio.play();
        this.isAudioPlay = true;
      } else {
        audio.pause();
        this.isAudioPlay = false;
      }
    },
    handleHideVideoDialog: function () {
      this.showVideoDialog = false;
    },
    handleShowVideoDialog: function () {
      this.showVideoDialog = true;
    },
    getActDetail: function () {
      if (!this.id) return this.$toast(!this.type ? "活动载入出错" : "讲座载入出错");
      this.doLoading(true);
      _reqGetActDetail(
        function (err, data) {
          this.doLoading(false);
          if (err) return;
          this.actDetail = data;
        }.bind(this),
        {
          actId: this.id
        }
      );
    },
    handlePersonActAppoint() {
      window.location.href = "./act-person-form.html?id=" + this.id + "&type=" + this.type;
    },
    handleGroupActAppoint() {
      window.location.href = "./act-group-form.html?id=" + this.id + "&type=" + this.type;
    },
    doLoading(flag) {
      doFgLoading(this, flag)
    }
  }
});
