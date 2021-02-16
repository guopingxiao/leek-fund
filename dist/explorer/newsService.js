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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = exports.NewsTreeItem = void 0;
var axios_1 = require("axios");
var vscode_1 = require("vscode");
var utils_1 = require("../shared/utils");
var NewsTreeItem = /** @class */ (function (_super) {
    __extends(NewsTreeItem, _super);
    function NewsTreeItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NewsTreeItem;
}(vscode_1.TreeItem));
exports.NewsTreeItem = NewsTreeItem;
var NewsService = /** @class */ (function () {
    function NewsService() {
    }
    NewsService.prototype.getNewsUserList = function (userIds) {
        return __awaiter(this, void 0, void 0, function () {
            var treeItems, promiseList, headers, config, xueqiuCookie, _i, userIds_1, userId, url, p, result, _a, result_1, item, user, treeItem, images;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        treeItems = [];
                        promiseList = [];
                        headers = {};
                        config = vscode_1.workspace.getConfiguration();
                        xueqiuCookie = config.get('leek-fund.xueqiuCookie');
                        Object.assign(headers, utils_1.randHeader(), { Cookie: xueqiuCookie });
                        for (_i = 0, userIds_1 = userIds; _i < userIds_1.length; _i++) {
                            userId = userIds_1[_i];
                            url = "https://xueqiu.com/statuses/original/show.json?user_id=" + userId;
                            p = axios_1.default.get(url, { headers: headers });
                            promiseList.push(p.catch(function (err) { return console.log(err); }));
                        }
                        return [4 /*yield*/, Promise.all(promiseList)];
                    case 1:
                        result = _b.sent();
                        for (_a = 0, result_1 = result; _a < result_1.length; _a++) {
                            item = result_1[_a];
                            if (item && item.status === 200) {
                                user = item.data.user;
                                treeItem = new NewsTreeItem(user.screen_name);
                                treeItem.id = "" + user.id;
                                treeItem.tooltip = user.description;
                                images = user.profile_image_url.split(',');
                                treeItem.iconPath = vscode_1.Uri.parse("https:" + user.photo_domain + images[images.length - 1]);
                                treeItem.command = {
                                    title: user.screen_name,
                                    command: 'leek-fund.newItemClick',
                                    arguments: [user.screen_name, user.id],
                                };
                                treeItems.push(treeItem);
                            }
                        }
                        return [2 /*return*/, treeItems];
                }
            });
        });
    };
    NewsService.prototype.getNewsData = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var newsList, url, headers, config, xueqiuCookie, result, statuses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newsList = [];
                        url = "https://xueqiu.com/v4/statuses/user_timeline.json?page=1&user_id=" + userId;
                        headers = {};
                        config = vscode_1.workspace.getConfiguration();
                        xueqiuCookie = config.get('leek-fund.xueqiuCookie');
                        Object.assign(headers, utils_1.randHeader(), { Cookie: xueqiuCookie });
                        return [4 /*yield*/, axios_1.default.get(url, { headers: headers }).catch(function (err) { return console.error(err); })];
                    case 1:
                        result = _a.sent();
                        if (result && result.status === 200) {
                            statuses = result.data.statuses;
                            newsList = __spreadArrays(statuses);
                        }
                        return [2 /*return*/, newsList];
                }
            });
        });
    };
    return NewsService;
}());
exports.NewsService = NewsService;
//# sourceMappingURL=newsService.js.map