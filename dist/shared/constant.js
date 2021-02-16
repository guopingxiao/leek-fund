"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIPS_WIN = exports.TIPS_LOSE = exports.DEFAULT_LABEL_FORMAT = void 0;
/**
 * 默认模板格式
 */
exports.DEFAULT_LABEL_FORMAT = {
    statusBarLabelFormat: '「${name}」${price} ${icon}（${percent}）',
    sidebarStockLabelFormat: '${icon|padRight|4}${percent|padRight|11}${price|padRight|15}「${name}」',
    sidebarFundLabelFormat: '${icon|padRight|4}${percent|padRight}「${name}」${earnings} ${time}',
};
/**
 * 提示语
 * TODO: 丰富模板
 */
exports.TIPS_LOSE = [
    '今晚吃面🍜！',
    '关灯吃面🍜！',
    '稳住，我们能赢！',
    '在A股，稳住才会有收益！',
    '投资其实就是一次心态修炼，稳住心态长期投资都会有收益的！',
];
exports.TIPS_WIN = ['喝汤吃肉！', '吃鸡腿🍗！', '好起来了！', '祝老板吃肉！'];
//# sourceMappingURL=constant.js.map