var app = new Vue({
  el: "#lecture-listen-detail",
  components: {},
  data: function () {
    return {
      lectureDetail: {},

      //audio
      audioPath: "",
      progressPoint: 0,
      max: 100,
      currentTime: 0,
      currentTimeFormatStr: "00:00:00",
      duration: [], //audio总时长
      durationFormatStr: [],
      isAudioPlay: false,
      activeAudioIndex: 0,
      activeRangeIndex: 0,

      showVideoDialog: false,
      activeVideo: null,
    };
  },
  watch: {},
  created: function () {
    this.getLectureListenDetail();
  },
  mounted: function () {},
  methods: {
    changeProgress: function (index) {
      if (index === this.activeAudioIndex) {
        this.activeRangeIndex = index;
        const range = this.$refs.range[index];
        this.progressPoint = parseInt(range.value);
        this.currentTime =
          this.duration[index] * (this.progressPoint / this.max);
        this.currentTimeFormatStr = timeToMinute(this.currentTime);
        const audio = this.$refs.audio[index];
        audio.currentTime = this.currentTime;
      }
    },
    timeUpdate: function (e, index) {
      e.preventDefault();
      this.activeAudioIndex = index;
      this.activeRangeIndex = index;
      this.currentTime = e.target.currentTime;
      this.currentTimeFormatStr = timeToMinute(this.currentTime);
      if (!this.currentTime) return false;
      this.progressPoint = 100 * (this.currentTime / this.duration[index]);
      if (this.progressPoint === this.max) {
        this.isAudioPlay = false;
      }
    },
    audioCanPlay: function (index) {
      const audio = this.$refs.audio[index];
      this.duration[index] = audio.duration;
      this.duration = [].concat(this.duration);
      this.durationFormatStr[index] = timeToMinute(audio.duration);
      this.durationFormatStr = [].concat(this.durationFormatStr);
    },
    handlePlayAudio: function (index) {
      this.activeAudioIndex = index;
      this.handlePauseAll(index);
      const audio = this.$refs.audio[index];
      if (audio.paused) {
        audio.play();
        this.isAudioPlay = true;
      } else {
        audio.pause();
        this.isAudioPlay = false;
      }
    },
    handlePauseAll(index) {
      const audios = this.$refs.audio.filter((t, i) => i !== index);
      audios.forEach((t) => {
        t.load();
      });
    },
    handleHideVideoDialog: function () {
      this.showVideoDialog = false;
    },
    handleShowVideoDialog: function (item) {
      this.activeVideo = item;
      this.showVideoDialog = true;
    },
    getLectureListenDetail: function () {
      const lectureId = getURLParam("id");
      if (!lectureId) return this.$toast("讲解聆听载入出错");
      this.doLoading(true);
      _reqGetLectureListenDetail(
        function (err, data) {
          if (err) return;
          this.doLoading(false);
          this.lectureDetail = data;
        }.bind(this),
        {
          id: lectureId,
        }
      );
    },
    doLoading(flag) {
      doFgLoading(this, flag);
    },
  },
});
