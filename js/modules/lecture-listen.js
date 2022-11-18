var app = new Vue({
    el: "#lecture-listen",
    components: {},
    data: function () {
      return {
        lectureList: [],
      };
    },
    watch: {},
    created: function () {
      this.getLectureListenList();
    },
    mounted: function () {
    },
    methods: {
      getLectureListenList: function () {
        this.doLoading(true);
        _reqGetLectureListenList(
          function (err, items) {
            this.doLoading(false);
            if (err) return;
            this.lectureList = items.datas;
          }.bind(this)
        );
      },
      handleLectureListenDetail(id) {
        window.location.href = "./lecture-listen-detail.html?id=" + id;
      },
      doLoading(flag) {
        doFgLoading(this, flag);
      }
    }
  });
  