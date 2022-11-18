// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, "findIndex", {
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== "function") {
        throw new TypeError("predicate must be a function");
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
  });
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function (func, thisArg) {
    "use strict";
    if (!((typeof func === "Function" || typeof func === "function") && this))
      throw new TypeError();

    var len = this.length >>> 0,
      res = new Array(len), // preallocate array
      t = this,
      c = 0,
      i = -1;
    if (thisArg === undefined) {
      while (++i !== len) {
        // checks to see if the key was set
        if (i in this) {
          if (func(t[i], i, t)) {
            res[c++] = t[i];
          }
        }
      }
    } else {
      while (++i !== len) {
        // checks to see if the key was set
        if (i in this) {
          if (func.call(thisArg, t[i], i, t)) {
            res[c++] = t[i];
          }
        }
      }
    }

    res.length = c; // shrink down array to proper size
    return res;
  };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function (callback /*, thisArg*/) {
    var T, A, k;

    if (this == null) {
      throw new TypeError("this is null or not defined");
    }

    // 1. Let O be the result of calling ToObject passing the |this|
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let A be a new array created as if by the expression new Array(len)
    //    where Array is the standard built-in constructor with that name and
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {
      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal
        //     method of callback with T as the this value and argument
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}

//数组功能扩展
//数组迭代函数
Array.prototype.each = function (fn) {
  fn = fn || Function.K;
  var a = [];
  var args = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < this.length; i++) {
    var res = fn.apply(this, [this[i], i].concat(args));
    if (res != null) a.push(res);
  }
  return a;
};
//数组是否包含指定元素
Array.prototype.contains = function (suArr) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == suArr) {
      return true;
    }
  }
  return false;
};

//不重复元素构成的数组
Array.prototype.uniquelize = function () {
  var ra = new Array();
  for (var i = 0; i < this.length; i++) {
    if (!ra.contains(this[i])) {
      ra.push(this[i]);
    }
  }
  return ra;
};
//两个数组的交集
Array.intersect = function (a, b) {
  return a.uniquelize().each(function (o) {
    return b.contains(o) ? o : null;
  });
};
//两个数组的差集
Array.minus = function (a, b) {
  return a.uniquelize().each(function (o) {
    return b.contains(o) ? null : o;
  });
};
//两个数组的补集
Array.complement = function (a, b) {
  return Array.minus(Array.union(a, b), Array.intersect(a, b));
};
//两个数组并集
Array.union = function (a, b) {
  return a.concat(b).uniquelize();
};

function validateIdCard(idCard) {
  var vcity = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外",
  };
  //是否为空
  if (idCard === "") {
    return false;
  }
  //校验长度，类型
  if (isCardNo(idCard) === false) {
    return false;
  }
  //检查省份
  if (checkProvince(idCard, vcity) === false) {
    return false;
  }
  //校验生日
  if (checkBirthday(idCard) === false) {
    return false;
  }
  //检验位的检测
  if (checkParity(idCard) === false) {
    return false;
  }
  return true;
}

function isCardNo(card) {
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    return false;
  }
  return true;
}

function checkProvince(card, vcity) {
  var province = card.substr(0, 2);
  if (vcity[province] == undefined) {
    return false;
  }
  return true;
}

function checkBirthday(card) {
  var len = card.length;
  //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
  if (len == "15") {
    var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    var arr_data = card.match(re_fifteen);
    var year = arr_data[2];
    var month = arr_data[3];
    var day = arr_data[4];
    var birthday = new Date("19" + year + "/" + month + "/" + day);
    return verifyBirthday("19" + year, month, day, birthday);
  }
  //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
  if (len == "18") {
    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/;
    var arr_data = card.match(re_eighteen);
    var year = arr_data[2];
    var month = arr_data[3];
    var day = arr_data[4];
    var birthday = new Date(year + "/" + month + "/" + day);
    return verifyBirthday(year, month, day, birthday);
  }
  return false;
}

function verifyBirthday(year, month, day, birthday) {
  var now = new Date();
  var now_year = now.getFullYear();
  //年月日是否合理
  if (
    birthday.getFullYear() == year &&
    birthday.getMonth() + 1 == month &&
    birthday.getDate() == day
  ) {
    //判断年份的范围（0岁到100岁之间)
    var time = now_year - year;
    if (time >= 0 && time <= 150) {
      return true;
    }
    return false;
  }
  return false;
}

function checkParity(card) {
  //15位转18位
  card = changeFivteenToEighteen(card);
  var len = card.length;
  if (len == "18") {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array(
      "1",
      "0",
      "X",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2"
    );
    var cardTemp = 0,
      i,
      valnum;
    for (i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    valnum = arrCh[cardTemp % 11];
    if (valnum == card.substr(17, 1).toLocaleUpperCase()) {
      return true;
    }
    return false;
  }
  return false;
}

function changeFivteenToEighteen(card) {
  if (card.length == "15") {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array(
      "1",
      "0",
      "X",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2"
    );
    var cardTemp = 0,
      i;
    card = card.substr(0, 6) + "19" + card.substr(6, card.length - 6);
    for (i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    card += arrCh[cardTemp % 11];
    return card;
  }
  return card;
}

function validatePhone(phone) {
  return /^(1)\d{10}$/.test(phone);
}

function validateCarNum(cardNum) {
  return /^[0-9a-zA-Z\s]{6,20}$/.test(cardNum);
}

/**
 * 设置LocalStorage
 * @param name
 * @param value
 */
function setLocalStorageItem(name, value) {
  if (!value) {
    value = "";
  }
  window.localStorage.setItem(name, value);
}

/*
获取LocalStorage中的值
*/
function getLocalStorageItem(objName) {
  //获取指定名称的cookie的值
  var value = window.localStorage.getItem(objName);
  if ("" === value) return undefined;
  return window.localStorage.getItem(objName);
}

function percentage(n) {
  n *= 100;
  return n > 100 ? 100 : n < 0 ? 0 : Math.round(parseFloat(n));
}

function formatDate(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  return y + "年" + m + "月" + d + "日";
}

function getIDAge(idCard, date) {
  //获取年龄
  date = date || new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var age = date.getFullYear() - idCard.substring(6, 10) - 1;
  if (
    idCard.substring(10, 12) < month ||
    (idCard.substring(10, 12) == month && idCard.substring(12, 14) <= day)
  ) {
    age++;
  }
  return age;
}

function createObjectURL(object) {
  return window.URL
    ? window.URL.createObjectURL(object)
    : window.webkitURL.createObjectURL(object);
}

function timeToMinute(times) {
  var t;
  if (times > -1) {
    var hour = Math.floor(times / 3600);
    var min = Math.floor(times / 60) % 60;
    var sec = times % 60;
    if (hour < 10) {
      t = "0" + hour + ":";
    } else {
      t = hour + ":";
    }

    if (min < 10) {
      t += "0";
    }
    t += min + ":";
    if (sec < 10) {
      t += "0";
    }
    t += sec.toFixed(2);
  }
  t = t.substring(0, t.length - 3);
  return t;
}
