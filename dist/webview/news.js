"use strict";
/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2020-08-30 00:29:29
 * @description: 雪球用户动态
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var globalState_1 = require("../globalState");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
var utils_1 = require("../shared/utils");
function openNews(newsService, userId, userName, hideAvatar) {
    if (hideAvatar === void 0) { hideAvatar = false; }
    return __awaiter(this, void 0, void 0, function () {
        var panel, updateWebview;
        var _this = this;
        return __generator(this, function (_a) {
            panel = ReusedWebviewPanel_1.default.create('newsWebview', "News(" + userName + ")", vscode_1.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            updateWebview = function () { return __awaiter(_this, void 0, void 0, function () {
                var newsList, newsListHTML;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, newsService.getNewsData(userId)];
                        case 1:
                            newsList = _a.sent();
                            newsListHTML = xuqiuArticleTemp(newsList, hideAvatar);
                            panel.webview.html = getWebviewContent(newsListHTML);
                            console.log('updateWebview');
                            return [2 /*return*/];
                    }
                });
            }); };
            updateWebview();
            // And schedule updates to the content every 20 seconds
            if (globalState_1.default.newsIntervalTimer) {
                clearInterval(globalState_1.default.newsIntervalTimer);
                globalState_1.default.newsIntervalTimer = null;
            }
            globalState_1.default.newsIntervalTimer = setInterval(updateWebview, globalState_1.default.newsIntervalTime);
            panel.onDidDispose(function () {
                // When the panel is closed, cancel any future updates to the webview content
                clearInterval(globalState_1.default.newsIntervalTimer);
                globalState_1.default.newsIntervalTimer = null;
            }, null);
            return [2 /*return*/];
        });
    });
}
function getWebviewContent(newsListHTML) {
    if (newsListHTML === void 0) { newsListHTML = []; }
    return "\n  <!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>News</title>\n    <style>\n      html {\n        font-family: sans-serif;\n        line-height: 1.15;\n        -ms-text-size-adjust: 100%;\n        -webkit-text-size-adjust: 100%;\n      }\n      body {\n        margin: 0;\n      }\n      .profiles__timeline__container {\n        margin-bottom: 50px;\n      }\n\n      .timeline__item {\n        border-bottom: 1px solid #424344;\n        padding: 15px 0 5px;\n        position: relative;\n        -webkit-animation: fadeIn 0.5s linear;\n        animation: fadeIn 0.5s linear;\n      }\n\n      .timeline__item:after {\n        content: '';\n        display: table;\n        clear: both;\n      }\n\n      .timeline__item > .avatar {\n        float: left;\n      }\n\n      .timeline__item:last-child {\n        border: 0;\n      }\n\n      .timeline__item .fake-anchor {\n        display: none;\n      }\n\n      .timeline__item:hover .timeline__item__stock__unlike {\n        display: block;\n      }\n\n      .timeline__item__main {\n        position: relative;\n        margin-left: 58px;\n      }\n\n      .comment__wrap {\n        margin-bottom: 5px;\n      }\n\n      .timeline__item__info {\n        margin-bottom: 6px;\n      }\n\n      .timeline__item__info .user-name {\n        font-size: 15px;\n        font-weight: 700;\n      }\n\n      .timeline__item__info .date-and-source {\n        font-size: 13px;\n        color: #666c72;\n      }\n\n      .timeline__item__info .date-and-source:hover {\n        color: #a5a2a2;\n      }\n\n      .timeline__item__info .user-auth {\n        margin-left: 4px;\n        width: 15px;\n        height: 15px;\n        vertical-align: middle;\n        vertical-align: -2px;\n      }\n\n      .timeline__item__content .ke_img,\n      .timeline__item__forward .ke_img {\n        display: block;\n        max-width: 100%;\n        margin: 24px auto;\n      }\n\n      .timeline__item__content .content,\n      .timeline__item__forward .content {\n        line-height: 1.6;\n        word-break: break-all;\n        color: #a5a2a2;\n        font-size: 15px;\n      }\n\n      .timeline__item__content .content a,\n      .timeline__item__forward .content a {\n        color: #06c;\n        margin: 0 2px;\n      }\n\n      .timeline__item__content .content a:hover,\n      .timeline__item__forward .content a:hover {\n        color: #07d;\n      }\n\n      .timeline__item__content .content--description > div,\n      .timeline__item__forward .content--description > div {\n        display: inline;\n        word-break: break-word;\n      }\n\n      .timeline__item__content .content--detail .ke_img,\n      .timeline__item__forward .content--detail .ke_img {\n        cursor: -webkit-zoom-out;\n        cursor: zoom-out;\n      }\n      .timeline__item__comment .lite-editor--comment {\n        margin-top: 5px;\n      }\n\n      .timeline__item__comment\n        position: relative;\n        margin-left: 58px;\n      }\n\n      .timeline__item__content .content--detail > div,\n      .timeline__item__forward .content--detail > div {\n        display: inline-block;\n      }\n\n      .timeline__item__content .fund-visible-tag,\n      .timeline__item__forward .fund-visible-tag {\n        color: #d6b785;\n        margin-left: 4px;\n      }\n\n      .timeline__item__bd .content__addition {\n        margin-top: 10px;\n        margin-bottom: 10px;\n      }\n\n      .timeline__item__content + .timeline__item__forward,\n      .timeline__item__content + .timeline__item__quote {\n        margin-top: 10px;\n      }\n\n      .timeline__item__ft {\n        margin-top: 10px;\n        color: #666c72;\n        font-size: 13px;\n      }\n      .timeline__item > .avatar {\n        float: left;\n      }\n      a.avatar {\n        display: inline-block;\n        overflow: hidden;\n        width: 48px;\n        height: 48px;\n        border-radius: 50%;\n        line-height: 1;\n      }\n      a.avatar img {\n        width: 100%;\n        height: 100%;\n        vertical-align: middle;\n      }\n      .avatar.avatar-md {\n        width: 48px;\n        height: 48px;\n      }\n      .timer{\n        position: fixed;\n        top:10px;\n        right:10px;\n        font-size:12px;\n        color:#888;\n      }\n    </style>\n  </head>\n  <body>\n    <div class=\"profiles__timeline__bd\">\n      <span class=\"timer\">\u6570\u636E\u65F6\u95F4\uFF1A" + utils_1.formatDateTime(new Date()) + "</span>\n      " + newsListHTML.join('\n') + "\n    </div>\n    <div style=\"width: 230px; margin: 10px auto\">\n        <p style=\"color:#888\">----\u6700\u65B010\u6761\u4FE1\u606F(\u6BCF20s\u81EA\u52A8\u5237\u65B0)----</p>\n      </div>\n  </body>\n</html>\n";
}
function xuqiuArticleTemp(newsList, hideAvatar) {
    if (newsList === void 0) { newsList = []; }
    if (hideAvatar === void 0) { hideAvatar = false; }
    var htmlArr = [];
    for (var _i = 0, newsList_1 = newsList; _i < newsList_1.length; _i++) {
        var article = newsList_1[_i];
        var info = article;
        info.userId = info.user.id;
        var images = info.user.profile_image_url.split(',');
        var img = "https:" + info.user.photo_domain + images[images.length - 1];
        var description = info.description.replace(/\/\/assets/g, 'https://assets');
        var articleStr = "\n    <article class=\"timeline__item\">\n        " + (hideAvatar
            ? ''
            : "<a\n        href=\"https://xueqiu.com/" + info.userId + "\"\n        target=\"_blank\"\n        data-tooltip=\"" + info.userId + "\"\n        class=\"avatar avatar-md\"\n        ><img\n          src=\"" + img + "\"\n      /></a>") + "\n        <div class=\"timeline__item__top__right\"></div>\n        <div class=\"timeline__item__main\" " + (hideAvatar ? 'style="margin-left:0;"' : '') + ">\n          <div class=\"timeline__item__info\">\n            <div>\n              <a\n                href=\"https://xueqiu.com/" + info.userId + "\"\n                target=\"_blank\"\n                data-tooltip=\"" + info.userId + "\"\n                class=\"user-name\"\n                >" + info.user.screen_name + "</a\n              >\n            </div>\n            <a\n              href=\"https://xueqiu.com/" + info.userId + "/" + info.id + "\"\n              target=\"_blank\"\n              data-id=\"157971116\"\n              class=\"date-and-source\"\n              >" + info.timeBefore + " \u00B7 \u6765\u81EA" + info.source + "</a\n            >\n          </div>\n          <div class=\"timeline__item__bd\">\n            <div class=\"timeline__item__content\">\n              <!---->\n              <div class=\"content content--description\">\n                <!---->\n                <div class=\"\">\n                  " + description + "\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </article>\n      ";
        htmlArr.push(articleStr);
    }
    return htmlArr;
}
exports.default = openNews;
//# sourceMappingURL=news.js.map