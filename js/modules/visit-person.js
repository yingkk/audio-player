_checkCookie();
var SMS_CODE_TIMEOUT = 5;
var sexMap = {
    '男': 1,
    '女': 0,
};
var sexMap1 = {
    1: '男',
    0: '女',
};

var relations;
var relationsMap = {};
var relationsMap1 = {};
var relationsMap2 = {};
var idCardTypes;
var idCardTypesMap = {};
var idCardTypesMap1 = {};
var idCardTypesMap2 = {};

function buildDateItems(days, today) {
    var _days = [];
    var firstDate = new Date(days[0].date.replace(/-/g, '/'));
    var _date = firstDate.getDate();
    var _day = firstDate.getDay();
    _day = _day === 0 ? 7 : _day;

    // sate  1 可预约  2 闭馆  3不可预约
    for (var i = _day - 1; i > 0; i--) {
        var dateTime = new Date(days[0].date.replace(/-/g, '/'));
        dateTime.setDate(dateTime.getDate() - i);
        dateTime = new Date(dateTime);
        _days.push({
            dateFormat: formatDate2(dateTime),
            today: false,
            enabled: 3
        })
    }

    _days = _days.concat(days);
    var todayFormat = formatDate2(today);
    _days = _days.map(function (val, i) {
        val.today = val.dateFormat == todayFormat;
        return val;
    });
    return _days;
}

/***************************    step1开始    ****************************************/
Vue.component('step-1', {
    props: {
        stepData: {
            type: [Object],
            default: null
        },
        serverDate: {
            type: [Date],
            default: null
        },
    },
    template: '#step1',
    data: function () {
        return {
            dayItems: null,
            timeItems: [],
            stateMap: [undefined, '可约', '闭馆', '不可约'],
            choseDay: null,
            choseTime: null,
            jjItems: []
        }
    },
    created: function () {
        if (this.stepData) {
            this.choseDay = this.stepData.choseDay;
            this.choseDay = this.stepData.choseTime;
        }
        this.doFullLoading(true);
        this.getDayItems();
        this.getJJItems();
    },

    mounted: function () {

    },
    methods: {

        doFullLoading: function (flag) {
            this.$emit('full-loading', flag);
        },

        getDayItems: function () {
            var _this = this;
            _reqGetDayItems(function (err, items) {
                if (err) return;
                items = buildDateItems(items, _this.serverDate);
                _this.dayItems = items.map(function (v) {
                    v.dateFormat = v.dateFormat.replace('日', '').replace('月', '/');
                    return v;
                });
                var days = _this.dayItems.filter(function (val, i) {
                    return val.enabled == 1;
                });
                if (days.length) {
                    _this.doClickDayItem(days[0]);
                }
                _this.doFullLoading(false);
            }, {
                appoType: 0
            });
        },
        getJJItems: function () {
            var _this = this;
            _reqGetJJItems(function (err, items) {
                if (err) return;
				_this.jjItems = (items.data == null ? []: items.data);
                _this.doFullLoading(false);
            }, {});
        },

        getTimeItems() {
            var _this = this;
            this.timeItems = [];
            this.changeChoseTime(null);
            _reqGetTimeItems(function (err, items) {
                if (err) return;
                _this.timeItems = items;
                var times = items.filter(function (val, i) {
                    return val.state > 0 && val.surplus > 0;
                });
                if (times.length) {
                    _this.doClickTimeItem(times[0]);
                }
                _this.doFullLoading(false);
            }, {
                appoType: 0,
                visiteDate: this.choseDay.date
            })
        },

        doClickDayItem: function (item) {
            this.changeChoseDay(item);
            this.doFullLoading(true);
            this.getTimeItems();
        },

        doClickTimeItem: function (item) {
            this.changeChoseTime(item);
        },
        changeChoseDay: function (item) {
            this.choseDay = item;
            this.changeStepData();
        },
        changeChoseTime: function (item) {
            this.choseTime = item;
            this.changeStepData();
        },
        changeStepData: function () {
            this.$emit('change-data', {choseDay: this.choseDay, choseTime: this.choseTime}, 1);
        },
        doClickNext: function (i) {
            this.$emit('step-next', i);
        },
        doClickPrev: function (i) {
            this.$emit('step-prev', i);
        }

    }
});
/***************************    step1结束    ****************************************/
/***************************    step2开始    ****************************************/
var _txData = {
    _temp: null,
    name: "",
    sex: 1,
    cardTypeIndex: 0,
    cardType: '001',
    cardNum: '',
    phone: '',
    gxIndex: 0,
    gx: 1,
};

Vue.component('step-2', {
    props: {
        stepData1: {
            type: [Object],
            default: null
        },
        stepData2: {
            type: [Object],
            default: null
        }
    },
    watch: {
        data: {
            handler: function (val, oldVal) {
                this.changeStepData();
            },
            deep: true //true 深度监听
        },
        'yyTxShow': function (val, oldVal) {
            if (!val) {
                this.txEditData = null;
                this.txEditIndex = -1;
            }
        },
        'editData.cardType': function (val, oldVal) {
            if (val != oldVal && this.$refs.popupForm1) {
                this.$refs.popupForm1.validate('cardNum');
            }

            this.ageType = 0;
            if (val == '001' && validateIdCard(this.editData.cardNum)) {
                var age = getIDAge(this.editData.cardNum);
                if (age < 13) {
                    this.ageType = 1;
                } else if (age < 18) {
                    this.ageType = 2;
                } else if (age < 70) {
                    this.ageType = 3;
                } else {
                    this.ageType = 4;
                }
            }
        },
        'editData.cardNum': function (val, oldVal) {
            this.ageType = 0;
            if (this.editData.cardType == '001' && validateIdCard(val)) {
                var age = getIDAge(val);
                if (age < 13) {
                    this.ageType = 1;
                } else if (age < 18) {
                    this.ageType = 2;
                } else if (age < 70) {
                    this.ageType = 3;
                } else {
                    this.ageType = 4;
                }
            }
        },

        'txEditData.cardType': function (val, oldVal) {
            if (val != oldVal && this.$refs.popupForm2) {
                this.$refs.popupForm2.validate('cardNum');
            }
        },
    },

    template: '#step2',
    data: function () {
        return {
            yyPersonShow: false,
            yyTxShow: false,
            data: {
                name: "",
                sex: 1,
                cardTypeIndex: 0,
                cardType: '001',
                cardNum: '',
                phone: '',
            },
            dataValid: false,
            editData: null,
            txEditData: null,
            txEditIndex: -1,

            sexArr: [
                {
                    value: '0',
                    label: '女'
                },
                {
                    value: '1',
                    label: '男'
                }
            ],
            sexColumns: [],
            txColumns: [],
            cardTypeColumns: [],
            relationColumns: [],
            // cardTypeArr: [],
            txArr: [],
            showSexPicker: false,
            showCardTypePicker: false,

            showSexPicker1: false,
            showCardTypePicker1: false,
            showRelationPicker1: false,

            showOldSure: false,     // 显示老人警告框
            sexMap1: sexMap1,
            relationsMap1: {},
            idCardTypesMap1: {},
            ageType: 0,     // 0 检测不到年龄  1 小于13岁 2 大于13小于17 3 大于17 到70    4 大于70
        };
    },
    created: function () {
        this.cardTypeColumns = idCardTypes.map(function (val) {
            return val.name;
        });
        this.relationColumns = relations.map(function (val) {
            return val.label;
        }.bind(this));
        this.sexColumns = this.sexArr.map(function (val) {
            return val.label;
        }.bind(this));
        this.relationsMap1 = relationsMap1;
        this.idCardTypesMap1 = idCardTypesMap1;
        if (this.stepData2) {
            this.data = this.stepData2.data;
            this.editData = JSON.parse(JSON.stringify(this.data));
            this.dataValid = true;
            this.txArr = this.stepData2.txArr;
        }
    },

    mounted: function () {
    },
    methods: {
        /********************   信息校验相关    **********************/
        // 校验用户名
        validatorName(val) {
            return !(!val || val == '');
        },
        validatorNameLength(val) {
            return !(val.trim().length < 2);
        },
        // 校验证件号
        validatorIdCard(val) {
            if (!val || val == '') {
                return false;
            }
            if (this.editData.cardType == '001') {
                return validateIdCard(val);
            } else {
                return validateCarNum(val);
                ;
            }
        },
        // 校验手机号
        validatorPhone(val) {
            if (!val || val == '') {
                return false;
            }
            return validatePhone(val);
        },

        // 校验证件号
        validatorIdCard2(val) {
            if (!this.yyTxShow) {
                return true;
            }
            if (!val || val == '') {
                return false;
            }
            if (this.txEditData.cardType == '001') {
                return validateIdCard(val);
            } else {
                return validateCarNum(val);
                ;
            }
        },
        // 校验证件号
        validatorIdCard1(val) {
            if (this.data.cardNum == val) {
                return false;
            }
            return !this.txArr.filter(function (v, i) {
                return i != app.$refs.step2.txEditIndex;
            }).some(function (v) {
                return v.cardNum == val;
            });
        },
        // 校验手机号1
        validatorPhone1(val) {
            if (!val || val == '') {
                return true;
            }
            return validatePhone(val);
        },

        onSexConfirm(val) {
            this.editData.sex = sexMap[val];
            this.showSexPicker = false;
        },
        onCardTypeConfirm(val, index) {
            this.editData.cardTypeIndex = index;
            this.editData.cardType = idCardTypesMap[val];
            this.showCardTypePicker = false;
        },

        onSexConfirm1(val) {
            this.txEditData.sex = sexMap[val];
            this.showSexPicker1 = false;
        },
        onCardTypeConfirm1(val, index) {
            this.txEditData.cardTypeIndex = index;
            this.txEditData.cardType = idCardTypesMap[val];
            this.showCardTypePicker1 = false;
        },
        onRelationConfirm1(val, index) {
            this.txEditData.gxIndex = index;
            this.txEditData.gx = relationsMap[val];
            this.showRelationPicker1 = false;
        },
        yyPopup() {
            this.editData = JSON.parse(JSON.stringify(this.data));
            this.yyPersonShow = true;
        },
        onYYFormFailed(errorInfo) {
            console.log('failed', errorInfo);
        },
        onYYFormSubmit(vals) {
            this.dataValid = true;
            this.yyPersonShow = false;
            this.data = JSON.parse(JSON.stringify(this.editData));
        },
        clickCancelChangeData() {
            this.editData = JSON.parse(JSON.stringify(this.data));
        },

        // 添加1  即为同行人操作
        yyPopup1() {
            this.addTxInfo();
        },
        onYYFormFailed1(errorInfo) {
            console.log('failed', errorInfo);
        },
        onYYFormSubmit1(vals) {
            this.handlerTxSure();
        },
        handlerTxSure: function () {
            if (this.txEditIndex != -1) {
                this.txArr[this.txEditIndex] = this.txEditData;
            } else {
                this.txArr.push(this.txEditData);
            }
            this.txArr = JSON.parse(JSON.stringify(this.txArr));
            this.changeStepData();
            this.yyTxShow = false;
        },

        handlerTxDelete: function (index) {
            this.txArr.splice(index, 1);
            this.txArr = JSON.parse(JSON.stringify(this.txArr));
            this.changeStepData();
        },
        deleteTxInfo: function (index) {
            this.$dialog.alert({
                title: '温馨提示',
                message: '该操作可能会删除你的该同行人信息！',
                showCancelButton: true,
            }).then(() => {
                this.handlerTxDelete();
                // on confirm
            }).catch(() => {
                // on cancel
            });
        },
        addTxInfo: function (index) {
            var item = null;
            if (index == 0 || (index && index > 0)) {
                item = this.txArr[index];
                this.txEditIndex = index;
            } else {
                this.txEditIndex = this.txArr.length;
            }
            item = (item && JSON.parse(JSON.stringify(item))) || JSON.parse(JSON.stringify(_txData));
            if (!item._temp) {
                item._temp = new Date().getTime();
            }
            this.txEditData = item;
            this.yyTxShow = true;
        },

        changeStepData: function () {
            this.$emit('change-data', {data: this.data, txArr: this.txArr}, 2);
        },
        doClickNext: function (i) {
            if (this.data.cardType == '001' && this.ageType < 3) {
                this.txArr = [];
            }
            if (this.data.cardType != '001') {
                this.txArr = [];
            }
            this.changeStepData();
            this.$emit('step-next', i);
        },
        doClickPrev: function (i) {
            this.$emit('step-prev', i);
        }
    }
});
/***************************    step2结束    ****************************************/
/***************************    step3开始    ****************************************/
Vue.component('step-3', {
    props: {
        stepData1: {
            type: [Object],
            default: null
        },
        stepData2: {
            type: [Object],
            default: null
        }
    },
    template: '#step3',
    data: function () {
        return {
            mzShow: false,
            sexMap1: sexMap1,
            relationsMap1: {},
            idCardTypesMap1: {},
            sureLoading: false,
            sureBack: null
        }
    },
    created: function () {
        this.relationsMap1 = relationsMap1;
        this.idCardTypesMap1 = idCardTypesMap1;
    },

    mounted: function () {

    },
    methods: {
        showMZ(callback) {
            this.mzShow = true;
            callback && (this.sureBack = callback);
        },

        clickSure() {
            this.sureBack && this.sureBack();
        },
        doClickNext: function (i) {
            this.showMZ(function () {
                var data = this.stepData2.data;
                var txArr = JSON.parse(JSON.stringify(this.stepData2.txArr));
                txArr = txArr.map(function (val) {
                    return {
                        appoType: 0,
                        relation: val.gx,
                        name: val.name,
                        idCardType: {
                            id: idCardTypesMap2[val.cardType]
                        },
                        idCard: val.cardNum,
                        phone: val.phone,
                        sex: parseInt(val.sex)
                    }
                });

                this.sureLoading = true;
                this.mzShow = false;
                _reqSendPersonVisit(function (err, data) {
                    this.sureLoading = false;
                    if (err) return;
                    if (data.state == 0) {
                        this.$emit('success-data', data.data);
                        this.$emit('step-next', i);
                    } else {
                        this.$toast(data.message);
                    }
                }.bind(this), {
                    appoType: 0,
                    name: data.name,
                    sex: parseInt(data.sex),
                    idCardType: {
                        id: idCardTypesMap2[data.cardType]
                    },
                    idCard: data.cardNum,
                    phone: data.phone,
                    visitDate: this.stepData1.choseDay.date,
                    musInterval: {
                        id: this.stepData1.choseTime.musInterval.id
                    },
                    musIntervalShow: this.stepData1.choseTime.musInterval.intervalShow,
                    userId: globalUserInfoId(),
                    ticketSource: 1,
                    peerInfo: JSON.stringify(txArr)
                });
            }.bind(this));
        },
        doClickPrev: function (i) {
            this.$emit('step-prev', i);
        }
    }
});
/***************************    step3结束    ****************************************/
/***************************    step4开始    ****************************************/
Vue.component('step-4', {
    props: {
        successData: {
            type: [Object],
            default: null
        }
    },
    template: '#step4',
    data: function () {
        return {
            // successData: {
            //     "no": "20201211215379",
            //     "groupType": "",
            //     "appointTime": "2020-12-11 17:07",
            //     "appoType": "个人预约",
            //     "idCard": "110****551",
            //     "guideLength": null,
            //     "qrcode": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQAAAACFI5MzAAABWUlEQVR42u2YQa7DIAxEzYpjcFOg\r\nN+UYrELtsamiSH/zVYlZFEURzcvCNfZ4Wll/LfmRf5IpupLe86i2LR13DlI0xJfFOdqU5PvJQrqU\r\nlz0bNdsLtqcia13IpT6jI1NqHskzykRw2kMzqhXYZnnWwUniXaKBx/Xsn4PEV1TikPzUndNk4JAt\r\n5PXZcJAr24ViXD3Ej4doDWoBjoaQ9WOKjJ4m6FprC6/B7JCDaAFC+Xo27vpXPaMcZG1R0XQ2HDsH\r\nseoz2dMyhDBHH3OQy1II/YMwV5w5BUH+7ulM6GkOYtW33Nl5i0gJ13meeNQqLUaufHN254mGKQ31\r\n2BB7gtKQkOXjy0wTbPtWl/Nku4DquiL+Cgdx9wQv4DPWDFReHOTjSmRHHS6AgfSwABY1vgQbsXGh\r\nIbuT2spHQsw6rejgPTEIiP/KqTFpt1uhILcZi/nfIYQU5Pd/1XfJG0b93DRuoYh/AAAAAElFTkSu\r\nQmCC",
            //     "visitNum": 3,
            //     "ticketSource": "网站",
            //     "peerInfo": "[{\"appoType\":0,\"relation\":2,\"name\":\"八部\",\"idCardType\":{\"id\":\"8a7aefb16a4cedfc016a4de5db1f0006\"},\"idCard\":\"110101199003073415\",\"phone\":\"13412345678\",\"sex\":0},{\"appoType\":0,\"relation\":3,\"name\":\"完美\",\"idCardType\":{\"id\":\"8a7aefb16a4cedfc016a4de5db1f0006\"},\"idCard\":\"110101199003077192\",\"phone\":\"\",\"sex\":1}]",
            //     "groupName": null,
            //     "idCardType": null,
            //     "orderTime": "2020-12-12 09:30-11:30",
            //     "phone": "132****5678",
            //     "name": "天龙",
            //     "musInterval": {
            //         "id": "297e630176229485017622a1e7030011",
            //         "createtime": "2020-12-02T08:46:44.000+0000",
            //         "creatorid": "8a7aefc36d1df87b016d1e0444900041",
            //         "creator": "朱乾乾",
            //         "edittime": "2020-12-09T10:35:51.000+0000",
            //         "editorid": "8a7aefc36d1df87b016d1e0444900041",
            //         "editor": "朱乾乾",
            //         "version": 2,
            //         "intStartTime": "2020-12-02T01:30:40.000+0000",
            //         "intEndTime": "2020-12-02T03:30:40.000+0000",
            //         "intervalShow": "09:30-11:30",
            //         "stopIntTime": "2020-12-02T03:00:40.000+0000",
            //         "stopIntTimeShow": "11:00",
            //         "nums": 100,
            //         "applyTime": "7",
            //         "applyTimeShow": "周六",
            //         "appoType": 0,
            //         "belongTo": null,
            //         "type": 0,
            //         "tempStartDate": null,
            //         "tempEndDate": null,
            //         "enable": 1,
            //         "tempId": "297e630176229485017622a1e7030011"
            //     },
            //     "isGuide": null,
            //     "visitDate": "2020-12-12",
            //     "id": "297e63017650dcde0176510e69960004",
            //     "state": 0
            // }
        }
    },
    created: function () {
        if (this.successData.peerInfo && this.successData.peerInfo != '') {
            this.successData.peerInfo = JSON.parse(this.successData.peerInfo);
        } else {
            this.successData.peerInfo = [];
        }
    },

    mounted: function () {
        this.$notify({
            message: '预约成功',
            color: '#FFF',
            background: '#B3312A',
        });
    },
    methods: {
        clickBack() {
            _toLogin();
        }
    }
});
/***************************    step4结束    ****************************************/


/***************************    整体组件信息开始    ****************************************/
var app = new Vue({
    el: '#fg-app',
    components: {},
    data: {
        stepIndex: 0,
        stepData1: null,
        stepData2: null,
        serverDate: null,
        successData: null,
        userInfo: null
    },
    watch: {},
    created: function () {
        this.getUserInfo();
        !relations && this.getRelations();
        !idCardTypes && this.getIdCardTypes();
    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
        this.getServerTIme();
    },
    methods: {
        doLoading(flag) {
            doFgLoading(this, flag);
        },
        getUserInfo: function () {
            // this.doLoading(true);
            _reqGetUserInfo(function (err, resp) {
                // this.doLoading(false);
                if (err) return;
                if (resp.code == 200) {
                    this.userInfo = resp.data;
                } else {
                    this.$toast(resp.message);
                }
            }.bind(this));
        },
        getRelations: function () {
            _reqGetRelations(function (err, data) {
                if (!err) {
                    relations = data.filter(function (val) {
                        return val.value != 0;
                    });
                    for (var i = 0; i < relations.length; i++) {
                        relationsMap[relations[i].label] = relations[i].value;
                        relationsMap1[relations[i].value] = relations[i].label;
                        relationsMap2[relations[i].value] = relations[i].id;
                    }
                }
            })
        },
        getIdCardTypes: function () {
            _reqGetIdCardTypes(function (err, data) {
                if (!err) {
                    idCardTypes = data;
                    for (var i = 0; i < data.length; i++) {
                        idCardTypesMap[data[i].name] = data[i].code;
                        idCardTypesMap1[data[i].code] = data[i].name;
                        idCardTypesMap2[data[i].code] = data[i].id;
                    }
                }
            });
        },

        setSuccessData: function (data) {
            this.successData = data;
        },

        getServerTIme: function () {
            this.doLoading(true);
            _reqGetServerTime(function (data) {
                this.doLoading(false);
                this.stepIndex = 1;
                this.serverDate = new Date(data);
            }.bind(this))
        },

        changeStep: function () {
            this['stepData' + arguments[1]] = arguments[0];
        },

        doClickStepNext: function (i) {
            this.stepIndex = i;
        },
        doClickStepPrev: function (i) {
            if (i == 1) {
                this.stepData2 = null;
            }
            this.stepIndex = i;
        }

    }
});
/***************************    整体组件信息结束    ****************************************/
