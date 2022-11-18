var app = new Vue({
  el: "#guide-audio-detail",
  components: {},
  data: function () {
    return {
      data: null,
      audioDetail: {},
      loaded: false,

      //audio
      audioPath: "",
      progressPoint: 0,
      max: 100,
      currentTime: 0,
      currentTimeFormatStr: '00:00:00',
      duration: 0, //audio总时长
      durationFormatStr: '',
      isAudioPlay: false,
    };
  },
  watch: {},
  created: function () {
    this.getAudioDetail();
  },
  mounted: function () {},
  methods: {
    changeProgress: function () {
      const range = this.$refs.range;
      this.progressPoint = parseInt(range.value);
      this.currentTime = this.duration * (this.progressPoint / this.max);
      this.currentTimeFormatStr = timeToMinute(this.currentTime)
      let audio = this.$refs.audio;
      audio.currentTime = this.currentTime;
    },
    timeUpdate: function (e) {
      e.preventDefault();
      this.currentTime = e.target.currentTime;
      this.currentTimeFormatStr = timeToMinute(this.currentTime)
      if (!this.currentTime) return false;
      this.progressPoint = 100 * (this.currentTime / this.duration);
      if (this.progressPoint === this.max) {
        this.isAudioPlay = false;
      }
    },
    audioCanPlay:function () {
      const audio = this.$refs.audio;
      this.duration = audio.duration;
      this.durationFormatStr = timeToMinute(audio.duration)
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
    getAudioDetail: function () {
      const audioId = getURLParam("id");
      if (!audioId) return this.$toast("音频导览载入出错");
      this.doLoading(true);
      _reqGetGuideAudioDetail(function (err, data) {
          if (err) return;
          this.doLoading(false);
          this.audioDetail = data;
        }.bind(this),
        {
          id: audioId
        });
    },

    doLoading(flag) {
      doFgLoading(this, flag);
    },
  },
});
