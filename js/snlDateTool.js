// 获取月份最天数
function getMonthDaysByDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var d = new Date(year, month, 0);
    return d.getDate();
}
function formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '年' + m + '月' + d + '日';
}

function formatDate1(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
}

function formatDate2(date) {
    // var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return m + '月' + d + '日';
}

function formatDay(date) {
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return d;
}

function formatDay1(d) {
    d = d < 10 ? ('0' + d) : d;
    return d;
}
