var TOKEN_KEY = 'token';
var OPENID_KEY = 'openId';
var IMAGE_KEY = '#imgID';
var SIZE_KEY = '#size';
var _fgConfig = {
    debug: false,
    prod: true,
    // baseURI: "http://192.168.1.111:38889",
    baseURI: "http://finegold.nat300.top",
    visitLoginURL: "../modules/visit.html",  //参观
    actLoginURL: "../modules/appointment.html",  // 活动
    personalCenterLoginURL: "../modules/setting.html", //个人中心
    homeURL: "../modules/visit.html",
    imgURL: "http://finegold.natapp4.cc/external/appoint/#imgID/file?type=preview&size=#size",
    imgOldURL: "http://finegold.natapp4.cc/external/appoint/#imgID/file?type=preview&size=old"
};

function globalUserInfoId() {
    if (_fgConfig.prod) {
        return app.userInfo.id;
    }
    return '123456';
}

function getURLParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}



/**
 * 设置LocalStorage
 * @param name
 * @param value
 */
function setLocalStorageItem(name, value) {
    if (!value) {
        value = '';
    }
    window.localStorage.setItem(name, value);
}

/*
获取LocalStorage中的值
*/
function getLocalStorageItem(objName) {//获取指定名称的cookie的值
    var value = window.localStorage.getItem(objName);
    if ('' === value) return undefined;
    return window.localStorage.getItem(objName);
}



function setGlobalCookie(name,value) {
    /*
    *--------------- setCookie(name,value) -----------------
    * setCookie(name,value)
    * 功能:设置得变量name的值
    * 参数:name,字符串;value,字符串.
    * 实例:setCookie('username','baobao')
    *--------------- setCookie(name,value) -----------------
    */
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function setFgCookie(name, val) {
    Cookies.set(name, val);
    // setLocalStorageItem(name, val);
}

function getFgCookie(name) {
    // return  getLocalStorageItem(name);
    return  Cookies.get(name);
}

function removeFgCookie(name) {
    // setLocalStorageItem(name, '');
    return  Cookies.remove(name);
}


