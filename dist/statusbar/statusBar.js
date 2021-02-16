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
exports.StatusBar = void 0;
var vscode_1 = require("vscode");
var globalState_1 = require("../globalState");
var constant_1 = require("../shared/constant");
var leekConfig_1 = require("../shared/leekConfig");
var utils_1 = require("../shared/utils");
var StatusBar = /** @class */ (function () {
    function StatusBar(stockService, fundService) {
        this.statusBarList = [];
        this.statusBarItemLabelFormat = '';
        this.stockService = stockService;
        this.fundService = fundService;
        this.statusBarList = [];
        this.fundBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 3);
        this.refreshStockStatusBar();
        this.bindEvents();
        /* events.on('updateConfig:leek-fund.statusBarStock',()=>{
    
        }) */
    }
    Object.defineProperty(StatusBar.prototype, "riseColor", {
        get: function () {
            return leekConfig_1.LeekFundConfig.getConfig('leek-fund.riseColor');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StatusBar.prototype, "fallColor", {
        get: function () {
            return leekConfig_1.LeekFundConfig.getConfig('leek-fund.fallColor');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StatusBar.prototype, "hideStatusBarStock", {
        /** 隐藏股市状态栏 */
        get: function () {
            return leekConfig_1.LeekFundConfig.getConfig('leek-fund.hideStatusBarStock');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StatusBar.prototype, "hideFundBarItem", {
        /** 隐藏基金状态栏 */
        get: function () {
            return leekConfig_1.LeekFundConfig.getConfig('leek-fund.hideFundBarItem');
        },
        enumerable: false,
        configurable: true
    });
    StatusBar.prototype.bindEvents = function () {
        var _this = this;
        utils_1.events.on('stockListUpdate', function () {
            _this.refreshStockStatusBar();
        });
        utils_1.events.on('fundListUpdate', function () {
            _this.refreshFundStatusBar();
        });
    };
    StatusBar.prototype.refresh = function () {
        this.refreshFundStatusBar();
        // this.statusBarList.forEach((bar) => bar.hide());
        this.refreshStockStatusBar();
    };
    StatusBar.prototype.refreshStockStatusBar = function () {
        var _this = this;
        var _a, _b;
        if (this.hideStatusBarStock || !this.stockService.stockList.length)
            return;
        var sz = null;
        var statusBarStocks = leekConfig_1.LeekFundConfig.getConfig('leek-fund.statusBarStock');
        var barStockList = new Array(statusBarStocks.length);
        this.statusBarItemLabelFormat = (_b = (_a = globalState_1.default.labelFormat) === null || _a === void 0 ? void 0 : _a['statusBarLabelFormat']) !== null && _b !== void 0 ? _b : constant_1.DEFAULT_LABEL_FORMAT.statusBarLabelFormat;
        this.stockService.stockList.forEach(function (stockItem) {
            var code = stockItem.info.code;
            if (code === 'sh000001') {
                sz = stockItem;
            }
            if (statusBarStocks.includes(code)) {
                // barStockList.push(stockItem);
                barStockList[statusBarStocks.indexOf(code)] = stockItem;
            }
        });
        if (!barStockList.length) {
            barStockList.push(sz || this.stockService.stockList[0]);
        }
        var count = barStockList.length - this.statusBarList.length;
        if (count > 0) {
            while (--count >= 0) {
                var stockBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 3);
                this.statusBarList.push(stockBarItem);
            }
        }
        else if (count < 0) {
            var num = Math.abs(count);
            while (--num >= 0) {
                var bar = this.statusBarList.pop();
                bar === null || bar === void 0 ? void 0 : bar.hide();
                bar === null || bar === void 0 ? void 0 : bar.dispose();
            }
        }
        barStockList.forEach(function (stock, index) {
            _this.udpateBarInfo(_this.statusBarList[index], stock);
        });
    };
    StatusBar.prototype.udpateBarInfo = function (stockBarItem, item) {
        if (!item)
            return;
        var _a = item.info, type = _a.type, symbol = _a.symbol, price = _a.price, percent = _a.percent, open = _a.open, yestclose = _a.yestclose, high = _a.high, low = _a.low, updown = _a.updown;
        var deLow = percent.indexOf('-') === -1;
        /* stockBarItem.text = `「${this.stockService.showLabel ? item.info.name : item.id}」${price}  ${
          deLow ? '📈' : '📉'
        }（${percent}%）`; */
        stockBarItem.text = utils_1.formatLabelString(this.statusBarItemLabelFormat, __assign(__assign({}, item.info), { percent: percent + "%", icon: deLow ? '📈' : '📉' }));
        stockBarItem.tooltip = "\u300C\u4ECA\u65E5\u884C\u60C5\u300D" + type + symbol + "\n\u6DA8\u8DCC\uFF1A" + updown + "   \u767E\u5206\uFF1A" + percent + "%\n\u6700\u9AD8\uFF1A" + high + "   \u6700\u4F4E\uFF1A" + low + "\n\u4ECA\u5F00\uFF1A" + open + "   \u6628\u6536\uFF1A" + yestclose;
        stockBarItem.color = deLow ? this.riseColor : this.fallColor;
        stockBarItem.command = {
            title: 'Change stock',
            command: 'leek-fund.changeStatusBarItem',
            arguments: [item.id],
        };
        stockBarItem.show();
        return stockBarItem;
    };
    StatusBar.prototype.refreshFundStatusBar = function () {
        // 隐藏基金状态栏
        if (this.hideFundBarItem)
            return;
        this.fundBarItem.text = "\uD83D\uDC25$(pulse)";
        this.fundBarItem.color = this.riseColor;
        this.fundBarItem.tooltip = this.getFundTooltipText();
        this.fundBarItem.show();
        return this.fundBarItem;
    };
    StatusBar.prototype.getFundTooltipText = function () {
        var fundTemplate = '';
        for (var _i = 0, _a = this.fundService.fundList.slice(0, 14); _i < _a.length; _i++) {
            var fund = _a[_i];
            fundTemplate += (fund.info.percent.indexOf('-') === 0 ? ' ↓ ' : fund.info.percent === '0.00' ? '' : ' ↑ ') + " " + fund.info.percent + "%   \u300C" + fund.info.name + "\u300D\n--------------------------------------------\n";
        }
        // tooltip 有限定高度，所以只展示最多14只基金
        var tips = this.fundService.fundList.length >= 14 ? '（只展示前14只）' : '';
        return "\u300C\u57FA\u91D1\u8BE6\u60C5\u300D\n\n " + fundTemplate + tips;
    };
    return StatusBar;
}());
exports.StatusBar = StatusBar;
//# sourceMappingURL=statusBar.js.map