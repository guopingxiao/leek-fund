"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheStocksRemindData = exports.setStocksRemindCfgCb = void 0;
var events_1 = require("events");
var vscode_1 = require("vscode");
var globalState_1 = require("../globalState");
var leekConfig_1 = require("../shared/leekConfig");
var utils_1 = require("../shared/utils");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
var axios_1 = require("axios");
var _INITED = false;
var panelEvents;
function leekCenterView(stockService, fundServices) {
    var panel = ReusedWebviewPanel_1.default.create('leekCenterWebview', "\u97ED\u83DC\u4E2D\u5FC3", vscode_1.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
    });
    if (_INITED)
        return;
    _INITED = true;
    panelEvents = new events_1.EventEmitter();
    // const transceiver = transceiverFactory(panel.webview); 备用
    setList(panel.webview, panelEvents, stockService, fundServices);
    setStocksRemind(panel.webview, panelEvents);
    // setDiscussions(panel.webview, panelEvents);
    panel.webview.onDidReceiveMessage(function (message) {
        panelEvents.emit('onDidReceiveMessage', message);
        switch (message.command) {
            case 'alert':
                vscode_1.window.showErrorMessage(message.data);
                return;
            case 'fail':
                vscode_1.window.showErrorMessage('保存失败！');
                return;
            case 'pageReady':
                panelEvents.emit('pageReady');
                return;
            case 'executeCommand':
                vscode_1.commands.executeCommand(message.data);
                return;
            case 'fetch':
                console.log('fetch:', message.data);
                axios_1.default(message.data).then(postFetchResponseFactory(panel.webview, true, message.data.sessionId), postFetchResponseFactory(panel.webview, false, message.data.sessionId));
                return;
        }
    }, undefined);
    panel.onDidDispose(function () {
        panelEvents.emit('onDidDispose');
        _INITED = false;
    });
    if (globalState_1.default.isDevelopment) {
        var DEV_URL_1 = 'http://localhost:3030/';
        axios_1.default
            .get(DEV_URL_1)
            .then(function (res) {
            var html = res.data;
            panel.webview.html = utils_1.formatHTMLWebviewResourcesUrl(html, function (link) {
                return DEV_URL_1 + link;
            });
        })
            .catch(function (err) {
            vscode_1.window.showErrorMessage('[开发] 获取 http://localhost:3030/ 失败，请先启动服务');
        });
    }
    else {
        console.log(utils_1.getTemplateFileContent(['leek-center', 'build', 'index.html'], panel.webview));
        panel.webview.html = utils_1.getTemplateFileContent(['leek-center', 'build', 'index.html'], panel.webview);
    }
}
function postFetchResponseFactory(webview, success, sessionId) {
    return function (response) {
        if (!success)
            console.log('请求失败');
        console.log('response: ', response);
        var request = response.request, rawResponse = __rest(response, ["request"]);
        webview.postMessage({
            command: 'fetchResponse',
            data: {
                success: success,
                response: rawResponse,
                sessionId: sessionId,
            },
        });
    };
}
function setStocksRemind(webview, panelEvents) {
    // console.log('stockList: ', stockList);
    panelEvents.on('onDidReceiveMessage', function (message) {
        switch (message.command) {
            case 'saveRemind':
                console.log(JSON.parse(message.data));
                setStocksRemindCfgCb(JSON.parse(message.data));
                return;
        }
    });
    panelEvents.on('pageReady', function () {
        webview.postMessage({
            command: 'updateStockRemind',
            data: globalState_1.default.stocksRemind,
        });
    });
    var updateWebViewCfg = function () {
        console.log('updateStockRemind: ', globalState_1.default.stocksRemind);
        webview.postMessage({
            command: 'updateStockRemind',
            data: globalState_1.default.stocksRemind,
        });
    };
    utils_1.events.on('onDidChangeConfiguration', updateWebViewCfg);
    panelEvents.on('onDidDispose', function () {
        utils_1.events.off('onDidChangeConfiguration', updateWebViewCfg);
    });
}
function setDiscussions(webview, panelEvents) {
    function login(slient) {
        if (slient === void 0) { slient = true; }
        return getGithubToken(slient).then(function (res) {
            if (res) {
                webview.postMessage({
                    command: 'setGithubAccessToken',
                    data: res,
                });
            }
        });
    }
    panelEvents.on('pageReady', function () {
        login().then(function () {
            webview.postMessage({
                command: 'talkerReady',
            });
        });
    });
    panelEvents.on('onDidReceiveMessage', function (message) {
        switch (message.command) {
            case 'loginGithub':
                console.log('loginGithub');
                login(false).then(function () {
                    webview.postMessage({
                        command: 'githubLoginSuccess',
                    });
                });
                return;
        }
    });
}
function setList(webview, panelEvents, stockService, fundServices) {
    var postListFactory = function (command) { return function (data) {
        webview.postMessage({
            command: command,
            data: data,
        });
    }; };
    /**
     * 更新列表数据
     * @param webview
     * @param defaultStockList
     */
    var postStockList;
    function updateStockList(webview, defaultStockList) {
        postStockList = postListFactory('updateStockList');
        utils_1.events.on('stockListUpdate', postStockList);
        return function () {
            utils_1.events.off('stockListUpdate', postStockList);
        };
    }
    var postFundList;
    function updateFundList(webview, defaultFundList) {
        postFundList = postListFactory('updateFundList');
        utils_1.events.on('fundListUpdate', postFundList);
        return function () {
            utils_1.events.off('fundListUpdate', postFundList);
        };
    }
    var offUpdateStockList = updateStockList(webview, stockService.stockList);
    var offUpdateFundList = updateFundList(webview, fundServices.fundList);
    panelEvents.on('pageReady', function () {
        postStockList(stockService.stockList);
        postFundList(fundServices.fundList);
    });
    panelEvents.on('onDidDispose', function () {
        offUpdateStockList();
        offUpdateFundList();
    });
}
function getGithubToken(slient) {
    if (slient === void 0) { slient = true; }
    if (!vscode_1.authentication) {
        vscode_1.window.showErrorMessage('当前vscode版本过低，请升级vscode');
    }
    return vscode_1.authentication
        .getSession('github', ['read:user', 'user:email', 'public_repo'], { createIfNone: !slient })
        .then(function (res) {
        var _a;
        return (_a = res === null || res === void 0 ? void 0 : res.accessToken) !== null && _a !== void 0 ? _a : null;
    });
}
function setStocksRemindCfgCb(cfg) {
    leekConfig_1.LeekFundConfig.setConfig('leek-fund.stocksRemind', cfg).then(function () {
        vscode_1.window.showInformationMessage('价格预警保存成功！');
        cacheStocksRemindData(cfg);
    }, function (err) {
        console.error(err);
    });
}
exports.setStocksRemindCfgCb = setStocksRemindCfgCb;
function cacheStocksRemindData(remindObj) {
    globalState_1.default.stocksRemind = remindObj;
}
exports.cacheStocksRemindData = cacheStocksRemindData;
exports.default = leekCenterView;
//# sourceMappingURL=leekCenterView.js.map