"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var throttle = require("lodash.throttle");
var vscode_1 = require("vscode");
var leekConfig_1 = require("../../shared/leekConfig");
var FlashNewsDaemon_1 = require("./FlashNewsDaemon");
var FlashNewsOutputServer = /** @class */ (function () {
    function FlashNewsOutputServer() {
        this.newsCount = 0;
        this.isEnableOutput = false;
        this.newsCache = [];
        this.isEnableOutput = leekConfig_1.LeekFundConfig.getConfig('leek-fund.flash-news');
        this.updateNewsBarItem = throttle(this.updateNewsBarItem, 1000);
        this.setup();
    }
    FlashNewsOutputServer.prototype.setup = function () {
        if (this.isEnableOutput) {
            this.op = vscode_1.window.createOutputChannel('果子哥理财 - 快讯');
            this.flashNewsBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 3);
            this.flashNewsBarItem.text = "\u26A1\uFE0F\uFE0F " + this.newsCount;
            this.flashNewsBarItem.command = 'leek-fund.flash-news-show';
            this.flashNewsBarItem.show();
            this.unregisterServer = FlashNewsDaemon_1.default.registerServer(this);
        }
    };
    FlashNewsOutputServer.prototype.reload = function () {
        var _enable = leekConfig_1.LeekFundConfig.getConfig('leek-fund.flash-news');
        if (this.isEnableOutput !== _enable) {
            this.isEnableOutput = _enable;
            if (!_enable) {
                this.destroy();
            }
            else {
                this.setup();
            }
        }
    };
    FlashNewsOutputServer.prototype.destroy = function () {
        var _a, _b, _c;
        this.newsCount = 0;
        this.newsCache.length = 0;
        (_a = this.unregisterServer) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this.op) === null || _b === void 0 ? void 0 : _b.dispose();
        (_c = this.flashNewsBarItem) === null || _c === void 0 ? void 0 : _c.dispose();
    };
    FlashNewsOutputServer.prototype.print = function (news) {
        var _a;
        if (!this.isEnableOutput)
            return;
        this.newsCount++;
        this.newsCache.push(news);
        this.newsCache = this.newsCache.slice(-5);
        this.updateNewsBarItem();
        (_a = this.op) === null || _a === void 0 ? void 0 : _a.appendLine(news + "\r\n-----------------------------");
    };
    FlashNewsOutputServer.prototype.updateNewsBarItem = function () {
        if (this.flashNewsBarItem) {
            this.flashNewsBarItem.text = "\u26A1\uFE0F\uFE0F " + this.newsCount;
            this.flashNewsBarItem.tooltip = "" + this.newsCache.join('\r\n-----------------------------\r\n');
            this.flashNewsBarItem.show();
        }
    };
    FlashNewsOutputServer.prototype.showOutput = function () {
        var _a;
        (_a = this.op) === null || _a === void 0 ? void 0 : _a.show();
        this.newsCount = 0;
        if (this.flashNewsBarItem) {
            this.flashNewsBarItem.text = "\u26A1\uFE0F\uFE0F " + this.newsCount;
            this.flashNewsBarItem.show();
        }
    };
    return FlashNewsOutputServer;
}());
exports.default = FlashNewsOutputServer;
//# sourceMappingURL=FlashNewsOutputServer.js.map