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

var idCardTypes;
var idCardTypesMap = {};
var idCardTypesMap1 = {};
var idCardTypesMap2 = {};


var groupTypes;
var groupTypesMap = {};
var groupTypesMap1 = {};
var groupLimit = {groupMinNum: undefined, groupMaxNum: undefined};
var yyJJMap = {
    0: '30分钟讲解服务',
    1: '60分钟讲解服务',
    2: '60分钟以上讲解服务'
};

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
        groupInfo: {
            handler: function (val, oldVal) {
                this.changeStepData();
            },
            deep: true //true 深度监听
        },
        fileList: {
            handler: function (val, oldVal) {
                this.changeStepData();
            },
            deep: true //true 深度监听
        },
        'yyTxShow': function (val, oldVal) {
            if (!val) {
                // // this.txEditData = null;
                // this.txEditIndex = -1;
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
            checkboxShow: true,
            groupInfoShow: false,   // 弹出添加资质弹出框
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

            groupInfo: {
                groupName: '',
                groupTypeIndex: -1,
                groupType: '',
                companyCode: '',
                deptName: '',
                licenseId: null
            },
            groupInfoValid: false,
            editGroupInfo: null,

            txEditData: null,
            txEditIndex: -1,
            yyJJMap: yyJJMap,

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
            groupTypeColumns: [],
            // cardTypeArr: [],
            txArr: [],
            showSexPicker: false,
            showCardTypePicker: false,

            showSexPicker1: false,
            showCardTypePicker1: false,
            showRelationPicker1: false,

            showGroupTypePicker2: false,

            showOldSure: false,     // 显示老人警告框
            sexMap1: sexMap1,
            relationsMap1: {},
            idCardTypesMap1: {},
            groupTypesMap: {},
            ageType: 0,     // 0 检测不到年龄  1 小于13岁 2 大于13小于17 3 大于17 到70    4 大于70

            groupLimit: groupLimit,
            tempFileList: [],
            fileList: [],
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
        this.groupTypeColumns = groupTypes.map(function (val) {
            return val.name;
        }.bind(this));
        this.relationsMap1 = relationsMap1;
        this.idCardTypesMap1 = idCardTypesMap1;
        this.groupTypesMap = groupTypesMap;
        this.groupLimit = groupLimit;

        this.props = this.stepData1.data.props ? this.stepData1.data.props.split(',') : [];
        if (this.stepData2) {
            this.data = this.stepData2.data;
            this.editData = JSON.parse(JSON.stringify(this.data));
            this.groupInfo = this.stepData2.groupInfo;
            this.dataValid = true;
            this.groupInfoValid = true;
            this.fileList = this.stepData2.fileList;
            this.txArr = this.stepData2.txArr;
            this.actProps = this.stepData2.actProps;
            this.checkboxShow = this.stepData2.checkboxShow;
            this.canCheck = this.stepData2.canCheck;
        } else {
            this.groupInfo.groupTypeIndex = 0;
            this.groupInfo.groupType = groupTypes[0].id;
        }
    },

    mounted: function () {
    },
    methods: {
        clickEditActProps() {
            this.checkboxShow = true;
        },

        changeCheckboxGroup(values) {
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

        beforeRead(file) {
            var isImage = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/pjpeg' || file.type === 'image/x-png' || file.type === 'image/png';
            var isLt = file.size / 1024 < 800;
            if (!isImage) {
                this.$toast('营业执照或带队人工作证图片格式应为png/jpeg/png!');
                return false;
            }
            if (!isLt) {
                this.$toast('营业执照或带队人工作证图片大小应在800kb以下!');
                return false;
            }
            return true;
        },
        afterRead(file) {
            file.status = 'uploading';
            file.message = '上传中...';
            _reqPostFile(function (err, data) {
                if (err) {
                    file.status = 'failed';
                    file.message = '上传失败';
                    this.$toast("failed");
                    return;
                }
                if (data.state == 0) {
                    file.status = 'success';
                    this.editGroupInfo.licenseId = data.data;
                } else {
                    file.status = 'failed';
                    file.message = '上传失败';
                    this.$toast(data.message);
                }
            }.bind(this), {
                file: file.file
            });

            // setTimeout(() => {
            //     file.status = 'success';
            //     file.message = '上传失败';
            // }, 1000);
        },
        deleteFile() {
            this.editGroupInfo.licenseId = null;
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
            if (!val || val == '') {
                return false;
            }
            if (this.txEditData.cardType == '001') {
                return validateIdCard(val);
            } else {
                return validateCarNum(val);;
            }
        },
        // 校验证件号
        validatorIdCard1(val) {
            if (this.data.cardNum == val) {
                return false;
            }
            return !this.txArr.filter(function (v, i) {
                return i != app.$refs.step2.txEditIndex;
            }).some(v => v.cardNum == val);
        },
        // 校验手机号1
        validatorPhone1(val) {
            if (!val || val == '') {
                return true;
            }
            return validatePhone(val);
        },

        // 非空校验
        validatorNonEmpty(val) {
            return !(!val || val == '');
        },
        // 非空校验
        validatorCompanyCode(val) {
            return val && /^[a-zA-Z0-9]{6,20}$/.test(val);
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


        onGroupTypeConfirm2(val, index) {
            this.editGroupInfo.groupTypeIndex = index;
            this.editGroupInfo.groupType = groupTypesMap1[val];
            this.showGroupTypePicker2 = false;
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

        //添加资质
        yyPopup2() {
            this.tempFileList = JSON.parse(JSON.stringify(this.fileList));
            this.editGroupInfo = JSON.parse(JSON.stringify(this.groupInfo));
            this.groupInfoShow = true;
        },
        onYYFormFailed2(errorInfo) {
            console.log('failed', errorInfo);
        },
        onYYFormSubmit2(vals) {
            if (!this.editGroupInfo.licenseId) {
                this.$toast('营业执照或带队人工作证未上传！');
                return;
            }
            this.fileList = JSON.parse(JSON.stringify(this.tempFileList));
            this.groupInfo = JSON.parse(JSON.stringify(this.editGroupInfo));
            this.groupInfoValid = true;
            this.groupInfoShow = false;
        },
        clickCancelChangeData2() {
            this.editGroupInfo = JSON.parse(JSON.stringify(this.groupInfo));
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
                message: '该操作可能会删除你的该团体成员信息！',
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
                groupInfo: this.groupInfo,
                fileList: this.fileList,
                actProps: this.actProps,
                checkboxShow: this.checkboxShow,
                canCheck: this.canCheck
            }, 2);
        },


        doClickNext: function (i) {
            if ((this.data.cardType == '001' && this.ageType != 3) || this.data.cardType != '001') {
                this.$toast('预约人非身份证、年龄小于于18周岁或者大于70周岁(包含)不能预约');
                return;
            }
            if (!this.groupInfoValid) {
                this.$toast("请先添加团体资质");
            } else if (this.txArr.length < (this.groupLimit.groupMinNum - 1)) {
                this.$toast('团体成员小于成员最少限制' + this.groupLimit.groupMinNum + '人');
            } else if (this.txArr.length > (this.groupLimit.groupMaxNum - 1)) {
                this.$toast('团体成员大于成员最多限制' + this.groupLimit.groupMaxNum + '人');
            } else {
                this.changeStepData();
                this.$emit('step-next', i);
            }
        },
        doClickPrev: function (i) {
            // this.$emit('step-prev', i);
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
            yyJJMap: yyJJMap,
            groupInfo: null,
            mzShow: false,
            sexMap1: sexMap1,
            relationsMap1: {},
            idCardTypesMap1: {},
            sureLoading: false,
            sureBack: null,
            groupTypesMap: {},
            fileList: []
        }
    },
    created: function () {
        this.groupInfo = this.stepData2.groupInfo,
            this.relationsMap1 = relationsMap1;
        this.idCardTypesMap1 = idCardTypesMap1;
        this.groupTypesMap = groupTypesMap;
        this.fileList = this.stepData2.fileList;
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
                var groupInfo = this.stepData2.groupInfo;
                var actProps = this.stepData2.actProps;
                var txArr = JSON.parse(JSON.stringify(this.stepData2.txArr));
                txArr = txArr.map(function (val) {
                    return {
                        appoType: 3,
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
                _reqSendActGroup(function (err, data) {
                    this.sureLoading = false;
                    if (err) return;
                    if (data.state == 0) {
                        this.$emit('success-data', data.data);
                        this.$emit('step-next', i);
                    } else {
                        this.$toast(data.message);
                    }
                }.bind(this), {
                    appoType: 3,
                    name: data.name,
                    isGuide: this.stepData1.isGuide,
                    guideLength: this.stepData1.guideTime,
                    groupName: groupInfo.groupName,
                    groupType: {
                        id: groupInfo.groupType
                    },
                    deptName: groupInfo.deptName,
                    companyCode: groupInfo.companyCode,
                    licenseId: groupInfo.licenseId,
                    sex: parseInt(data.sex),
                    idCardType: {
                        id: idCardTypesMap2[data.cardType]
                    },
                    idCard: data.cardNum,
                    phone: data.phone,
                    userId: globalUserInfoId(),
                    actRelease: {
                        id: this.stepData1.data.id
                    },
                    actProp:actProps.join(';'),
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
        return {}
    },
    created: function () {
    },

    mounted: function () {
        this.$notify({
            message: '提交成功',
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
        userInfo: null,
    },
    watch: {},
    created: function () {
        !relations && this.getRelations();
        !idCardTypes && this.getIdCardTypes();
        !groupTypes && this.getGroupTypes();
        this.getIdGroupLimitNum();
        this.getUserInfo();
    },
    mounted: function () {
        this.$refs.app.style.display = 'block';
        this.getActDetail();
    },
    methods: {
        doLoading(flag) {
            doFgLoading(this, flag);
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
        getIdGroupLimitNum: function () {
            _reqGetActGroupLimitNum(function (err, data) {
                if (!err) {
                    groupLimit = data;
                }
            });
        },
        getGroupTypes: function () {
            _reqGetGroupTypes(function (err, data) {
                if (!err) {
                    groupTypes = data;
                    for (var i = 0; i < groupTypes.length; i++) {
                        groupTypesMap[groupTypes[i].id] = groupTypes[i].name;
                        groupTypesMap1[groupTypes[i].name] = groupTypes[i].id;
                    }
                }
            })
        },


        setSuccessData: function (data) {
            this.successData = data;
        },

        getActDetail: function () {
            var actId = getURLParam('id');
            var type = getURLParam('type') || 0;
            if (!actId) {
                alert('活动载入出错');
            }
            this.doLoading(true);
            _reqGetActDetail(function (err, data) {
                this.doLoading(false);
                if (err) {
                    alert('活动载入出错');
                    return;
                }
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
        doClickStepPrev: function (i) {
            if (i == 1) {
                this.stepData2 = null;
            }
            this.stepIndex = i;
        }


    }
});
/***************************    整体组件信息结束    ****************************************/