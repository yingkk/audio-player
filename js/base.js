// var _loginVisitURL = _fgConfig.loginURL;         // 获取登录地址

var _visitLoginURL = _fgConfig.visitLoginURL, //参观
  _actLoginURL = _fgConfig.actLoginURL, // 活动
  _personalCenterLoginURL = _fgConfig.personalCenterLoginURL; //个人中心

var _prod = _fgConfig.prod; // 获取登录地址

function _checkCookie(type) {
  var _fgToken = getFgCookie(TOKEN_KEY);
  if (!_prod) return;
  // 不存在token直接返回登录页面
  if (!_fgToken || _fgToken === "") {
    _toLogin(type);
  }
}

function _toLogin(type) {
  var openId = getFgCookie(OPENID_KEY);
  type = type || 0;
  switch (type) {
    case 1:
      window.location.href = _actLoginURL + (openId ? "?openId=" + openId : "");
      break;
    case 2:
      window.location.href =  _personalCenterLoginURL + (openId ? "?openId=" + openId : "");
      break;
    default:
      window.location.href = _visitLoginURL + (openId ? "?openId=" + openId : "");
  }
}

function doFgLoading(that, flag) {
  if (flag) {
    that.$toast({
      type: "loading",
      message: "加载中...",
      forbidClick: true,
      loadingType: "spinner",
      duration: false,
    });
  } else {
    that.$toast.clear();
  }
}

function removeNodesFromHtmlText(htmlText, nodes) {
  nodes.forEach(function (v) {
    var reg1 = new RegExp("<" + v + "[^>]*>", "ig");
    var reg2 = new RegExp("<[^>]*" + v + ">", "ig");
    htmlText = htmlText.replace(reg1, "").replace(reg2, "");
  });
  return htmlText;
}
