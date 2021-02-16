"use strict";
/**
 * 收益状态栏显示
 * 目前只支持基金
 * TODO: 股票
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitStatusBar = void 0;
var vscode_1 = require("vscode");
var constant_1 = require("../shared/constant");
var leekConfig_1 = require("../shared/leekConfig");
var utils_1 = require("../shared/utils");
var PREFIX = '💰';
var ProfitStatusBar = /** @class */ (function () {
    function ProfitStatusBar() {
        this.isEnable = false;
        this.unsubscribe = function () { };
        this.fallColor = 'green';
        this.riseColor = 'red';
        this.init();
    }
    ProfitStatusBar.prototype.init = function () {
        var _this = this;
        this.isEnable = leekConfig_1.LeekFundConfig.getConfig('leek-fund.showEarnings');
        if (this.isEnable) {
            this.riseColor = leekConfig_1.LeekFundConfig.getConfig('leek-fund.riseColor');
            this.fallColor = leekConfig_1.LeekFundConfig.getConfig('leek-fund.fallColor');
            this.fundBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 2);
            this.fundBarItem.text = PREFIX + " --";
            this.fundBarItem.command = 'leek-fund.setFundAmount';
            this.fundBarItem.show();
            var profitUpdateListener_1 = function (data) {
                _this.updateFundBarItem(data);
                // this.updateStockBarItem(stockProfit);
            };
            utils_1.events.on('updateBar:profit-refresh', profitUpdateListener_1);
            this.unsubscribe = function () {
                utils_1.events.off('updateBar:profit-refresh', profitUpdateListener_1);
            };
        }
    };
    ProfitStatusBar.prototype.reload = function () {
        this.riseColor = leekConfig_1.LeekFundConfig.getConfig('leek-fund.riseColor');
        this.fallColor = leekConfig_1.LeekFundConfig.getConfig('leek-fund.fallColor');
        var enable = leekConfig_1.LeekFundConfig.getConfig('leek-fund.showEarnings');
        if (this.isEnable !== enable) {
            this.isEnable = enable;
            if (!enable) {
                this.destroy();
            }
            else {
                this.init();
            }
        }
    };
    ProfitStatusBar.prototype.updateFundBarItem = function (_a) {
        var _b = _a.fundProfit, fundProfit = _b === void 0 ? 0 : _b, _c = _a.fundProfitPercent, fundProfitPercent = _c === void 0 ? 0 : _c, _d = _a.fundAmount, fundAmount = _d === void 0 ? 0 : _d, _e = _a.priceDate, priceDate = _e === void 0 ? '' : _e;
        if (this.fundBarItem) {
            this.fundBarItem.text = PREFIX + " " + fundProfit;
            this.fundBarItem.color = fundProfit >= 0 ? this.riseColor : this.fallColor;
            this.fundBarItem.tooltip =
                "\u300C\u57FA\u91D1\u6536\u76CA\u7EDF\u8BA1" + priceDate + "\u300D" +
                    [
                        ,
                        "\u6301\u4ED3\u91D1\u989D\uFF1A" + fundAmount + "\u5143",
                        "\u4ECA\u65E5" + (fundProfit >= 0 ? '盈利' : '亏损') + "\uFF1A" + fundProfit + "\u5143",
                        "\u4ECA\u65E5\u6536\u76CA\u7387\uFF1A" + fundProfitPercent + "%",
                        "" + (fundProfit >= 0
                            ? constant_1.TIPS_WIN[Math.floor(Math.random() * constant_1.TIPS_WIN.length)]
                            : constant_1.TIPS_LOSE[Math.floor(Math.random() * constant_1.TIPS_LOSE.length)]),
                    ].join('\r\n-----------------------------\r\n');
            this.fundBarItem.show();
        }
    };
    // TODO
    // updateStockBarItem(num = 0) {}
    ProfitStatusBar.prototype.destroy = function () {
        var _a;
        this.unsubscribe();
        (_a = this.fundBarItem) === null || _a === void 0 ? void 0 : _a.dispose();
    };
    return ProfitStatusBar;
}());
exports.ProfitStatusBar = ProfitStatusBar;
//# sourceMappingURL=Profit.js.map