/**
 *
 * 生成随机数
 *
 * @Author: snl
 * @Date: 2020/10/10 10:27
 */
function random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}
