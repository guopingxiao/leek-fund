"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var deviceId = Math.random().toString(16).substr(2) + Math.random().toString(32).substr(2);
var context = undefined;
var telemetry = null;
var iconType = 'arrow';
var fundAmount = {}; // 缓存数据
var fundAmountCacheDate = '2020-10-30'; // 标记缓存时间，解决 VScode 多天都没有关闭时，盈亏计算缓存问题
var stocksRemind = {};
var showEarnings = 1; // 是否展示盈亏
var remindSwitch = 1; // 是否打开提示
var labelFormat = shared_1.DEFAULT_LABEL_FORMAT;
var aStockCount = 0;
var usStockCount = 0;
var hkStockCount = 0;
var noDataStockCount = 0;
var isHolidayChina = false; // 初始化状态，默认是false，免得API有问题，就当它不是好了，可以继续运行
var showStockErrorInfo = true; // 控制只显示一次错误弹窗（临时处理）
var immersiveBackground = true; // 基金图表是否沉浸式背景
var isDevelopment = false; // 是否开发环境
exports.default = {
    context: context,
    telemetry: telemetry,
    iconType: iconType,
    deviceId: deviceId,
    fundAmount: fundAmount,
    fundAmountCacheDate: fundAmountCacheDate,
    showEarnings: showEarnings,
    aStockCount: aStockCount,
    usStockCount: usStockCount,
    hkStockCount: hkStockCount,
    noDataStockCount: noDataStockCount,
    /**
     * 当天是否中国节假日（在插件启动时获取）
     */
    isHolidayChina: isHolidayChina,
    stocksRemind: stocksRemind,
    remindSwitch: remindSwitch,
    labelFormat: labelFormat,
    showStockErrorInfo: showStockErrorInfo,
    immersiveBackground: immersiveBackground,
    isDevelopment: isDevelopment,
};
//# sourceMappingURL=globalState.js.map