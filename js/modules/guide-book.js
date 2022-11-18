var app = new Vue({
  el: "#guide-book",
  data: function () {
    return {};
  },
  created: function () {},
  mounted: function () {
    this.initSwiper();
  },
  methods: {
    initSwiper() {
      new Swiper(".swiper-block .swiper-container", {
        allowTouchMove: true,
        pagination: {
          el: ".swiper-pagination",
        },
      });
    },
  },
});
