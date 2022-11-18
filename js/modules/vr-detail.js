var app = new Vue({
  el: "#vr-detail",
  components: {},
  data: function () {
    return {
      data: null,
      actLists: [],
      loaded: false,

      //audio
      audioPath: '',
      progressPoint: 0,
      max: 100,
      currentTime: 0,
      duration: 0, //audio总时长
      isAudioPlay: false
    };
  },
  watch: {},
  created: function () {
    // this.getActLists();
  },
  mounted: function () {
    // this.$refs.app.style.display = 'block';
    // this.doLoading(true);
  },
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
    onChange(event) {},
    getActLists: function () {
      this.doLoading(true);
      _reqGetActLists(
        function (err, items) {
          this.doLoading(false);
          if (err) return;
          this.loaded = true;
          this.actLists = items
            .filter(
              function (val) {
                return val.data;
              }.bind(this)
            )
            .map(function (val) {
              if (val.data.actDate) {
                val.data.appoCutoffTimeStr = val.data.appoCutoffTime
                  .replace("-", "年")
                  .replace("-", "月")
                  .replace(" ", "日 ");
                val.data.actDateStr =
                  val.data.actDate.replace("-", "年").replace("-", "月") + "日";
                val.data.weekday =
                  weekdays[
                    new Date(val.data.actDate.replace(/-/g, "/")).getDay()
                  ];
              }
              val.data.imageURL = _fgConfig.imgURL
                .replace(IMAGE_KEY, val.data.actCover)
                .replace(SIZE_KEY, "120x147");
              return val;
            });
        }.bind(this),
        {
          type: 2,
        }
      );
    },

    doLoading(flag) {
      doFgLoading(this, flag);
    },
  },
});
