"use strict";
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
exports.registerViewEvent = void 0;
var vscode_1 = require("vscode");
var fundSuggestData_1 = require("./data/fundSuggestData");
var globalState_1 = require("./globalState");
var shared_1 = require("./shared");
var webview_1 = require("./webview");
function registerViewEvent(context, fundService, stockService, fundProvider, stockProvider) {
    var _this = this;
    // Fund operation
    vscode_1.commands.registerCommand('leek-fund.refreshFund', function () {
        fundProvider.refresh();
        var handler = vscode_1.window.setStatusBarMessage("\u57FA\u91D1\u6570\u636E\u5DF2\u5237\u65B0");
        setTimeout(function () {
            handler.dispose();
        }, 1000);
    });
    vscode_1.commands.registerCommand('leek-fund.deleteFund', function (target) {
        shared_1.LeekFundConfig.removeFundCfg(target.id, function () {
            fundProvider.refresh();
        });
    });
    vscode_1.commands.registerCommand('leek-fund.addFund', function () {
        vscode_1.window.showQuickPick(fundSuggestData_1.default, { placeHolder: '请输入基金代码' }).then(function (code) {
            if (!code) {
                return;
            }
            shared_1.LeekFundConfig.updateFundCfg(code.split('|')[0], function () {
                fundProvider.refresh();
            });
        });
    });
    vscode_1.commands.registerCommand('leek-fund.sortFund', function () {
        fundProvider.changeOrder();
        fundProvider.refresh();
    });
    vscode_1.commands.registerCommand('leek-fund.sortAmountFund', function () {
        fundProvider.changeAmountOrder();
        fundProvider.refresh();
    });
    // Stock operation
    vscode_1.commands.registerCommand('leek-fund.refreshStock', function () {
        stockProvider.refresh();
        var handler = vscode_1.window.setStatusBarMessage("\u80A1\u7968\u6570\u636E\u5DF2\u5237\u65B0");
        setTimeout(function () {
            handler.dispose();
        }, 1000);
    });
    vscode_1.commands.registerCommand('leek-fund.deleteStock', function (target) {
        shared_1.LeekFundConfig.removeStockCfg(target.id, function () {
            stockProvider.refresh();
        });
    });
    // commands.registerCommand('leek-fund.leekCenterView', () => {
    //   if (stockService.stockList.length === 0 && fundService.fundList.length === 0) {
    //     window.showWarningMessage('数据刷新中，请稍候！');
    //     return;
    //   }
    //   leekCenterView(stockService, fundService);
    // });
    vscode_1.commands.registerCommand('leek-fund.addStock', function () {
        // vscode QuickPick 不支持动态查询，只能用此方式解决
        // https://github.com/microsoft/vscode/issues/23633
        var qp = vscode_1.window.createQuickPick();
        qp.items = [{ label: '请输入关键词查询，如：0000001 或 上证指数' }];
        var code;
        var timer = null;
        qp.onDidChangeValue(function (value) {
            qp.busy = true;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, stockService.getStockSuggestList(value)];
                        case 1:
                            res = _a.sent();
                            qp.items = res;
                            qp.busy = false;
                            return [2 /*return*/];
                    }
                });
            }); }, 100); // 简单防抖
        });
        qp.onDidChangeSelection(function (e) {
            if (e[0].description) {
                code = e[0].label && e[0].label.split(' | ')[0];
            }
        });
        qp.show();
        qp.onDidAccept(function () {
            if (!code) {
                return;
            }
            // 存储到配置的时候是接口的参数格式，接口请求时不需要再转换
            var newCode = code.replace('gb', 'gb_').replace('us', 'usr_');
            shared_1.LeekFundConfig.updateStockCfg(newCode, function () {
                stockProvider.refresh();
            });
            qp.hide();
            qp.dispose();
        });
    });
    vscode_1.commands.registerCommand('leek-fund.sortStock', function () {
        stockProvider.changeOrder();
        stockProvider.refresh();
    });
    /**
     * WebView
     */
    // 股票点击
    context.subscriptions.push(vscode_1.commands.registerCommand('leek-fund.stockItemClick', function (code, name, text, stockCode) {
        return webview_1.stockTrend(code, name, stockCode);
    }));
    // 基金点击
    context.subscriptions.push(vscode_1.commands.registerCommand('leek-fund.fundItemClick', function (code, name) { return webview_1.fundTrend(code, name); }));
    // 基金右键历史信息点击
    vscode_1.commands.registerCommand('leek-fund.viewFundHistory', function (item) { return webview_1.fundHistory(item); });
    // 基金持仓
    vscode_1.commands.registerCommand('leek-fund.viewFundPosition', function (item) { return webview_1.fundPosition(item); });
    // 基金排行
    vscode_1.commands.registerCommand('leek-fund.viewFundRank', function () { return webview_1.fundRank(); });
    // 基金走势图
    vscode_1.commands.registerCommand('leek-fund.viewFundTrend', function () { return webview_1.allFundTrend(fundService); });
    // 资金流向
    vscode_1.commands.registerCommand('leek-fund.viewFundFlow', function () { return webview_1.fundFlow(); });
    vscode_1.commands.registerCommand('leek-fund.viewMainFundFlow', function () { return webview_1.mainFundFlow(); });
    // 基金置顶
    vscode_1.commands.registerCommand('leek-fund.setFundTop', function (target) {
        shared_1.LeekFundConfig.setFundTopCfg(target.id, function () {
            fundProvider.refresh();
        });
    });
    // 股票置顶
    vscode_1.commands.registerCommand('leek-fund.setStockTop', function (target) {
        shared_1.LeekFundConfig.setStockTopCfg(target.id, function () {
            fundProvider.refresh();
        });
    });
    // 设置基金持仓金额
    vscode_1.commands.registerCommand('leek-fund.setFundAmount', function () {
        if (fundService.fundList.length === 0) {
            vscode_1.window.showWarningMessage('数据刷新中，请重试！');
            return;
        }
        webview_1.setAmount(fundService);
    });
    vscode_1.commands.registerCommand('leek-fund.stockTrendPic', function (target) {
        var _a = target.info, code = _a.code, name = _a.name, type = _a.type, symbol = _a.symbol;
        webview_1.stockTrendPic(code, name, "" + type + symbol);
    });
    /**
     * Settings command
     */
    context.subscriptions.push(vscode_1.commands.registerCommand('leek-fund.hideText', function () {
        fundService.toggleLabel();
        stockService.toggleLabel();
        fundProvider.refresh();
        stockProvider.refresh();
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('leek-fund.setStockStatusBar', function () {
        var stockList = stockService.stockList;
        var stockNameList = stockList.map(function (item) {
            return {
                label: "" + item.info.name,
                description: "" + item.info.code,
            };
        });
        vscode_1.window
            .showQuickPick(stockNameList, {
            placeHolder: '输入过滤选择，支持多选（限4个）',
            canPickMany: true,
        })
            .then(function (res) {
            if (!res) {
                res = [];
            }
            var codes = res.map(function (item) { return item.description; });
            if (codes.length > 4) {
                codes = codes.slice(0, 4);
            }
            shared_1.LeekFundConfig.updateStatusBarStockCfg(codes, function () {
                var handler = vscode_1.window.setStatusBarMessage("\u4E0B\u6B21\u6570\u636E\u5237\u65B0\u89C1\u6548");
                setTimeout(function () {
                    handler.dispose();
                }, 1500);
            });
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('leek-fund.customSetting', function () {
        var colorList = shared_1.colorOptionList();
        vscode_1.window
            .showQuickPick([
            { label: '状态栏股票设置', description: 'statusbar-stock' },
            { label: '状态栏股票涨📈的文字颜色', description: 'statusbar-rise' },
            { label: '状态栏股票跌📉的文字颜色', description: 'statusbar-fall' },
            { label: '基金&股票涨跌图标更换', description: 'icontype' },
            { label: '👀显示/隐藏文本', description: 'hideText' },
            {
                label: globalState_1.default.showEarnings ? '隐藏盈亏' : '👀显示盈亏',
                description: 'earnings',
            },
            {
                label: globalState_1.default.remindSwitch ? '关闭提醒' : '🔔️打开提醒',
                description: 'remindSwitch',
            },
        ], {
            placeHolder: '第一步：选择设置项',
        })
            .then(function (item) {
            if (!item) {
                return;
            }
            var type = item.description;
            // 状态栏颜色设置
            if (type === 'statusbar-rise' || type === 'statusbar-fall') {
                vscode_1.window
                    .showQuickPick(colorList, {
                    placeHolder: "\u7B2C\u4E8C\u6B65\uFF1A\u8BBE\u7F6E\u989C\u8272\uFF08" + item.label + "\uFF09",
                })
                    .then(function (colorItem) {
                    if (!colorItem) {
                        return;
                    }
                    var color = colorItem.description;
                    if (color === 'random') {
                        color = shared_1.randomColor();
                    }
                    shared_1.LeekFundConfig.setConfig(type === 'statusbar-rise' ? 'leek-fund.riseColor' : 'leek-fund.fallColor', color);
                });
            }
            else if (type === 'statusbar-stock') {
                // 状态栏股票设置
                vscode_1.commands.executeCommand('leek-fund.setStockStatusBar');
            }
            else if (type === 'icontype') {
                // 基金&股票涨跌图标
                vscode_1.window
                    .showQuickPick([
                    {
                        label: '箭头图标',
                        description: 'arrow',
                    },
                    {
                        label: '食物图标1（吃面、吃鸡腿）',
                        description: 'food1',
                    },
                    {
                        label: '食物图标2（烤韭菜、烤肉）',
                        description: 'food2',
                    },
                    {
                        label: '食物图标3（吃面、喝酒）',
                        description: 'food3',
                    },
                    {
                        label: '食物字体图标（吃面、吃鸡腿）',
                        description: 'iconfood',
                    },
                ], {
                    placeHolder: "\u7B2C\u4E8C\u6B65\uFF1A\u9009\u62E9\u57FA\u91D1&\u80A1\u7968\u6DA8\u8DCC\u56FE\u6807",
                })
                    .then(function (iconItem) {
                    if (!iconItem) {
                        return;
                    }
                    if (globalState_1.default.iconType !== iconItem.description) {
                        shared_1.LeekFundConfig.setConfig('leek-fund.iconType', iconItem.description);
                        globalState_1.default.iconType = iconItem.description;
                    }
                });
            }
            else if (type === 'earnings') {
                var newValue = globalState_1.default.showEarnings === 1 ? 0 : 1;
                shared_1.LeekFundConfig.setConfig('leek-fund.showEarnings', newValue);
                globalState_1.default.showEarnings = newValue;
            }
            else if (type === 'hideText') {
                vscode_1.commands.executeCommand('leek-fund.hideText');
            }
            else if (type === 'remindSwitch') {
                vscode_1.commands.executeCommand('leek-fund.toggleRemindSwitch');
            }
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('leek-fund.openConfigPage', function () {
        vscode_1.commands.executeCommand('workbench.action.openSettings', '@ext:xiaoguoping.leek-fund');
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('leek-fund.toggleRemindSwitch', function (on) {
        var newValue = on !== undefined ? (on ? 1 : 0) : globalState_1.default.remindSwitch === 1 ? 0 : 1;
        shared_1.LeekFundConfig.setConfig('leek-fund.stockRemindSwitch', newValue);
        globalState_1.default.remindSwitch = newValue;
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('leek-fund.changeStatusBarItem', function (stockId) {
        var stockList = stockService.stockList;
        var stockNameList = stockList
            .filter(function (stock) { return stock.id !== stockId; })
            .map(function (item) {
            return {
                label: "" + item.info.name,
                description: "" + item.info.code,
            };
        });
        vscode_1.window
            .showQuickPick(stockNameList, {
            placeHolder: '更换状态栏个股',
        })
            .then(function (res) {
            if (!res)
                return;
            var statusBarStocks = shared_1.LeekFundConfig.getConfig('leek-fund.statusBarStock');
            var newCfg = __spreadArrays(statusBarStocks);
            var newStockId = res.description;
            var index = newCfg.indexOf(stockId);
            if (statusBarStocks.includes(newStockId)) {
                vscode_1.window.showWarningMessage("\u300C" + res.label + "\u300D\u5DF2\u5728\u72B6\u6001\u680F");
                return;
            }
            if (index > -1) {
                newCfg[newCfg.indexOf(stockId)] = res.description;
            }
            shared_1.LeekFundConfig.updateStatusBarStockCfg(newCfg, function () {
                var handler = vscode_1.window.setStatusBarMessage("\u4E0B\u6B21\u6570\u636E\u5237\u65B0\u89C1\u6548");
                setTimeout(function () {
                    handler.dispose();
                }, 1500);
            });
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('leek-fund.immersiveBackground', function (isChecked) {
        shared_1.LeekFundConfig.setConfig('leek-fund.immersiveBackground', isChecked);
        globalState_1.default.immersiveBackground = isChecked;
    }));
    shared_1.checkForUpdate();
}
exports.registerViewEvent = registerViewEvent;
//# sourceMappingURL=registerCommand.js.map