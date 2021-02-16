"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FlashNewsDaemon_1 = require("../../output/flash-news/FlashNewsDaemon");
var LeekCenterFlashNewsViewServer = /** @class */ (function () {
    function LeekCenterFlashNewsViewServer(webview) {
        this.webview = webview;
        this.unregisterServer = FlashNewsDaemon_1.default.registerServer(this);
    }
    LeekCenterFlashNewsViewServer.prototype.print = function (content, source) {
        this.webview.postMessage({
            command: 'postFlashNews',
            data: source,
        });
    };
    LeekCenterFlashNewsViewServer.prototype.destroy = function () {
        var _a;
        (_a = this.unregisterServer) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    return LeekCenterFlashNewsViewServer;
}());
exports.default = LeekCenterFlashNewsViewServer;
//# sourceMappingURL=flash-news-view.js.map