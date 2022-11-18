var _needToken = typeof _notNeedToken == 'undefined';
var _loginURL = _fgConfig.loginURL;
var _prod = _fgConfig.prod; //正式为true

var FG_ACTION = {
    LOGIN: '/login',            // 登录
    REGISTER: '/ext/user/add',  // 注册

    CANCEL_ACCOUNT: '/rest/sys/visituser/cancelAccount',   // 永久注销账户
    FORGET_PASSWORD: '/ext/user/changePwd', // 忘记密码
    RESET_PASSWORD: '/rest/sys/visituser/changePwd',   // 个人中心重置密码
    SMS_CODE: '/ext/user/sendSMS',                    //短信验证码
    EDIT_USER_INFO: '/rest/sys/visituser/editVisit',

    /**
     * 武术博物馆使用接口
     */
    USER_INFO: '/rest/sys/visituser/getUser',   // 用户信息

    GET_TOKEN: "/ext/user/getUser",     //获取关系
    BIND_PHONE: "/ext/user/wxadd/",     //获取关系
    RELATIONS: (_prod ? "/rest" : '') + '/external/appoint/getRelations',     //获取关系
    ID_CARD_TYPES: (_prod ? "/rest" : '') + '/external/appoint/getIdCardTypes',      // 证件类型
    SAVE_PERSON_VISIT: (_prod ? "/rest" : '') + '/external/appoint/savePreAppoint',      // 保存个人参观
    SAVE_GROUP_VISIT: (_prod ? "/rest" : '') + '/external/appoint/saveGroupAppoint',      // 保存团体参观
    GROUP_TYPES: (_prod ? "/rest" : '') + '/external/appoint/getGroupTypes',      // 保存个人参观
    GROUP_LIMIT_NUM: (_prod ? "/rest" : '') + '/external/appoint/getGroupLimitNum',  // 门票预约获取团体预约最大和最小数量接口
    SERVER_DATE: (_prod ? "/rest" : '') +'/external/appoint/getDateOfServer',      // 获取服务器时间
    VISIT_DATES: (_prod ? "/rest" : '') +'/external/appoint/getAppoDates',         // 参观日期列表
    VISIT_JJ: (_prod ? "/rest" : '') +'/external/appoint/getGuideOfPreAppo',         // 讲解列表
    VISIT_TIMES: (_prod ? "/rest" : '') +'/external/appoint/getIntervals',         // 参观时间段列表
    VISIT_APPOED: (_prod ? "/rest" : '') +'/external/appoint/personalAppo',         // 参观预约列表
    APPO_CANCEL: (_prod ? "/rest" : '') + '/external/appoint/cancelAppo',         // 取消预约
    ACT_LIMIT_NUM: (_prod ? "/rest" : '') +'/external/appoint/getActGroupLimitNum',         // 活动预约获取团体预约最大和最小数量接口
    ACT_LISTS: (_prod ? "/rest" : '') +'/external/appoint/getActs',         // 活动预约获取活动列表接口
    ACT_DETAIL: (_prod ? "/rest" : '') +'/external/appoint/getAppoInfoByActId',         // 活动详情
    SAVE_PERSON_ACT: (_prod ? "/rest" : '') +'/external/appoint/saveActPerAppoint',         // 保存个人活动
    SAVE_GROUP_ACT: (_prod ? "/rest" : '') +'/external/appoint/saveActGroupAppoint',         // 保存团体活动
    SAVE_GROUP_ACT1: (_prod ? "/rest" : '') +'/external/appoint/saveActDjAppoint',         // 保存党建活动
    ACT_APPOED: (_prod ? "/rest" : '') +'/external/appoint/actAppo',         // 参观预约列表
    NOTICES: '/external/appoint/getNotices',         // 通知列表
    SEARCH_APPOINFO: '/external/appoint/manualSearchAppo',         // 查询预约信息
    NEWS_NOTICES: (_prod ? "/rest" : '') +'/external/appoint/getNewsByUserid',         // 通知
    UPLOAD_FILE: _prod ? "/rest/appoint/uploadfile/attachfile" : '/external/appoint/attachfile',         // 上传文件

    GUIDE_COLL_LIST: '/external/guide/coll/list', // 藏品赏析列表
    GUIDE_COLL_DETAIL: '/external/guide/coll/detail', // 藏品赏析详情
    GUIDE_TOUR_LIST: '/external/guide/tour/list', // 全景列表
    GUIDE_TOUR_DETAIL: '/external/guide/tour/detail', // 全景详情
    GUIDE_AUDIO_LIST: '/external/guide/audio/list', // 音频导览列表
    GUIDE_AUDIO_DETAIL: '/external/guide/audio/detail', // 音频导览详情
    LECTURE_LISTEN_LIST: '/external/lecact/list', // 讲座聆听列表
    LECTURE_LISTEN_DETAIL: '/external/lecact/detail' // 讲座聆听详情
};

function _fgCallback(callback, error, data) {
    if (_prod) {
        data = data.data;
    }
    callback && callback(error, data);
}

function _reqSendBindPhone(callback, data) {
    fgPostJsonWithoutToken(FG_ACTION.BIND_PHONE + data.SMSCode,  data,function (error, data) {
        callback && callback(error, data);
    });
}

function _reqSendSetupPwd(callback) {
    setTimeout(function () {
        callback && callback(null, null);
    }, 1000);
}

function _reqGetToken(callback, data){
    fgGetWithOutToken(FG_ACTION.GET_TOKEN, data, function (error, data) {
        callback && callback(error, data);
    })
}

// 登录
function _reqSendLogin(callback, data) {
    fgPostWithoutToken(FG_ACTION.LOGIN, data, function (error, data) {
        callback && callback(error, data);
    });
}

// 注册
function _reqSendRegister(callback, data) {
    fgPostJsonWithoutToken(FG_ACTION.REGISTER + '/' + data.SMSCode, data, function (error, data) {
        callback && callback(error, data);
    });
}

// 忘记密码
function _reqSendForgetPassword(callback, data) {
    fgPostJsonWithoutToken(FG_ACTION.FORGET_PASSWORD, data, function (error, data) {
        callback && callback(error, data);
    });
}

// 获取短信验证码
function _reqGetSMSCode(callback, data) {
    fgPostJsonWithoutToken(FG_ACTION.SMS_CODE, data,function (error, data) {
        callback && callback(error, data);
    });
}

// 获取个人信息
function _reqGetUserInfo(callback) {
    fgGet(FG_ACTION.USER_INFO, {}, function (error, data) {
        if (_prod) {
            if (error && error.response && error.response.data && error.response.data.code == 101) {
                app.$toast('登录信息失效，请重新登录');
                setTimeout(function () {
                    removeFgCookie(TOKEN_KEY);
                   _toLogin();
                }, 1500);
            }
        }
        callback && callback(error, data);
    });
}

/*************************   个人中心   *************************/
// 个人中心-保存个人信息
function _reqSendEditUserInfo(callback, data) {
    fgPost(FG_ACTION.EDIT_USER_INFO, data, function (error, data) {
        callback && callback(error, data);
    });
}

// 个人中心-保存个人信息
function _reqSendResetPassword(callback, data) {
    fgPost(FG_ACTION.RESET_PASSWORD, data, function (error, data) {
        callback && callback(error, data);
    });
}

/******************************  下面的都是活动和参观的信息注意返回值处理   ************************************/
// 获取关系
function _reqGetRelations(callback) {
    fgGet(FG_ACTION.RELATIONS, {}, function (error, data) {
        _fgCallback(callback, error, data);
    });
}

// 获取证件类型
function _reqGetIdCardTypes(callback) {
    fgGet(FG_ACTION.ID_CARD_TYPES, {}, function (error, data) {
        _fgCallback(callback, error, data);

    });
}

// 获取团体类型
function _reqGetGroupTypes(callback) {
    fgGet(FG_ACTION.GROUP_TYPES, {}, function (error, data) {
        _fgCallback(callback, error, data);
    });
}

// 获取团体类型
function _reqGetGroupLimitNum(callback) {
    fgGet(FG_ACTION.GROUP_LIMIT_NUM, {}, function (error, data) {
        _fgCallback(callback, error, data);
    });
}

// 保存个人参观信息
function _reqSendPersonVisit(callback, data) {
    fgPost(FG_ACTION.SAVE_PERSON_VISIT, data, function (error, data) {
        _fgCallback(callback, error, data);
    });
}

// 保存团体参观信息
function _reqSendGroupVisit(callback, data) {
    fgPost(FG_ACTION.SAVE_GROUP_VISIT, data, function (error, data) {
        _fgCallback(callback, error, data);
    });
}

function _reqGetServerTime(callback) {
    fgGet(FG_ACTION.SERVER_DATE, {}, function (error, data) {
        if (error) return;
        callback && callback(data);
    });
}

function _reqGetDayItems(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.VISIT_DATES, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

function _reqGetJJItems(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.VISIT_JJ, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

function _reqGetTimeItems(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.VISIT_TIMES, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

function _reqGetVisitAppoed(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.VISIT_APPOED, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 取消预约接口
 * @param callback
 * @param params
 * appoId: 预约id
 * VisitType: 0 参观  1  活动  2 党建
 * @private
 */
function _reqSendAppoCancel(callback, params) {
    params = params || {};
    fgPost(FG_ACTION.APPO_CANCEL, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

function _reqGetActGroupLimitNum(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.ACT_LIMIT_NUM, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

function _reqGetActLists(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.ACT_LISTS, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

function _reqGetActDetail(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.ACT_DETAIL, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

// 保存个人活动信息
function _reqSendActPerson(callback, data) {
    fgPost(FG_ACTION.SAVE_PERSON_ACT, data, function (error, data) {
        _fgCallback(callback, error, data);
    });
}

// 保存个人活动信息
function _reqSendActGroup(callback, data) {
    fgPost(FG_ACTION.SAVE_GROUP_ACT, data, function (error, data) {
        _fgCallback(callback, error, data);
    });
}

// 保存党建活动信息
function _reqSendActGroup1(callback, data) {
    fgPost(FG_ACTION.SAVE_GROUP_ACT1, data, function (error, data) {
        _fgCallback(callback, error, data);
    });
}

function _reqGetActAppoed(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.ACT_APPOED, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 根据用户姓名与证件号码/预约编号查询预约信息接口
 * @param callback
 * @param params
 * name 预约人姓名
 * no 预约编号或证件号码
 * @private
 */
function _reqGetSearchAppoInfo(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.SEARCH_APPOINFO, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 根据用户userid获取消息通知接口
 * @param callback
 * @param params
 * userId 预约人userId
 * @private
 */
function _reqGetNewsNotices(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.NEWS_NOTICES, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 上传文件
 * @param callback
 * 返回内容
 * "state":0,
 * "message":"成功",
 * data 为文件ID
 * @param params
 * file 上传的文件对象
 * @private
 */
function _reqPostFile(callback, params) {
    params = params || {};
    fgPostFile(FG_ACTION.UPLOAD_FILE, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 首页获取通知公告
 * @param {*} callback
 */
function _reqGetNotices(callback) {
    fgGet(FG_ACTION.NOTICES, {}, function (error, data) {
      if (error) return;
      _fgCallback(callback, error, data);
    });
  }

  /**
 * 永久注销账号
 * @param callback
 * @param params
 * appoId: 预约id
 * VisitType: 0 参观  1  活动  2 党建
 * @private
 */
 function _reqSendCancelAccount(callback, params) {
    params = params || {};
    fgPost(FG_ACTION.CANCEL_ACCOUNT, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 藏品赏析列表
 * @param {*} callback 
 * @param {*} params 
 */
function _reqGetGuideCollectionList(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.GUIDE_COLL_LIST, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 藏品赏析详情
 * @param {*} callback 
 * @param {*} params 
 */
 function _reqGetGuideCollectionDetail(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.GUIDE_COLL_DETAIL, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}


/**
 * 全景列表
 * @param {*} callback 
 * @param {*} params 
 */
 function _reqGetGuideVrList(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.GUIDE_TOUR_LIST, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 全景详情
 * @param {*} callback 
 * @param {*} params 
 */
 function _reqGetGuideVrDetail(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.GUIDE_TOUR_DETAIL, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 音频导览列表
 * @param {*} callback 
 * @param {*} params 
 */
 function _reqGetGuideAudioList(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.GUIDE_AUDIO_LIST, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 音频导览详情
 * @param {*} callback 
 * @param {*} params 
 */
 function _reqGetGuideAudioDetail(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.GUIDE_AUDIO_DETAIL, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}


/**
 * 讲座聆听列表
 * @param {*} callback 
 * @param {*} params 
 */
 function _reqGetLectureListenList(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.LECTURE_LISTEN_LIST, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}

/**
 * 讲座聆听详情
 * @param {*} callback 
 * @param {*} params 
 */
 function _reqGetLectureListenDetail(callback, params) {
    params = params || {};
    fgGet(FG_ACTION.LECTURE_LISTEN_DETAIL, params, function (error, data) {
        if (error) return;
        _fgCallback(callback, error, data);
    });
}








