"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeStocksRemind = void 0;
var vscode_1 = require("vscode");
var globalState_1 = require("../globalState");
var leekCenterView_1 = require("../webview/leekCenterView");
var utils_1 = require("./utils");
function executeStocksRemind(newStockList, oldStockList) {
    if (!oldStockList.length || +globalState_1.default.remindSwitch === 0) {
        return;
    }
    var stocksRemind = globalState_1.default.stocksRemind;
    var remindCodes = Object.keys(stocksRemind);
    var oldStocksMap = {};
    oldStockList.forEach(function (_a) {
        var info = _a.info;
        oldStocksMap[info.code] = info;
    });
    newStockList.forEach(function (stock) {
        try {
            var info_1 = stock.info;
            if (remindCodes.includes(info_1.code)) {
                var oldStockInfo = oldStocksMap[info_1.code];
                var currentPrice_1 = utils_1.multi1000(parseFloat(info_1.price || '0'));
                var currentPrecent_1 = utils_1.multi1000(parseFloat(info_1.percent || '0'));
                var oldPrice_1 = utils_1.multi1000(parseFloat(oldStockInfo.price || '0'));
                var oldPrecent = utils_1.multi1000(parseFloat(oldStockInfo.percent || '0'));
                var priceRange_1 = Math.abs(currentPrice_1 - oldPrice_1);
                var precentRange_1 = Math.abs(currentPrecent_1 - oldPrecent);
                // 如果用 info.updown（当前-昨收） 有可能导致股价从高位回落也上涨触发提醒，或高位回落不下跌不提醒。
                // 所以改由 当前 - 上次
                var currentUpdown_1 = currentPrice_1 - oldPrice_1 >= 0 ? 1 : -1;
                var remindConfig = stocksRemind[info_1.code];
                var remindPrices = remindConfig.price;
                var remindPercents = remindConfig.percent;
                remindPrices.forEach(function (remindPriceStr) {
                    var remindPrice = utils_1.multi1000(parseFloat(remindPriceStr));
                    if (remindPrice / 0 !== currentUpdown_1 / 0) {
                        return;
                    }
                    var marginPrice = Math.abs(currentPrice_1 - Math.abs(remindPrice));
                    /* fix: #136 */
                    if (currentPrice_1 === 0)
                        return;
                    if (priceRange_1 > marginPrice) {
                        console.log('价格提醒:', oldPrice_1, currentPrice_1, remindPrice);
                        showRemindNotice(info_1, "\u80A1\u4EF7\u63D0\u9192\uFF1A\u300C" + info_1.name + "\u300D " + (currentUpdown_1 > 0 ? '上涨' : '下跌') + "\u81F3 " + info_1.price);
                    }
                });
                remindPercents.forEach(function (remindPercentStr) {
                    var remindPercent = utils_1.multi1000(parseFloat(remindPercentStr));
                    if (remindPercent / 0 !== currentUpdown_1 / 0) {
                        return;
                    }
                    var marginPrecent = Math.abs(currentPrecent_1 - remindPercent);
                    /* fix: #136 */
                    if (currentPrecent_1 === 0)
                        return;
                    if (precentRange_1 > marginPrecent) {
                        showRemindNotice(info_1, "\u80A1\u4EF7\u63D0\u9192\uFF1A\u300C" + info_1.name + "\u300D " + (remindPercent >= 0 ? '上涨' : '下跌') + "\u8D85 " + info_1.percent + "%\uFF0C\u73B0\u62A5\uFF1A" + info_1.price);
                    }
                });
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.executeStocksRemind = executeStocksRemind;
var _remindedCache = {};
function showRemindNotice(info, msg) {
    var code = info.code;
    if (_remindedCache[code]) {
        return;
    }
    // 避免波动反复频繁提醒，3分钟内不再提醒
    _remindedCache[code] = true;
    setTimeout(function () {
        _remindedCache[code] = false;
    }, 3000 * 60);
    //TODO 暂时关闭提醒?
    vscode_1.window.showWarningMessage(msg, '删除该股提醒', '关闭所有提醒').then(function (res) {
        switch (res) {
            case '关闭所有提醒':
                vscode_1.commands.executeCommand('leek-fund.toggleRemindSwitch', 0);
                break;
            case '删除该股提醒':
                var newCfg = __assign({}, globalState_1.default.stocksRemind);
                delete newCfg[code];
                leekCenterView_1.setStocksRemindCfgCb(newCfg);
            default:
                break;
        }
    });
}
//# sourceMappingURL=remindNotification.js.map