import { ConfigurationChangeEvent, ExtensionContext, TreeView, window, workspace } from 'vscode';
import globalState from './globalState';
import { registerViewEvent } from './registerCommand';
import { 
  FundProvider,
  FundService,
  StockProvider,
  StockService
} from './explorer';
import {
  cacheStocksRemindData,
  cacheFundAmountData,
  updateAmount
} from './webview';
import {
  LeekFundConfig,
  Telemetry,
  events,
  SortType,
  formatDate,
  isStockTime,
  HolidayHelper
} from './shared';
import { 
  StatusBar,
  ProfitStatusBar
} from './statusbar';

let loopTimer: NodeJS.Timer | null = null;
let fundTreeView: TreeView<any> | null = null;
let stockTreeView: TreeView<any> | null = null;

let profitBar: ProfitStatusBar | null = null;

export function activate(context: ExtensionContext) {
  console.log('🐥Congratulations, your extension "leek-fund" is now active!');

  globalState.isDevelopment = process.env.NODE_ENV === 'development';
  globalState.context = context;

  const telemetry = new Telemetry();
  globalState.telemetry = telemetry;

  let intervalTimeConfig = LeekFundConfig.getConfig('leek-fund.interval', 5000);
  let intervalTime = intervalTimeConfig;

  // 节假日，异步会存在延迟判断准确问题，设置成同步影响插件激活速度，暂使用异步
  HolidayHelper.isHolidayInChina().then((isHoliday) => {
    globalState.isHolidayChina = isHoliday;
  });

  setGlobalVariable();
  updateAmount();


  const fundService = new FundService(context);
  const stockService = new StockService(context);

  const nodeFundProvider = new FundProvider(fundService);
  const nodeStockProvider = new StockProvider(stockService);

  const statusBar = new StatusBar(stockService, fundService);
  profitBar = new ProfitStatusBar();

  // create fund & stock side views
  fundTreeView = window.createTreeView('leekFundView.fund', {
    treeDataProvider: nodeFundProvider,
  });

  stockTreeView = window.createTreeView('leekFundView.stock', {
    treeDataProvider: nodeStockProvider,
  });


  // fix when TreeView collapse https://github.com/xiaoguoping/leek-fund/issues/31
  const manualRequest = () => {
    fundService.getData(LeekFundConfig.getConfig('leek-fund.funds'), SortType.NORMAL);
    stockService.getData(LeekFundConfig.getConfig('leek-fund.stocks'), SortType.NORMAL);
  };

  manualRequest();

  // loop
  const loopCallback = () => {
    if (isStockTime()) {
      // 重置定时器
      if (intervalTime !== intervalTimeConfig) {
        intervalTime = intervalTimeConfig;
        setIntervalTime();
        return;
      }
      if (fundTreeView?.visible) {
        // fix https://github.com/xiaoguoping/leek-fund/issues/78
        if (globalState.fundAmountCacheDate !== formatDate(new Date())) {
          updateAmount();
        }
      }
      if (stockTreeView?.visible || fundTreeView?.visible) {
        nodeStockProvider.refresh();
        nodeFundProvider.refresh();
        // statusBar.refresh();
      } else {
        manualRequest();
      }
    } else {
      console.log('StockMarket Closed! Polling closed!');
      // 闭市时增加轮询间隔时长
      if (intervalTime === intervalTimeConfig) {
        intervalTime = intervalTimeConfig * 100;
        setIntervalTime();
      }
    }
  };

  const setIntervalTime = () => {
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

  workspace.onDidChangeConfiguration((e: ConfigurationChangeEvent) => {
    console.log('🐥>>>Configuration changed');
    intervalTimeConfig = LeekFundConfig.getConfig('leek-fund.interval');
    setIntervalTime();
    setGlobalVariable();
    statusBar.refresh();
    nodeFundProvider.refresh();
    nodeStockProvider.refresh();
    events.emit('onDidChangeConfiguration');
    profitBar?.reload();
  });

  // register event
  registerViewEvent(
    context,
    fundService,
    stockService,
    nodeFundProvider,
    nodeStockProvider
  );

  // Telemetry Event
  telemetry.sendEvent('activate');
}

function setGlobalVariable() {
  const iconType = LeekFundConfig.getConfig('leek-fund.iconType') || 'arrow';
  globalState.iconType = iconType;

  const fundAmount = LeekFundConfig.getConfig('leek-fund.fundAmount') || {};
  cacheFundAmountData(fundAmount);

  const stocksRemind = LeekFundConfig.getConfig('leek-fund.stocksRemind') || {};
  cacheStocksRemindData(stocksRemind);

  const showEarnings = LeekFundConfig.getConfig('leek-fund.showEarnings');
  globalState.showEarnings = showEarnings;

  const remindSwitch = LeekFundConfig.getConfig('leek-fund.stockRemindSwitch');
  globalState.remindSwitch = remindSwitch;

  globalState.labelFormat = LeekFundConfig.getConfig('leek-fund.labelFormat');

  globalState.immersiveBackground = LeekFundConfig.getConfig('leek-fund.immersiveBackground', true);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('🐥deactivate');
  profitBar?.destroy();
  if (loopTimer) {
    clearInterval(loopTimer);
    loopTimer = null;
  }
}
