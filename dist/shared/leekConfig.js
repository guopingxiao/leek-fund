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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeekFundConfig = exports.BaseConfig = void 0;
var vscode_1 = require("vscode");
var utils_1 = require("./utils");
var BaseConfig = /** @class */ (function () {
    function BaseConfig() {
    }
    BaseConfig.getConfig = function (key, defaultValue) {
        var config = vscode_1.workspace.getConfiguration();
        var value = config.get(key);
        return value === undefined ? defaultValue : value;
    };
    BaseConfig.setConfig = function (cfgKey, cfgValue) {
        utils_1.events.emit('updateConfig:' + cfgKey, cfgValue);
        var config = vscode_1.workspace.getConfiguration();
        return config.update(cfgKey, cfgValue, true);
    };
    BaseConfig.updateConfig = function (cfgKey, codes) {
        var config = vscode_1.workspace.getConfiguration();
        var updatedCfg = __spreadArrays(config.get(cfgKey, []), codes);
        var newCodes = utils_1.clean(updatedCfg);
        newCodes = utils_1.uniq(newCodes);
        return config.update(cfgKey, newCodes, true);
    };
    BaseConfig.removeConfig = function (cfgKey, code) {
        var config = vscode_1.workspace.getConfiguration();
        var sourceCfg = config.get(cfgKey, []);
        var newCfg = sourceCfg.filter(function (item) { return item !== code; });
        return config.update(cfgKey, newCfg, true);
    };
    return BaseConfig;
}());
exports.BaseConfig = BaseConfig;
var LeekFundConfig = /** @class */ (function (_super) {
    __extends(LeekFundConfig, _super);
    function LeekFundConfig() {
        return _super.call(this) || this;
    }
    // Fund Begin
    LeekFundConfig.updateFundCfg = function (codes, cb) {
        this.updateConfig('leek-fund.funds', codes.split(',')).then(function () {
            vscode_1.window.showInformationMessage("Fund Successfully add.");
            if (cb && typeof cb === 'function') {
                cb(codes);
            }
        });
    };
    LeekFundConfig.removeFundCfg = function (code, cb) {
        this.removeConfig('leek-fund.funds', code).then(function () {
            vscode_1.window.showInformationMessage("Fund Successfully delete.");
            if (cb && typeof cb === 'function') {
                cb(code);
            }
        });
    };
    LeekFundConfig.setFundTopCfg = function (code, cb) {
        var configArr = this.getConfig('leek-fund.funds');
        configArr = __spreadArrays([code], configArr.filter(function (item) { return item !== code; }));
        this.setConfig('leek-fund.funds', configArr).then(function () {
            vscode_1.window.showInformationMessage("Fund successfully set to top.");
            if (cb && typeof cb === 'function') {
                cb(code);
            }
        });
    };
    // Fund End
    // Stock Begin
    LeekFundConfig.updateStockCfg = function (codes, cb) {
        this.updateConfig('leek-fund.stocks', codes.split(',')).then(function () {
            vscode_1.window.showInformationMessage("Stock Successfully add.");
            if (cb && typeof cb === 'function') {
                cb(codes);
            }
        });
    };
    LeekFundConfig.removeStockCfg = function (code, cb) {
        this.removeConfig('leek-fund.stocks', code).then(function () {
            vscode_1.window.showInformationMessage("Stock Successfully delete.");
            if (cb && typeof cb === 'function') {
                cb(code);
            }
        });
    };
    LeekFundConfig.setStockTopCfg = function (code, cb) {
        var configArr = this.getConfig('leek-fund.stocks');
        configArr = __spreadArrays([code], configArr.filter(function (item) { return item !== code; }));
        this.setConfig('leek-fund.stocks', configArr).then(function () {
            vscode_1.window.showInformationMessage("Stock successfully set to top.");
            if (cb && typeof cb === 'function') {
                cb(code);
            }
        });
    };
    // Stock End
    // StatusBar Begin
    LeekFundConfig.updateStatusBarStockCfg = function (codes, cb) {
        this.setConfig('leek-fund.statusBarStock', codes).then(function () {
            vscode_1.window.showInformationMessage("Status Bar Stock Successfully update.");
            if (cb && typeof cb === 'function') {
                cb(codes);
            }
        });
    };
    return LeekFundConfig;
}(BaseConfig));
exports.LeekFundConfig = LeekFundConfig;
//# sourceMappingURL=leekConfig.js.map