"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transceiverFactory = void 0;
var WebSocket = require("ws");
var globalState_1 = require("../globalState");
/**
 * Webview 开发时，通过 WS 传递消息
 * @param entity
 * @param options
 * @returns
 */
function transceiverFactory(entity, options) {
    if (options === void 0) { options = {
        port: 3500,
    }; }
    // 开发环境
    if (globalState_1.default.isDevelopment) {
        var wss = new WebSocket.Server({
            port: options.port,
        });
        var cws_1 = new Set();
        var postMessage = function (message) {
            cws_1.forEach(function (ws) {
                ws.send(message);
            });
            return Promise.resolve(true);
        };
        var listener_1;
        var onDidReceiveMessage = function (_listener) {
            listener_1 = _listener;
            return {
                dispose: function () {
                    listener_1 = void 0;
                },
            };
        };
        wss.on('connection', function (ws) {
            cws_1.add(ws);
            ws.on('message', function incoming(message) {
                if (listener_1) {
                    listener_1(message);
                }
            });
            ws.on('close', function () {
                cws_1.delete(ws);
            });
        });
        return {
            postMessage: postMessage,
            onDidReceiveMessage: onDidReceiveMessage,
        };
    }
    else {
        return {
            onDidReceiveMessage: entity.onDidReceiveMessage.bind(entity),
            postMessage: entity.postMessage.bind(entity),
        };
    }
}
exports.transceiverFactory = transceiverFactory;
//# sourceMappingURL=WVMessageUtils.js.map