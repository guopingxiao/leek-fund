import { Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import { FundService } from '../explorer';
import globalState from '../globalState';
import { LeekFundConfig } from '../shared/leekConfig';
import { LeekTreeItem } from '../shared/leekTreeItem';
import { IAmount } from '../shared/typed';
import {
  formatDate,
  getTemplateFileContent,
  getWebviewResourcesUrl,
  toFixed,
} from '../shared/utils';
import ReusedWebviewPanel from './ReusedWebviewPanel';
const cloneDeep = require('lodash.clonedeep');

async function setAmount(fundService: FundService) {
  const list = fundDataHandler(fundService);
  const panel = ReusedWebviewPanel.create(
    'setFundAmountWebview',
    `基金持仓金额设置`,
    ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );
  // Handle messages from the webview
  panel.webview.onDidReceiveMessage((message) => {
    switch (message.command) {
      case 'success':
        console.log(JSON.parse(message.text));
        setAmountCfgCb(JSON.parse(message.text));
        return;
      case 'alert':
        window.showErrorMessage('保存失败！');
        return;
      case 'refresh':
        const list = fundDataHandler(fundService);
        // console.log(list);
        // panel.webview.html = `<h3>loading</h3>`;
        // getWebviewContent(panel);
        panel.webview.postMessage({
          command: 'init',
          data: list,
          sortType: message.sortType,
        });
        return;
      case 'telemetry':
        globalState.telemetry.sendEvent('shareByPicture', { type: message.type });
        return;
    }
  }, undefined);

  getWebviewContent(panel);

  /* panel.onDidChangeViewState((event) => {
    // console.log(event);
    panel.webview.postMessage({
      command: 'init',
      data: list,
    });
  }); */
}

function fundDataHandler(fundService: FundService) {
  const fundList: LeekTreeItem[] = cloneDeep(fundService.fundList);
  const amountObj: any = globalState.fundAmount || {};
  const list = fundList.map((item: LeekTreeItem) => {
    return {
      name: item.info?.name,
      code: item.id,
      percent: item.info?.percent,
      amount: amountObj[item.info?.code]?.amount || 0,
      earningPercent: item.info?.earningPercent,
      unitPrice: item.info?.unitPrice,
      priceDate: formatDate(item.info?.time),
      earnings: item.info?.earnings || 0,
      yestEarnings: amountObj[item.info.code]?.earnings || 0,
    };
  });

  return list;
}

function getWebviewContent(panel: WebviewPanel) {
  const _getWebviewResourcesUrl = (arr: string[]): Uri[] => {
    return getWebviewResourcesUrl(panel.webview, globalState.context.extensionUri, arr);
  };

  panel.webview.html = getTemplateFileContent('fund-amount.html', panel.webview);
}

function setAmountCfgCb(data: IAmount[]) {
  const cfg: any = {};
  data.forEach((item: any) => {
    cfg[item.code] = {
      name: item.name,
      amount: item.amount || 0,
      price: item.price,
      unitPrice: item.unitPrice,
      earnings: item.earnings,
      priceDate: item.priceDate,
    };
  });
  LeekFundConfig.setConfig('leek-fund.fundAmount', cfg).then(() => {
    cacheFundAmountData(cfg);
    window.showInformationMessage('保存成功！（没开市的时候添加的持仓盈亏为0，开市时会自动计算）');
  });
}

/**
 * 更新持仓金额
 * @param leekModel
 */
export async function updateAmount() {
  const amountObj: any = globalState.fundAmount;
  const codes = Object.keys(amountObj);
  if (codes.length === 0) {
    return;
  }
  const filterCodes = [];
  for (const code of codes) {
    const amount = amountObj[code]?.amount;
    if (amount > 0) {
      filterCodes.push(code);
    }
  }
  try {
    const { Datas = [], Expansion } = await FundService.qryFundInfo(filterCodes);
    Datas.forEach((item: any) => {
      const { FCODE, NAV } = item;
      const time = item.GZTIME.substr(0, 10);
      const pdate = item.PDATE.substr(0, 10);
      const isUpdated = pdate === time; // 判断闭市的时候
      const money = amountObj[FCODE]?.amount || 0;
      const price = amountObj[FCODE]?.price || 0;
      const priceDate = amountObj[FCODE]?.priceDate || '';
      if (priceDate !== pdate) {
        const currentMoney = (money / price) * NAV;
        amountObj[FCODE].amount = toFixed(currentMoney);
        if (isUpdated) {
          // 闭市的时候保留上一次盈亏值
          amountObj[FCODE].earnings = toFixed(currentMoney - money);
        }
        amountObj[FCODE].priceDate = pdate;
        amountObj[FCODE].price = NAV;
      }
    });
    if (Datas.length > 0) {
      LeekFundConfig.setConfig('leek-fund.fundAmount', amountObj).then(() => {
        cacheFundAmountData(amountObj);
        console.log('🐥fundAmount has Updated ');
      });
    }
  } catch (e) {
    return [];
  }
}

export function cacheFundAmountData(amountObj: Object) {
  globalState.fundAmount = amountObj;
  globalState.fundAmountCacheDate = formatDate(new Date());
}

export default setAmount;
