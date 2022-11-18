_checkCookie();
var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
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
            checkboxShow: true,
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
            canCheck: true,
            actProps: [],
            props: [],
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
        this.props = this.stepData1.data.props ? this.stepData1.data.props.split(',') : [];
        if (this.stepData2) {
            this.data = this.stepData2.data;
            this.editData = JSON.parse(JSON.stringify(this.data));
            this.dataValid = true;
            this.txArr = this.stepData2.txArr;
            this.actProps = this.stepData2.actProps;
            this.checkboxShow = this.stepData2.checkboxShow;
            this.canCheck = this.stepData2.canCheck;
        }
    },

    mounted: function () {
    },
    methods: {
        clickEditActProps() {
            this.checkboxShow = true;
        },

        changeCheckboxGroup(values) {
            console.dir(this.props.filter(function (v) {
                return values.indexOf(v) != -1;
            }));
            this.canCheck = this.props.filter(function (v) {
                    return values.indexOf(v) != -1;
            }).length < this.stepData1.data.checkMaxNum;
        },
        checkboxSubmit() {
            var data = this.stepData1.data;
            if (data.isNeedProps && data.isRequired && !this.actProps.length) {
                this.$toast("至少需要选择一个道具");
                return;
            }
            this.checkboxShow = false;
            this.changeStepData();
        },
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
                return validateCarNum(val);;
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
            }
        },
        // 校验证件号
        validatorIdCard1(val) {
            if (this.data.cardNum == val) {
                return false;
            }
            return !this.txArr.filter(function(v, i){
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
            this.$emit('change-data', {
                data: this.data,
                txArr: this.txArr,
                actProps: this.actProps,
                checkboxShow: this.checkboxShow,
                canCheck: this.canCheck
            }, 2);
        },


        doClickNext: function (i) {
            if (this.data.cardType == '001' && this.ageType < 3) {
                this.txArr = [];
            }
            if (this.data.cardType != '001') {
                this.txArr = [];
            }
            this.$emit('step-next', i);
        },
        doClickPrev: function (i) {
            window.history.go(-1);
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
                var actProps = this.stepData2.actProps;
                var txArr = JSON.parse(JSON.stringify(this.stepData2.txArr));
                txArr = txArr.map(function (val) {
                    return {
                        appoType: 2,
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
                _reqSendActPerson(function (err, data) {
                    this.sureLoading = false;
                    if (err) return;
                    if (data.state == 0) {
                        this.$emit('success-data', data.data);
                        this.$emit('step-next', i);
                    } else {
                        this.$toast(data.message);
                    }
                }.bind(this), {
                    appoType: 2,
                    name: data.name,
                    sex: parseInt(data.sex),
                    idCardType: {
                        id: idCardTypesMap2[data.cardType]
                    },
                    idCard: data.cardNum,
                    phone: data.phone,
                    actRelease: {
                        id: this.stepData1.data.id
                    },
                    actProp:actProps.join(';'),
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
            // successData: {"no":"20201224090466","groupType":"","appointTime":"2020-12-24 10:13","appoType":"个人活动预约","idCard":"411****356","guideLength":null,"qrcode":"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQAAAACFI5MzAAABZUlEQVR42u2YMXYDIQxEtRXH4KYL\r\ne1OOQbWKZhBOnDhNXt6TCvPswnwXsoYZtBb9bcmb/JFMsXVMOVS71GvWjo2ag1Qr8ZrSppwF5V72\r\nnlkIitVxlmG1N37rSEUmoG3fJSERKXpT51RkqW2r6TD+4xwEkuUSNnW+8k8g+bpmvcvr3Ikit3fR\r\nHDyaQZHTq44myBV8MqlP7NmRhF2yEEWuIF2YMZZ/6GsSAqOMtu1i/NAcZLvWzEG1GS10cDyBg2GO\r\nGx3VXuzFX5CCVC+c5xExg76mIUvtFcaYAj6rDiboIo8eW7tvXU1DIDVuM7rZzqOUHMRFRuBxerLt\r\n4akcTvbIidhzu3jyxZN17aNSDOwcVVzteLLvf/WmVp8FMpA1PZnInNkbBihpmoQ8EkVW/unzRBxL\r\n+pJX3ce0ciZChTtcwmhJRXBjDMaefu9oKHG1+cTfVzuzEHfJiY4iArGeHBxH3v9X/S/5AJ2bKCEJ\r\nnHYxAAAAAElFTkSuQmCC","visitNum":1,"enterCutoffTime":"2020-12-21 22:05","ticketSource":"网站","peerInfo":"[]","title":"测试标题","actDate":"2021-01-12","intervalShow":"22:05-23:06","groupName":null,"idCardType":null,"phone":"138****9295","name":"尹贵龙","isGuide":null,"id":"297e6301768ebb990176928560ac0026","state":0}
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
            var actId = getURLParam('id');
            var type = getURLParam('type') || 0;
            if (!actId) {
                alert('活动载入出错');
            }
            this.doLoading(true);
            _reqGetActDetail(function (err, data) {
                this.doLoading(false);
                if (err) return;
                data.data.actDateStr = data.data.actDate.replace('-', '年').replace('-', '月') + '日';
                data.data.appoCutoffTimeStr = data.data.appoCutoffTime.replace('-', '年').replace('-', '月').replace(' ', '日 ')
                data.data.weekday = weekdays[new Date(data.data.actDate.replace(/-/g, '/')).getDay()];
                this.stepData1 = data;
                this.stepIndex = 2;
            }.bind(this), {
                actId: actId,
                type: type
            })
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
