"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsProvider = void 0;
var vscode_1 = require("vscode");
var leekConfig_1 = require("../shared/leekConfig");
var newsService_1 = require("./newsService");
var NewsProvider = /** @class */ (function () {
    function NewsProvider() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.service = new newsService_1.NewsService();
    }
    NewsProvider.prototype.refresh = function () {
        this._onDidChangeTreeData.fire(undefined);
    };
    NewsProvider.prototype.getChildren = function () {
        var userIds = leekConfig_1.LeekFundConfig.getConfig('leek-fund.newsUserIds') || [];
        return this.service.getNewsUserList(userIds);
    };
    NewsProvider.prototype.getParent = function (element) {
        return null;
    };
    NewsProvider.prototype.getTreeItem = function (element) {
        return element;
    };
    return NewsProvider;
}());
exports.NewsProvider = NewsProvider;
//# sourceMappingURL=newsProvider.js.map