/**
 * 获取当前设备信息
 * @returns {string} 设备标识简写
 */
const device = () => {
  // 设备信息
  let u = navigator.userAgent;
  // android终端
  let isAndroid = u.indexOf('Android') > -1;
  // ios终端
  let isIOS = /iPad|iPod|iPhone/i.test(u);
  try {
    if (isAndroid) {
      return 'Android';
    } else if (isIOS) {
      return 'IOS';
    } else {
      return 'PC';
    }
  } catch (e) {
    console.log('获取设备信息出错!')
  }
};

/**
 * 金钱格式化
 * @param money 钱(int)
 * @param digit 四舍五入 保留小数
 * @returns {*} 带小数格式的钱
 */
const fmoney = (money, digit) => {
  !digit ? digit = 2 : null;
  if (money && parseFloat(money) && digit) {
    money = money.toFixed(digit);
    if (null === money) {
      return "";
    }
    money = money + "";
    let array = money.split(".");
    let s = array[0];
    let r = "";
    let m = s.substring(0, 1);
    if ('-' === m) {
      s = s.substring(1);
    } else {
      m = "";
    }
    let f = s.split("").reverse();
    for (let i = 0; i < f.length; i++) {
      r += f[i] + ((i + 1) % 3 === 0 && (i + 1) != f.length ? "," : "");
    }
    let after = "";
    if (array.length > 1) {
      after = array[1];
      if (after.length > digit) {
        after = after.substring(0, digit);
      }
    }
    return m + r.split("").reverse().join("") + (array.length > 1 ? "." + after : "");
  } else {
    return '0.00';
  }
};

/**
 * 时间处理附属，不满10自动添0
 * @param str
 * @param targetLength
 * @returns {*}
 */
const addZeros = (str, targetLength = 2) => {
  while (str.length < targetLength) {
    str = `0${str}`
  }
  return str
};

/**
 * 字符串时间转换成时间戳
 * @param dateStr 支持 2018-11-5 11:24:51 | 2018/11/5 11:24:54 | 2018-11-5T11:25:09.256Z
 * @returns {number} 时间戳
 */
const parseDate = (dateStr) => {
  const rShortMatch = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/,
    rLongMatch = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s*$/,
    rMaxMatch = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2}).*\s*$/,
    rLedMatch = /^\s*(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s*$/;
  let match;

  if (match = dateStr.match(rShortMatch)) {
    return +new Date(+match[1], +match[2] - 1, +match[3])
  } else if (match = dateStr.match(rLongMatch)) {
    return +new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6])
  } else if (match = dateStr.match(rMaxMatch)) {
    return +new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6])
  } else if (match = dateStr.match(rLedMatch)) {
    return +new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6])
  }
};

/**
 * 时间戳转时间字符串
 * @param  {Number} timestamp js时间戳
 * @param  {String} format 输出格式
 * @return {String} Return format result 时间字符串
 */
const formatDate = (timestamp, format = 'YYYY-MM-DD hh:mm:ss') => {
  const date = new Date(timestamp),
    year = `${date.getFullYear()}`,
    month = `${date.getMonth() + 1}`,
    day = `${date.getDate()}`,
    hours = `${date.getHours()}`,
    minutes = `${date.getMinutes()}`,
    seconds = `${date.getSeconds()}`,
    rMatch = /Y+|M+|D+|h+|m+|s+|S+/g;

  return format.replace(rMatch, match => {
    const len = match.length;

    switch (match[0]) {
      case 'Y':
        return year.slice(-len);
      case 'M':
        return addZeros(month).slice(-len);
      case 'D':
        return addZeros(day).slice(-len);
      case 'h':
        return addZeros(hours).slice(-len);
      case 'm':
        return addZeros(minutes).slice(-len);
      case 's':
        return addZeros(seconds).slice(-len)
    }
  })
};

/**
 * 获取地址栏参数
 * @param name 参数名
 * @returns {*} value
 * @constructor
 */
const GetQueryString = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let href = window.location.href;
  let r = href.slice(href.indexOf('?'), href.length).substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

/**
 * 计算机计算噪点误差修复
 * @type {{Add: (function(*, *): number), Sub: (function(*, *=): *), Mul: (function(*, *=): number), Div: (function(*, *=): number)}}
 */
const calc = {
  /*
  函数，加法函数，用来得到精确的加法结果
  说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  参数：numMap：要计算的数组['24.79', '0.72', 1.77]；d：保留默认小数，默认2位。
  调用：Calc.Add(numMap, d)
  返回值：多数相加的结果
  */
  Add: function (numMap, d) {
    d = d ? d : 2;
    let allMap = [], maxLen = 0, pow = 0;
    for (let i = 0; i < numMap.length; i++) {
      if (Object.prototype.toString.call(allMap[i]) !== '[object Object]') {
        allMap[i] = {
          num: '',
          numArr: '',
          d1: '',
        }
      }
      allMap[i].num = numMap[i].toString();
      allMap[i].numArr = allMap[i].num.split(".");
      allMap[i].d1 = allMap[i].numArr.length == 2 ? allMap[i].numArr[1] : "";
    }
    for (let i = 0; i < allMap.length; i++) {
      maxLen = maxLen.length > allMap[i].d1.length ? maxLen : allMap[i].d1;
    }
    maxLen = maxLen.length;
    pow = Math.pow(10, maxLen);
    let resNum = 0;
    for (let i = 0; i < allMap.length; i++) {
      resNum += allMap[i].num * pow;
    }
    let result = Number((resNum / pow).toFixed(maxLen));
    var d = arguments[d];
    return typeof d === "number" ? Number((result).toFixed(d)) : result;
  },
  /*
     函数：减法函数，用来得到精确的减法结果
     说明：函数返回较为精确的减法结果。
     参数：numMap：要计算的数组['24.79', '0.72', 1.77]；d：保留默认小数，默认2位。
     调用：Calc.Sub(numMap, d)
     返回值：两数相减的结果
  */
  Sub: function (numMap, d) {
    d = d ? d : 2;
    let addMap = [];
    for (let i = 0; i < numMap.length; i++) {
      addMap[i] = numMap[i];
      if (i > 0) {
        addMap[i] = -Number(numMap[i]);
      }
    }
    return this.Add(addMap, d);
  },

  /*
  函数：乘法函数，用来得到精确的乘法结果
  说明：函数返回较为精确的乘法结果。
  参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
  调用：Calc.Mul(arg1,arg2)
  返回值：两数相乘的结果
  */
  Mul: function (numMap, d) {
    d = d ? d : 2;
    let resultVal, all = 0, dv = 0;
    for (let i = 0; i < numMap.length; i++) {
      let strNum = numMap[i].toString();
      dv += (strNum.split(".")[1] ? strNum.split(".")[1].length : 0)
      if (all === 0) {
        all = Number(strNum.replace(".", ""));
      } else {
        all *= Number(strNum.replace(".", ""));
      }
    }
    resultVal = all / Math.pow(10, dv);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  },
  /*
  函数：除法函数，用来得到精确的除法结果
  说明：函数返回较为精确的除法结果。
  参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
  调用：Calc.Div(arg1,arg2)
  返回值：arg1除于arg2的结果
  */
  Div: function (numMap, d) {
    d = d ? d : 2;
    let resultVal, all = 0, dv = 0;
    let sort = numMap.length;
    for (let i = 0; i < numMap.length; i++) {
      sort--;
      let strNum = numMap[i].toString();
      let sortStrNum = numMap[sort].toString();
      if (i === 0) {
        dv = (sortStrNum.split(".")[1] ? sortStrNum.split(".")[1].length : 0);
        all = Number(strNum.replace(".", ""));
      } else {
        dv -= (sortStrNum.split(".")[1] ? sortStrNum.split(".")[1].length : 0);
        all = all / Number(strNum.replace(".", ""));
      }
    }
    resultVal = all * Math.pow(10, dv);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  }
};

/**
 * 修改地址栏参数
 * @param url
 * @param arg
 * @param arg_val
 * @returns {*}
 */
const changeURLArg = (url, arg, arg_val) => {
  let pattern = arg + '=([^&]*)';
  let replaceText = arg + '=' + arg_val;
  if (url.match(pattern)) {
    let tmp = '/(' + arg + '=)([^&]*)/gi';
    tmp = url.replace(eval(tmp), replaceText);
    return tmp;
  } else {
    if (url.match('[\?]')) {
      return url + '&' + replaceText;
    } else {
      return url + '?' + replaceText;
    }
  }
};

/**
 * cookie operation
 * @type {{delCookie: (function(*=): (*|void)), setCookie: cookie.setCookie, getCookie: cookie.getCookie}}
 */
const cookie = {
  setCookie: (name, value, expdays) => {
    let expdate = new Date();
    //设置Cookie过期日期
    expdate.setDate(expdate.getDate() + expdays);
    //添加Cookie
    document.cookie = name + "=" + escape(value) + ";expires=" + expdate.toUTCString();
  },
  getCookie: name => {
    //获取name在Cookie中起止位置
    let start = document.cookie.indexOf(name + "=");
    if (start !== -1) {
      start = start + name.length + 1;
      //获取value的终止位置
      let end = document.cookie.indexOf(";", start);
      if (end === -1)
        end = document.cookie.length;
      //截获cookie的value值,并返回
      return document.cookie.substring(start, end);
    }
    return "";
  },
  delCookie: name => this.setCookie(name, "", -1),
};

export default {
  device,
  fmoney,
  parseDate,
  formatDate,
  GetQueryString,
  calc,
  changeURLArg,
  cookie,
}
