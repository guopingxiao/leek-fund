import { commands, ExtensionContext, window } from 'vscode';
import fundSuggestList from './data/fundSuggestData';
import globalState from './globalState';

import { 
  FundProvider,
  FundService,
  StockProvider,
  StockService
} from './explorer';

import { 
  LeekFundConfig,
  LeekTreeItem,
  checkForUpdate,
  colorOptionList,
  randomColor
} from './shared';

import { 
  allFundTrend,
  mainFundFlow,
  fundFlow,
  fundHistory,
  fundPosition,
  fundRank,
  fundTrend,
  leekCenterView,
  setAmount,
  stockTrend,
  stockTrendPic
} from './webview';

export function registerViewEvent(
  context: ExtensionContext,
  fundService: FundService,
  stockService: StockService,
  fundProvider: FundProvider,
  stockProvider: StockProvider,
) {

  // Fund operation
  commands.registerCommand('leek-fund.refreshFund', () => {
    fundProvider.refresh();
    const handler = window.setStatusBarMessage(`基金数据已刷新`);
    setTimeout(() => {
      handler.dispose();
    }, 1000);
  });
  commands.registerCommand('leek-fund.deleteFund', (target) => {
    LeekFundConfig.removeFundCfg(target.id, () => {
      fundProvider.refresh();
    });
  });
  commands.registerCommand('leek-fund.addFund', () => {
    window.showQuickPick(fundSuggestList, { placeHolder: '请输入基金代码' }).then((code) => {
      if (!code) {
        return;
      }
      LeekFundConfig.updateFundCfg(code.split('|')[0], () => {
        fundProvider.refresh();
      });
    });
  });
  commands.registerCommand('leek-fund.sortFund', () => {
    fundProvider.changeOrder();
    fundProvider.refresh();
  });
  commands.registerCommand('leek-fund.sortAmountFund', () => {
    fundProvider.changeAmountOrder();
    fundProvider.refresh();
  });

  // Stock operation
  commands.registerCommand('leek-fund.refreshStock', () => {
    stockProvider.refresh();
    const handler = window.setStatusBarMessage(`股票数据已刷新`);
    setTimeout(() => {
      handler.dispose();
    }, 1000);
  });
  commands.registerCommand('leek-fund.deleteStock', (target) => {
    LeekFundConfig.removeStockCfg(target.id, () => {
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
  commands.registerCommand('leek-fund.addStock', () => {
    // vscode QuickPick 不支持动态查询，只能用此方式解决
    // https://github.com/microsoft/vscode/issues/23633
    const qp = window.createQuickPick();
    qp.items = [{ label: '请输入关键词查询，如：0000001 或 上证指数' }];
    let code: string | undefined;
    let timer: NodeJS.Timer | null = null;
    qp.onDidChangeValue((value) => {
      qp.busy = true;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(async () => {
        const res = await stockService.getStockSuggestList(value);
        qp.items = res;
        qp.busy = false;
      }, 100); // 简单防抖
    });
    qp.onDidChangeSelection((e) => {
      if (e[0].description) {
        code = e[0].label && e[0].label.split(' | ')[0];
      }
    });
    qp.show();
    qp.onDidAccept(() => {
      if (!code) {
        return;
      }
      // 存储到配置的时候是接口的参数格式，接口请求时不需要再转换
      const newCode = code.replace('gb', 'gb_').replace('us', 'usr_');
      LeekFundConfig.updateStockCfg(newCode, () => {
        stockProvider.refresh();
      });
      qp.hide();
      qp.dispose();
    });
  });
  commands.registerCommand('leek-fund.sortStock', () => {
    stockProvider.changeOrder();
    stockProvider.refresh();
  });

  /**
   * WebView
   */
  // 股票点击
  context.subscriptions.push(
    commands.registerCommand('leek-fund.stockItemClick', (code, name, text, stockCode) =>
      stockTrend(code, name, stockCode)
    )
  );
  // 基金点击
  context.subscriptions.push(
    commands.registerCommand('leek-fund.fundItemClick', (code, name) => fundTrend(code, name))
  );
  // 基金右键历史信息点击
  commands.registerCommand('leek-fund.viewFundHistory', (item) => fundHistory(item));
  // 基金持仓
  commands.registerCommand('leek-fund.viewFundPosition', (item) => fundPosition(item));
  // 基金排行
  commands.registerCommand('leek-fund.viewFundRank', () => fundRank());
  // 基金走势图
  commands.registerCommand('leek-fund.viewFundTrend', () => allFundTrend(fundService));
  // 资金流向
  commands.registerCommand('leek-fund.viewFundFlow', () => fundFlow());
  commands.registerCommand('leek-fund.viewMainFundFlow', () => mainFundFlow());
  // 基金置顶
  commands.registerCommand('leek-fund.setFundTop', (target) => {
    LeekFundConfig.setFundTopCfg(target.id, () => {
      fundProvider.refresh();
    });
  });
  // 股票置顶
  commands.registerCommand('leek-fund.setStockTop', (target) => {
    LeekFundConfig.setStockTopCfg(target.id, () => {
      fundProvider.refresh();
    });
  });
  // 设置基金持仓金额
  commands.registerCommand('leek-fund.setFundAmount', () => {
    if (fundService.fundList.length === 0) {
      window.showWarningMessage('数据刷新中，请重试！');
      return;
    }
    setAmount(fundService);
  });
  commands.registerCommand('leek-fund.stockTrendPic', (target) => {
    const { code, name, type, symbol } = target.info;
    stockTrendPic(code, name, `${type}${symbol}`);
  });

  /**
   * Settings command
   */
  context.subscriptions.push(
    commands.registerCommand('leek-fund.hideText', () => {
      fundService.toggleLabel();
      stockService.toggleLabel();
      fundProvider.refresh();
      stockProvider.refresh();
    })
  );

  context.subscriptions.push(
    commands.registerCommand('leek-fund.setStockStatusBar', () => {
      const stockList = stockService.stockList;
      const stockNameList = stockList.map((item: LeekTreeItem) => {
        return {
          label: `${item.info.name}`,
          description: `${item.info.code}`,
        };
      });
      window
        .showQuickPick(stockNameList, {
          placeHolder: '输入过滤选择，支持多选（限4个）',
          canPickMany: true,
        })
        .then((res) => {
          if (!res) {
            res = [];
          }
          let codes = res.map((item) => item.description);
          if (codes.length > 4) {
            codes = codes.slice(0, 4);
          }
          LeekFundConfig.updateStatusBarStockCfg(codes, () => {
            const handler = window.setStatusBarMessage(`下次数据刷新见效`);
            setTimeout(() => {
              handler.dispose();
            }, 1500);
          });
        });
    })
  );

  context.subscriptions.push(
    commands.registerCommand('leek-fund.customSetting', () => {
      const colorList = colorOptionList();
      window
        .showQuickPick(
          [
            { label: '状态栏股票设置', description: 'statusbar-stock' },
            { label: '状态栏股票涨📈的文字颜色', description: 'statusbar-rise' },
            { label: '状态栏股票跌📉的文字颜色', description: 'statusbar-fall' },
            { label: '基金&股票涨跌图标更换', description: 'icontype' },
            { label: '👀显示/隐藏文本', description: 'hideText' },
            {
              label: globalState.showEarnings ? '隐藏盈亏' : '👀显示盈亏',
              description: 'earnings',
            },
            {
              label: globalState.remindSwitch ? '关闭提醒' : '🔔️打开提醒',
              description: 'remindSwitch',
            },
          ],
          {
            placeHolder: '第一步：选择设置项',
          }
        )
        .then((item: any) => {
          if (!item) {
            return;
          }
          const type = item.description;
          // 状态栏颜色设置
          if (type === 'statusbar-rise' || type === 'statusbar-fall') {
            window
              .showQuickPick(colorList, {
                placeHolder: `第二步：设置颜色（${item.label}）`,
              })
              .then((colorItem: any) => {
                if (!colorItem) {
                  return;
                }
                let color = colorItem.description;
                if (color === 'random') {
                  color = randomColor();
                }
                LeekFundConfig.setConfig(
                  type === 'statusbar-rise' ? 'leek-fund.riseColor' : 'leek-fund.fallColor',
                  color
                );
              });
          } else if (type === 'statusbar-stock') {
            // 状态栏股票设置
            commands.executeCommand('leek-fund.setStockStatusBar');
          } else if (type === 'icontype') {
            // 基金&股票涨跌图标
            window
              .showQuickPick(
                [
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
                ],
                {
                  placeHolder: `第二步：选择基金&股票涨跌图标`,
                }
              )
              .then((iconItem: any) => {
                if (!iconItem) {
                  return;
                }
                if (globalState.iconType !== iconItem.description) {
                  LeekFundConfig.setConfig('leek-fund.iconType', iconItem.description);
                  globalState.iconType = iconItem.description;
                }
              });
          } else if (type === 'earnings') {
            const newValue = globalState.showEarnings === 1 ? 0 : 1;
            LeekFundConfig.setConfig('leek-fund.showEarnings', newValue);
            globalState.showEarnings = newValue;
          } else if (type === 'hideText') {
            commands.executeCommand('leek-fund.hideText');
          } else if (type === 'remindSwitch') {
            commands.executeCommand('leek-fund.toggleRemindSwitch');
          }
        });
    })
  );

  context.subscriptions.push(
    commands.registerCommand('leek-fund.openConfigPage', () => {
      commands.executeCommand('workbench.action.openSettings', '@ext:xiaoguoping.leek-fund');
    })
  );


  context.subscriptions.push(
    commands.registerCommand('leek-fund.toggleRemindSwitch', (on?: number) => {
      const newValue = on !== undefined ? (on ? 1 : 0) : globalState.remindSwitch === 1 ? 0 : 1;
      LeekFundConfig.setConfig('leek-fund.stockRemindSwitch', newValue);
      globalState.remindSwitch = newValue;
    })
  );

  context.subscriptions.push(
    commands.registerCommand('leek-fund.changeStatusBarItem', (stockId) => {
      const stockList = stockService.stockList;
      const stockNameList = stockList
        .filter((stock) => stock.id !== stockId)
        .map((item: LeekTreeItem) => {
          return {
            label: `${item.info.name}`,
            description: `${item.info.code}`,
          };
        });

      window
        .showQuickPick(stockNameList, {
          placeHolder: '更换状态栏个股',
        })
        .then((res) => {
          if (!res) return;
          const statusBarStocks = LeekFundConfig.getConfig('leek-fund.statusBarStock');
          const newCfg = [...statusBarStocks];
          const newStockId = res.description;
          const index = newCfg.indexOf(stockId);
          if (statusBarStocks.includes(newStockId)) {
            window.showWarningMessage(`「${res.label}」已在状态栏`);
            return;
          }
          if (index > -1) {
            newCfg[newCfg.indexOf(stockId)] = res.description;
          }
          LeekFundConfig.updateStatusBarStockCfg(newCfg, () => {
            const handler = window.setStatusBarMessage(`下次数据刷新见效`);
            setTimeout(() => {
              handler.dispose();
            }, 1500);
          });
        });
    })
  );

  context.subscriptions.push(
    commands.registerCommand('leek-fund.immersiveBackground', (isChecked: boolean) => {
      LeekFundConfig.setConfig('leek-fund.immersiveBackground', isChecked);
      globalState.immersiveBackground = isChecked;
    })
  );

  checkForUpdate();
}
