"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.LeekTreeItem = void 0;
var path_1 = require("path");
var vscode_1 = require("vscode");
var globalState_1 = require("../globalState");
var constant_1 = require("./constant");
var typed_1 = require("./typed");
var utils_1 = require("./utils");
var LeekTreeItem = /** @class */ (function (_super) {
    __extends(LeekTreeItem, _super);
    function LeekTreeItem(info, context, isCategory) {
        if (isCategory === void 0) { isCategory = false; }
        var _a, _b, _c, _d;
        var _this = _super.call(this, '', vscode_1.TreeItemCollapsibleState.None) || this;
        _this.info = info;
        _this.isCategory = isCategory;
        var showLabel = info.showLabel, isStock = info.isStock, name = info.name, code = info.code, type = info.type, symbol = info.symbol, percent = info.percent, price = info.price, open = info.open, yestclose = info.yestclose, high = info.high, low = info.low, updown = info.updown, volume = info.volume, _e = info.amount, amount = _e === void 0 ? 0 : _e, earnings = info.earnings, priceDate = info.priceDate, time = info.time, isStop = info.isStop, t2 = info.t2, contextValue = info.contextValue, _itemType = info._itemType;
        if (_itemType) {
            _this._itemType = _itemType;
        }
        else {
            _this._itemType = isStock ? typed_1.TreeItemType.STOCK : typed_1.TreeItemType.FUND;
        }
        _this.type = type;
        _this.contextValue = contextValue;
        var _percent = Math.abs(percent);
        if (isNaN(_percent)) {
            _percent = '--';
        }
        else {
            _percent = _percent.toFixed(2);
        }
        var icon = 'up';
        var grow = percent.indexOf('-') === 0 ? false : true;
        var val = Math.abs(percent);
        if (grow) {
            if (typed_1.IconType.ARROW === globalState_1.default.iconType) {
                icon = val >= 2 ? 'up' : 'up1';
            }
            else if (typed_1.IconType.FOOD1 === globalState_1.default.iconType) {
                icon = 'meat2';
            }
            else if (typed_1.IconType.FOOD2 === globalState_1.default.iconType) {
                icon = 'kabob';
            }
            else if (typed_1.IconType.FOOD3 === globalState_1.default.iconType) {
                icon = 'wine';
            }
            else if (typed_1.IconType.ICON_FOOD === globalState_1.default.iconType) {
                icon = '🍗';
            }
            _percent = '+' + _percent;
        }
        else {
            if (typed_1.IconType.ARROW === globalState_1.default.iconType) {
                icon = val >= 2 ? 'down' : 'down1';
            }
            else if (typed_1.IconType.FOOD1 === globalState_1.default.iconType) {
                icon = 'noodles';
            }
            else if (typed_1.IconType.FOOD2 === globalState_1.default.iconType) {
                icon = 'bakeleek';
            }
            else if (typed_1.IconType.FOOD3 === globalState_1.default.iconType) {
                icon = 'noodles';
            }
            else if (typed_1.IconType.ICON_FOOD === globalState_1.default.iconType) {
                icon = '🍜';
            }
            _percent = '-' + _percent;
        }
        if (isStop) {
            icon = 'stop';
        }
        var iconPath = '';
        if (showLabel) {
            iconPath =
                globalState_1.default.iconType !== typed_1.IconType.ICON_FOOD
                    ? context === null || context === void 0 ? void 0 : context.asAbsolutePath(path_1.join('resources', icon + ".svg")) : icon;
        }
        var isIconPath = (iconPath === null || iconPath === void 0 ? void 0 : iconPath.lastIndexOf('.svg')) !== -1;
        if (isIconPath && type !== 'nodata') {
            _this.iconPath = iconPath;
        }
        var text = '';
        if (showLabel) {
            /* `showLabel: true` */
            if (_this._itemType === typed_1.TreeItemType.STOCK) {
                var risePercent = isStop ? '停牌' : _percent + "%";
                if (type === 'nodata') {
                    text = info.name;
                }
                else {
                    /* text = `${!isIconPath ? iconPath : ''}${risePercent}${formatTreeText(
                      price,
                      15
                    )}「${name}」`; */
                    text = utils_1.formatLabelString((_b = (_a = globalState_1.default.labelFormat) === null || _a === void 0 ? void 0 : _a['sidebarStockLabelFormat']) !== null && _b !== void 0 ? _b : constant_1.DEFAULT_LABEL_FORMAT.sidebarStockLabelFormat, __assign(__assign({}, info), { icon: !isIconPath ? iconPath : '', percent: risePercent }));
                }
            }
            else if (_this._itemType === typed_1.TreeItemType.FUND) {
                /* text =
                  `${!isIconPath ? iconPath : ''}${formatTreeText(`${_percent}%`)}「${name}」${
                    t2 || !(globalState.showEarnings && amount > 0)
                      ? ''
                      : `(${grow ? '盈' : '亏'}：${grow ? '+' : ''}${earnings})`
                  }` + `${t2 ? `(${time})` : ''}`; */
                text = utils_1.formatLabelString((_d = (_c = globalState_1.default.labelFormat) === null || _c === void 0 ? void 0 : _c['sidebarFundLabelFormat']) !== null && _d !== void 0 ? _d : constant_1.DEFAULT_LABEL_FORMAT.sidebarFundLabelFormat, __assign(__assign({}, info), { icon: !isIconPath ? iconPath : '', percent: _percent + "%", earnings: t2 || !(globalState_1.default.showEarnings && amount > 0)
                        ? ''
                        : "(" + (grow ? '盈' : '亏') + "\uFF1A" + (grow ? '+' : '') + earnings + ")", time: t2 ? "(" + time + ")" : '' }));
                // ${earningPercent !== 0 ? '，率：' + earningPercent + '%' : ''}
            }
        }
        else {
            /* `showLabel: false` */
            text =
                _this._itemType === typed_1.TreeItemType.STOCK
                    ? "" + utils_1.formatTreeText(_percent + "%", 11) + utils_1.formatTreeText(price, 15) + " \u300C" + code + "\u300D"
                    : utils_1.formatTreeText(_percent + "%") + "\u300C" + code + "\u300D";
        }
        _this.label = text;
        _this.id = info.id || code;
        if (_this._itemType === typed_1.TreeItemType.STOCK || _this._itemType === typed_1.TreeItemType.FUND) {
            _this.command = {
                title: name,
                command: _this._itemType === typed_1.TreeItemType.STOCK
                    ? 'leek-fund.stockItemClick'
                    : 'leek-fund.fundItemClick',
                arguments: [
                    _this._itemType === typed_1.TreeItemType.STOCK ? '0' + symbol : code,
                    name,
                    text,
                    "" + type + symbol,
                ],
            };
            if (type === 'nodata') {
                _this.command.command = '';
            }
        }
        if (_this._itemType === typed_1.TreeItemType.STOCK) {
            if (type === 'nodata') {
                _this.tooltip = '接口不支持，右键删除关注';
            }
            else {
                _this.tooltip = "\u3010\u4ECA\u65E5\u884C\u60C5\u3011" + (!showLabel ? name : '') + type + symbol + "\n \u6DA8\u8DCC\uFF1A" + updown + "   \u767E\u5206\u6BD4\uFF1A" + _percent + "%\n \u6700\u9AD8\uFF1A" + high + "   \u6700\u4F4E\uFF1A" + low + "\n \u4ECA\u5F00\uFF1A" + open + "   \u6628\u6536\uFF1A" + yestclose + "\n \u6210\u4EA4\u91CF\uFF1A" + volume + "   \u6210\u4EA4\u989D\uFF1A" + amount;
            }
        }
        else {
            _this.tooltip = "\u300C" + name + "\u300D(" + code + ")";
        }
        return _this;
    }
    return LeekTreeItem;
}(vscode_1.TreeItem));
exports.LeekTreeItem = LeekTreeItem;
//# sourceMappingURL=leekTreeItem.js.map