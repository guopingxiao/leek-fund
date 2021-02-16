"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
var vscode_1 = require("vscode");
var globalState_1 = require("./globalState");
var registerCommand_1 = require("./registerCommand");
var explorer_1 = require("./explorer");
var webview_1 = require("./webview");
var shared_1 = require("./shared");
var statusbar_1 = require("./statusbar");
var loopTimer = null;
var fundTreeView = null;
var stockTreeView = null;
var profitBar = null;
function activate(context) {
    console.log('🐥Congratulations, your extension "leek-fund" is now active!');
    globalState_1.default.isDevelopment = process.env.NODE_ENV === 'development';
    globalState_1.default.context = context;
    var telemetry = new shared_1.Telemetry();
    globalState_1.default.telemetry = telemetry;
    var intervalTimeConfig = shared_1.LeekFundConfig.getConfig('leek-fund.interval', 5000);
    var intervalTime = intervalTimeConfig;
    // 节假日，异步会存在延迟判断准确问题，设置成同步影响插件激活速度，暂使用异步
    shared_1.HolidayHelper.isHolidayInChina().then(function (isHoliday) {
        globalState_1.default.isHolidayChina = isHoliday;
    });
    setGlobalVariable();
    webview_1.updateAmount();
    var fundService = new explorer_1.FundService(context);
    var stockService = new explorer_1.StockService(context);
    var nodeFundProvider = new explorer_1.FundProvider(fundService);
    var nodeStockProvider = new explorer_1.StockProvider(stockService);
    var statusBar = new statusbar_1.StatusBar(stockService, fundService);
    profitBar = new statusbar_1.ProfitStatusBar();
    // create fund & stock side views
    fundTreeView = vscode_1.window.createTreeView('leekFundView.fund', {
        treeDataProvider: nodeFundProvider,
    });
    stockTreeView = vscode_1.window.createTreeView('leekFundView.stock', {
        treeDataProvider: nodeStockProvider,
    });
    // fix when TreeView collapse https://github.com/xiaoguoping/leek-fund/issues/31
    var manualRequest = function () {
        fundService.getData(shared_1.LeekFundConfig.getConfig('leek-fund.funds'), shared_1.SortType.NORMAL);
        stockService.getData(shared_1.LeekFundConfig.getConfig('leek-fund.stocks'), shared_1.SortType.NORMAL);
    };
    manualRequest();
    // loop
    var loopCallback = function () {
        if (shared_1.isStockTime()) {
            // 重置定时器
            if (intervalTime !== intervalTimeConfig) {
                intervalTime = intervalTimeConfig;
                setIntervalTime();
                return;
            }
            if (fundTreeView === null || fundTreeView === void 0 ? void 0 : fundTreeView.visible) {
                // fix https://github.com/xiaoguoping/leek-fund/issues/78
                if (globalState_1.default.fundAmountCacheDate !== shared_1.formatDate(new Date())) {
                    webview_1.updateAmount();
                }
            }
            if ((stockTreeView === null || stockTreeView === void 0 ? void 0 : stockTreeView.visible) || (fundTreeView === null || fundTreeView === void 0 ? void 0 : fundTreeView.visible)) {
                nodeStockProvider.refresh();
                nodeFundProvider.refresh();
                // statusBar.refresh();
            }
            else {
                manualRequest();
            }
        }
        else {
            console.log('StockMarket Closed! Polling closed!');
            // 闭市时增加轮询间隔时长
            if (intervalTime === intervalTimeConfig) {
                intervalTime = intervalTimeConfig * 100;
                setIntervalTime();
            }
        }
    };
    var setIntervalTime = function () {
        // prevent qps
        if (intervalTime < 3000) {
            intervalTime = 3000;
        }
        if (loopTimer) {
            clearInterval(loopTimer);
            loopTimer = null;
        }
        loopTimer = setInterval(loopCallback, intervalTime);
    };
    setIntervalTime();
    vscode_1.workspace.onDidChangeConfiguration(function (e) {
        console.log('🐥>>>Configuration changed');
        intervalTimeConfig = shared_1.LeekFundConfig.getConfig('leek-fund.interval');
        setIntervalTime();
        setGlobalVariable();
        statusBar.refresh();
        nodeFundProvider.refresh();
        nodeStockProvider.refresh();
        shared_1.events.emit('onDidChangeConfiguration');
        profitBar === null || profitBar === void 0 ? void 0 : profitBar.reload();
    });
    // register event
    registerCommand_1.registerViewEvent(context, fundService, stockService, nodeFundProvider, nodeStockProvider);
    // Telemetry Event
    telemetry.sendEvent('activate');
}
exports.activate = activate;
function setGlobalVariable() {
    var iconType = shared_1.LeekFundConfig.getConfig('leek-fund.iconType') || 'arrow';
    globalState_1.default.iconType = iconType;
    var fundAmount = shared_1.LeekFundConfig.getConfig('leek-fund.fundAmount') || {};
    webview_1.cacheFundAmountData(fundAmount);
    var stocksRemind = shared_1.LeekFundConfig.getConfig('leek-fund.stocksRemind') || {};
    webview_1.cacheStocksRemindData(stocksRemind);
    var showEarnings = shared_1.LeekFundConfig.getConfig('leek-fund.showEarnings');
    globalState_1.default.showEarnings = showEarnings;
    var remindSwitch = shared_1.LeekFundConfig.getConfig('leek-fund.stockRemindSwitch');
    globalState_1.default.remindSwitch = remindSwitch;
    globalState_1.default.labelFormat = shared_1.LeekFundConfig.getConfig('leek-fund.labelFormat');
    globalState_1.default.immersiveBackground = shared_1.LeekFundConfig.getConfig('leek-fund.immersiveBackground', true);
}
// this method is called when your extension is deactivated
function deactivate() {
    console.log('🐥deactivate');
    profitBar === null || profitBar === void 0 ? void 0 : profitBar.destroy();
    if (loopTimer) {
        clearInterval(loopTimer);
        loopTimer = null;
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map