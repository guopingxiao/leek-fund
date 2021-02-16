"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 获取新闻刷新服务的抽象类
 */
var NewsFlushServiceAbstractClass = /** @class */ (function () {
    function NewsFlushServiceAbstractClass(daemon) {
        this.daemon = daemon;
    }
    NewsFlushServiceAbstractClass.prototype.pause = function () { };
    NewsFlushServiceAbstractClass.prototype.print = function (content, source) {
        this.daemon.print("" + content, source);
    };
    return NewsFlushServiceAbstractClass;
}());
exports.default = NewsFlushServiceAbstractClass;
//# sourceMappingURL=NewsFlushServiceAbstractClass.js.map