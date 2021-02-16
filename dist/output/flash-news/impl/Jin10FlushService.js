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
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var globalState_1 = require("../../../globalState");
var NewsFlushServiceAbstractClass_1 = require("../NewsFlushServiceAbstractClass");
var MSG_NEWS_FLASH = 1e3;
var Jin10FlushService = /** @class */ (function (_super) {
    __extends(Jin10FlushService, _super);
    function Jin10FlushService(daemon) {
        var _this = _super.call(this, daemon) || this;
        _this.daemon = daemon;
        _this.isDone = false;
        _this.idIndexs = [];
        try {
            _this.init();
        }
        catch (err) {
            console.error(err);
        }
        return _this;
    }
    Jin10FlushService.prototype.init = function () {
        this.openSocket();
    };
    Jin10FlushService.prototype.openSocket = function () {
        var _this = this;
        if (this.ws) {
            this.ws.removeAllListeners();
            this.ws.close();
            this.ws = void 0;
        }
        var ws = new WebSocket('wss://wss-flash-1.jin10.com/');
        this.ws = ws;
        ws.binaryType = 'arraybuffer';
        ws.addEventListener('message', function (msg) {
            try {
                _this.processData(Buffer.from(new Uint8Array(msg.data)));
            }
            catch (err) {
                console.error(err);
            }
        });
        ws.addEventListener('open', function () {
            console.log('金十快讯 ws 打开');
            _this.sendHeartbeat();
        });
        ws.addEventListener('error', function (err) {
            globalState_1.default.telemetry.sendEvent('error:jin10Service', { error: err });
            console.log('金十快讯 ws 错误：', err);
        });
        ws.addEventListener('close', function () {
            console.log('金十快讯 ws 关闭');
            if (!_this.isDone) {
                _this.ws = void 0;
                _this.init();
            }
        });
    };
    Jin10FlushService.prototype.destroy = function () {
        var _a;
        console.log('销毁 金十 快讯服务');
        this.isDone = true;
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
    };
    Jin10FlushService.prototype.pause = function () { };
    Jin10FlushService.prototype.sendHeartbeat = function () {
        var _this = this;
        this.heartbeatTimer = setInterval(function () {
            if (!_this.ws || _this.ws.readyState !== WebSocket.OPEN) {
                return false;
            }
            _this.ws.send('');
        }, 10000);
    };
    /**
     * 是否广告
     * @param content
     */
    Jin10FlushService.prototype.isAD = function (content) {
        return /^<a.*?>\s*<img.*?\/><\/a>$/.test(content);
    };
    Jin10FlushService.prototype.processData = function (bf) {
        var type = bf.readUInt16LE();
        var dataLen = bf.readUInt16LE(2);
        if (type === MSG_NEWS_FLASH) {
            var data = JSON.parse(bf.toString('utf-8', 4, 4 + dataLen));
            console.log('金十快讯: ', data);
            var type_1 = data.type, time = data.time, important = data.important, remark = data.remark, id = data.id, action = data.action, channel = data.channel;
            if (~this.idIndexs.indexOf(id) ||
                action !== 1 ||
                !(channel.includes(1) || channel.includes(5)) ||
                this.isAD(data.data.content))
                return;
            this.idIndexs.push(id);
            // console.log('data: ', data);
            // if (!important) return; // 去掉判断显示更多的内容
            var contentSuffix = "\uFF08https://flash.jin10.com/detail/" + id + "\uFF09\r\n[\u91D1\u5341\u5FEB\u8BAF - " + time + "]";
            if (type_1 === 0) {
                var content = this.formatContent(data.data.content);
                content &&
                    this.print("" + content + contentSuffix, {
                        type: 'jin10',
                        data: data,
                        time: new Date(data.time).getTime(),
                    });
            }
            if (type_1 === 1) {
                var _a = data.data, country = _a.country, time_period = _a.time_period, name = _a.name, actual = _a.actual, unit = _a.unit;
                this.print("" + country + time_period + name + ":" + actual + unit + contentSuffix, {
                    type: 'jin10',
                    data: data,
                    time: new Date(data.time).getTime(),
                });
            }
        }
    };
    Jin10FlushService.prototype.formatContent = function (content) {
        var result = content.replace(/<br\/>/gi, '\r\n　　').replace(/(<([^>]+)>)/gi, '');
        if (result[0] === '【') {
            result = result.replace('】', '】\r\n　　');
        }
        else {
            result = '　　' + result;
        }
        return result;
    };
    Jin10FlushService.prototype.getRemarkLink = function (remark) {
        if (remark === void 0) { remark = []; }
        for (var index = 0; index < remark.length; index++) {
            var element = remark[index];
            if (element.type === 'link') {
                return element.link;
            }
        }
        return null;
    };
    return Jin10FlushService;
}(NewsFlushServiceAbstractClass_1.default));
exports.default = Jin10FlushService;
//# sourceMappingURL=Jin10FlushService.js.map