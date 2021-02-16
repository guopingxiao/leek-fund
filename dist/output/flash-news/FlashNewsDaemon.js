"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Jin10FlushService_1 = require("./impl/Jin10FlushService");
var XuanGuBaoFLushServices_1 = require("./impl/XuanGuBaoFLushServices");
var throttle = require('lodash.throttle');
var instance;
var FlashNewsDaemon = /** @class */ (function () {
    function FlashNewsDaemon() {
        this.depServers = new Set();
        this.flushServices = new Set();
        this.caches = [];
        this.isDestroy = false;
        this.initServices();
    }
    FlashNewsDaemon.KillAllServer = function () {
        if (instance) {
            instance.depServers.forEach(function (dep) {
                dep.destroy();
                instance === null || instance === void 0 ? void 0 : instance.depServers.delete(dep);
            });
            instance.destroy();
        }
    };
    FlashNewsDaemon.registerServer = function (dep) {
        if (!instance) {
            instance = new FlashNewsDaemon();
        }
        instance.depServers.add(dep);
        instance.caches.reverse().forEach(function (params) {
            return dep.print.apply(dep, [params[0], params[1]]);
        });
        if (instance.isDestroy) {
            instance.initServices();
        }
        return function cancelServer() {
            instance === null || instance === void 0 ? void 0 : instance.depServers.delete(dep);
            instance === null || instance === void 0 ? void 0 : instance.tryDestroy();
        };
    };
    FlashNewsDaemon.prototype.initServices = function () {
        // 暂时不要金十快讯，金十更适合期货。
        this.flushServices.add(new Jin10FlushService_1.default(this));
        this.flushServices.add(new XuanGuBaoFLushServices_1.default(this));
        this.isDestroy = false;
    };
    FlashNewsDaemon.prototype.print = function (news, source) {
        this.caches.unshift([news, source]);
        this.caches = this.caches.slice(0, 100);
        this.depServers.forEach(function (dep) {
            dep.print(news, source);
        });
    };
    FlashNewsDaemon.prototype.tryDestroy = function () {
        if (this.depServers.size < 1) {
            this.destroy();
        }
    };
    /**
     * 销毁
     */
    FlashNewsDaemon.prototype.destroy = function () {
        this.caches.length = 0;
        this.flushServices.forEach(function (service) {
            service.destroy();
        });
        this.isDestroy = true;
    };
    FlashNewsDaemon.prototype.reload = function () { };
    return FlashNewsDaemon;
}());
exports.default = FlashNewsDaemon;
//# sourceMappingURL=FlashNewsDaemon.js.map