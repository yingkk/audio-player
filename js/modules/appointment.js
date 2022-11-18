var app = new Vue({
  el: "#appointment",
  components: {},
  data: function () {
    return {
      actList: [],
      activeTabIndex: 0,
    };
  },
  created: function () {
    this.getActList();
  },
  mounted: function () {},
  methods: {
    onTabIndexChange(index) {
      this.activeTabIndex = index;
      this.getActList();
    },
    getActList: function () {
      this.doLoading(true);
      _reqGetActLists(
        function (err, items) {
          this.doLoading(false);
          if (err) return;
          this.actList = items;
        }.bind(this),
        {
          type: this.activeTabIndex,
        }
      );
    },
    handleAppointmentDetail(id) {
      window.location.href = "./appointment-detail.html?id=" + id + "&type=" + this.activeTabIndex;
    },
    doLoading(flag) {
      doFgLoading(this, flag);
    }
  }
});
