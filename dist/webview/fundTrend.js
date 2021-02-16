"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
var globalState_1 = require("../globalState");
function fundTrend(code, name, immersiveBackground) {
    if (immersiveBackground === void 0) { immersiveBackground = globalState_1.default.immersiveBackground; }
    var panel = ReusedWebviewPanel_1.default.create('fundTrendWebview', "\u57FA\u91D1\u5B9E\u65F6\u8D70\u52BF(" + code + ")", vscode_1.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
    });
    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(function (message) {
        switch (message.name) {
            case 'immersiveBackground':
                vscode_1.commands.executeCommand('leek-fund.immersiveBackground', message.value);
        }
    });
    panel.webview.html = "<html>\n  <style>\n  .lsjz{\n    width: 100%;\n    min-width:600px;\n    text-align: center;\n  }\n  .red{\n    color:red;\n  }\n  .grn{\n    color:green;\n  }\n  .history{padding: 32px 24px;}\n  .trend{\n    width: 700px;\n    margin: 10px auto;\n    text-align: center;\n  }\n  .fund-sstrend{\n    width:700px;\n    background: #f1f0f0;\n  }\n  .title{\n    text-align:center;\n    font-size:18px;\n  }\n  .chart{\n    margin-bottom:30px;\n    width:100%;\n  }\n  body.require-immersive.vscode-dark img.fund-sstrend,\n  body.require-immersive.vscode-high-contrast img.fund-sstrend {\n    filter: invert(1);\n  }\n  body.require-immersive.vscode-dark .highcharts-background,\n  body.require-immersive.vscode-high-contrast .highcharts-background {\n    fill: var(--vscode-editor-background);\n  }\n  body.require-immersive.vscode-dark .highcharts-title,\n  body.require-immersive.vscode-dark .highcharts-axis-labels text,\n  body.require-immersive.vscode-dark .highcharts-button text,\n  body.require-immersive.vscode-dark .highcharts-range-selector-buttons .highcharts-button text,\n  body.require-immersive.vscode-high-contrast .highcharts-title,\n  body.require-immersive.vscode-high-contrast .highcharts-axis-labels text,\n  body.require-immersive.vscode-high-contrast .highcharts-button text,\n  body.require-immersive.vscode-high-contrast .highcharts-range-selector-buttons .highcharts-button text {\n    fill: var(--vscode-editor-foreground) !important;\n  }\n  body.require-immersive.vscode-dark .highcharts-range-selector-buttons .highcharts-button rect,\n  body.require-immersive.vscode-high-contrast .highcharts-range-selector-buttons .highcharts-button rect {\n    fill: var(--vscode-editor-selectionHighlightBackground);\n  }\n  body.require-immersive.vscode-dark #grandTotalCharsWrap .highcharts-range-selector,\n  body.require-immersive.vscode-high-contrast #grandTotalCharsWrap .highcharts-range-selector {\n    background: #333;\n    color: var(--vscode-editor-foreground);\n  }\n  </style>\n  <script src=\"http://j5.dfcfw.com/libs/jquery/1.8.3/jquery.min.js?v=" + new Date().getTime() + "\"></script>\n  <script src=\"http://j5.dfcfw.com/js/pinzhong/highstock201602_20161116195237.js?v=" + new Date().getTime() + "\"></script>\n  <script src=\"http://fund.eastmoney.com/pingzhongdata/" + code + ".js?v=" + new Date().getTime() + "\"></script>\n  <body>\n    <br/>\n    <div style=\"text-align: right;\">\n      <label for=\"immersive\">\u6C89\u6D78\u5F0F\u80CC\u666F\uFF08\u4EC5\u9002\u914D\u6697\u8272\u4E3B\u9898\uFF09<input id=\"immersive\" type=\"checkbox\"/></label>\n    </div>\n    <p style=\"text-align: center; font-size:18px; width: 400px;margin: 0 auto;\">\u300C" + name + "\u300D\u5B9E\u65F6\u8D70\u52BF\u56FE</p>\n    <div class=\"trend\"><img\n      class=\"fund-sstrend\"\n      src=\"http://j4.dfcfw.com/charts/pic6/" + code + ".png?v=" + new Date().getTime() + "\"\n      alt=\"\"\n    />\n   <!-- <p class=\"title\" style=\"text-align: center; font-size:18px; width: 400px;margin: 20px auto;\">\u5386\u53F2\u8D8B\u52BF\u56FE</p>\n    <img\n    class=\"fund-sstrend\"\n      src=\"http://j3.dfcfw.com/images/JJJZ1/" + code + ".png\"\n      alt=\"\"\n    /> -->\n    </div>\n    <div\n      id=\"netWorthTrend\"\n      class=\"netWorthTrend chart\"\n      style=\"height: 420px;margin-top:30px;\"\n    ></div>\n    <div\n      id=\"grandTotalCharsWrap\"\n      class=\"grandTotalCharsWrap chart\"\n      style=\" height: 420px;\"\n    ></div>\n    <script>\n    var sstrendImgEl = document.querySelector('.fund-sstrend');\n    var timer=null;\n    var code=\"" + code + "\";\n    if (timer) {\n      clearInterval(timer);\n      timer = null;\n    }\n    timer = setInterval(function () {\n      sstrendImgEl.src =\n        'http://j4.dfcfw.com/charts/pic6/' +\n       code+\n        '.png?v=' +\n        new Date().getTime();\n      console.log('\u5237\u65B0\u6570\u636E' + code);\n    }, 20000);\n  </script>\n  <script>\n      var highcharsConfig = {\n        global: {\n          useUTC: true,\n          timezoneOffset: -8 * 60,\n        },\n        lang: {\n          months: [\n            '\u4E00\u6708',\n            '\u4E8C\u6708',\n            '\u4E09\u6708',\n            '\u56DB\u6708',\n            '\u4E94\u6708',\n            '\u516D\u6708',\n            '\u4E03\u6708',\n            '\u516B\u6708',\n            '\u4E5D\u6708',\n            '\u5341\u6708',\n            '\u5341\u4E00\u6708',\n            '\u5341\u4E8C\u6708',\n          ],\n          weekdays: [\n            '\u661F\u671F\u65E5',\n            '\u661F\u671F\u4E00',\n            '\u661F\u671F\u4E8C',\n            '\u661F\u671F\u4E09',\n            '\u661F\u671F\u56DB',\n            '\u661F\u671F\u4E94',\n            '\u661F\u671F\u516D',\n          ],\n          rangeSelectorFrom: '\u4ECE',\n          rangeSelectorTo: '\u5230',\n          rangeSelectorZoom: '\u9009\u62E9\u65F6\u95F4',\n          noData: '\u6682\u65E0\u6570\u636E',\n          resetZoom: '',\n        },\n      };\n      Highcharts.setOptions(highcharsConfig);\n      var defineNetWorthTrend = function (json) {};\n      defineNetWorthTrend.prototype = {\n        init: function (dataList) {\n          $('#netWorthTrend').highcharts('StockChart', {\n            chart: {\n              marginRight: 20,\n              styledMode: true\n            },\n            title: {\n              text: '\u300C" + name + "\u300D\u5355\u4F4D\u51C0\u503C\u8D70\u52BF'\n           },\n            tooltip: {\n              xDateFormat: '%Y-%m-%d',\n              pointFormat: '<p>\u5355\u4F4D\u51C0\u503C\uFF1A{point.y:.4f}\u5143</p>',\n            },\n            credits: {\n              text:\n                '<span style=\"font-size:16px;color:#999999;font-family: Microsoft YaHei;\">\u679C\u5B50\u54E5\u7406\u8D22</span>',\n              href: 'javascript:;',\n              position: {\n                align: 'center',\n                y: -120,\n                x: 162,\n              },\n              style: {\n                cursor: 'default',\n                color: '#999999',\n                fontSize: '10px',\n                'font-family': 'Microsoft YaHei',\n              },\n            },\n            exporting: {\n              enabled: false,\n            },\n            scrollbar: {\n              enabled: false,\n            },\n            legend: {\n              enabled: false,\n            },\n            rangeSelector: {\n              inputEnabled: false,\n              buttonTheme: {\n                fill: 'none',\n                stroke: 'none',\n                'stroke-width': 0,\n                r: 0,\n                width: 31,\n                style: {\n                  color: '#333',\n                  fontWeight: 'normal',\n                },\n                states: {\n                  hover: {\n                    fill: '#4c74b1',\n                    style: {\n                      color: '#fff',\n                      fontWeight: 'bold',\n                    },\n                  },\n                  select: {\n                    fill: '#4c74b1',\n                    style: {\n                      color: '#fff',\n                      fontWeight: 'bold',\n                    },\n                  },\n                },\n              },\n              labelStyle: {\n                color: '#333',\n                fontWeight: 'bold',\n              },\n              buttons: [\n                {\n                  type: 'month',\n                  count: 1,\n                  text: '1\u6708',\n                },\n                {\n                  type: 'month',\n                  count: 3,\n                  text: '3\u6708',\n                },\n                {\n                  type: 'month',\n                  count: 6,\n                  text: '6\u6708',\n                },\n                {\n                  type: 'year',\n                  count: 1,\n                  text: '1\u5E74',\n                },\n                {\n                  type: 'year',\n                  count: 3,\n                  text: '3\u5E74',\n                },\n                {\n                  type: 'year',\n                  count: 5,\n                  text: '5\u5E74',\n                },\n                {\n                  type: 'ytd',\n                  text: '\u4ECA\u5E74\u6765',\n                },\n                {\n                  type: 'all',\n                  text: '\u6700\u5927',\n                },\n              ],\n              selected: 1,\n            },\n            yAxis: {\n              title: {\n                text: '',\n              },\n              labels: {\n                formatter: function () {\n                  return this.value.toFixed(2);\n                },\n              },\n              tickPixelInterval: 50,\n              opposite: false,\n              reversed: false,\n            },\n            xAxis: {\n              endOnTick: true,\n              maxPadding: 0.05,\n              type: 'datetime',\n              dateTimeLabelFormats: {\n                day: '%m-%d',\n                week: '%m-%d',\n                month: '%Y-%m',\n                year: '%Y',\n              },\n            },\n            plotOptions: {\n              area: {\n                fillColor: {\n                  linearGradient: {\n                    x1: 0,\n                    y1: 0,\n                    x2: 0,\n                    y2: 1,\n                  },\n                  stops: [\n                    [0, Highcharts.getOptions().colors[0]],\n                    [\n                      1,\n                      Highcharts.Color(Highcharts.getOptions().colors[0])\n                        .setOpacity(0)\n                        .get('rgba'),\n                    ],\n                  ],\n                },\n                marker: {\n                  radius: 2,\n                },\n                lineWidth: 2,\n                states: {\n                  hover: {\n                    lineWidth: 1,\n                  },\n                },\n                threshold: null,\n                dataGrouping: {\n                  enabled: false,\n                  approximation: 'open',\n                  units: [['day', [1]]],\n                  dateTimeLabelFormats: {\n                    day: ['%Y-%m-%d', '%Y-%m-%d'],\n                  },\n                },\n              },\n            },\n            navigator: {\n              xAxis: {\n                dateTimeLabelFormats: {\n                  day: '%Y-%m-%d',\n                  week: '%Y',\n                  month: '%Y-%m',\n                  year: '%Y-%m',\n                },\n                labels: {\n                  align: 'center',\n                },\n              },\n            },\n            noData: {\n              style: {\n                fontSize: '12px',\n                color: '#808080',\n                fontWeight: '100',\n              },\n            },\n            series: [\n              {\n                type: 'area',\n                data: dataList,\n                turboThreshold: Number.MAX_VALUE,\n                tooltip: {\n                  valueDecimals: 2,\n                },\n              },\n            ],\n          });\n        },\n      };\n      function addGrandTotalMap(dataList, dataType) {\n        var s = this;\n        var xAxisMonth = '%Y-%m';\n        if (dataType === 'y') xAxisMonth = '%y-%m';\n        $('#grandTotalCharsWrap').highcharts('StockChart', {\n          chart: {\n            marginRight: 20,\n            styledMode: true\n          },\n          title: {\n            text: '\u300C" + name + "\u300D\u7D2F\u8BA1\u6536\u76CA\u7387\u8D70\u52BF'\n         },\n          noData: {\n            style: {\n              fontSize: '14px',\n              color: '#808080',\n            },\n          },\n          //   colors: ['#4c74b1', '#a44949', '#666'],\n          credits: {\n            text:\n              '<span style=\"font-size:16px;color:#999999;font-family: Microsoft YaHei;\">\u679C\u5B50\u54E5\u7406\u8D22</span>',\n            href: 'javascript:;',\n            position: {\n              align: 'center',\n              y: -117,\n              x: 302,\n            },\n            style: {\n              cursor: 'default',\n              color: '#999999',\n              fontSize: '10px',\n              'font-family': 'Microsoft YaHei',\n            },\n          },\n          exporting: {\n            enabled: false,\n          },\n          scrollbar: {\n            enabled: false,\n          },\n          legend: {\n            enabled: true,\n            useHTML: true,\n            labelFormatter: function () {\n              return this.name;\n            },\n            margin: 30,\n            align: 'left',\n          },\n          xAxis: {\n            type: 'datetime',\n            dateTimeLabelFormats: {\n              day: '%m-%d',\n              week: '%m-%d',\n              month: xAxisMonth,\n              year: '%Y',\n            },\n          },\n          yAxis: {\n            labels: {\n              formatter: function () {\n                return (\n                  (this.value > 0 ? ' + ' : '') + this.value.toFixed(2) + '%'\n                );\n              },\n            },\n            plotLines: [\n              {\n                value: 0,\n                width: 2,\n                color: 'silver',\n              },\n            ],\n          },\n          plotOptions: {\n            line: {\n              dataGrouping: {\n                approximation: 'open',\n                smoothed: true,\n                dateTimeLabelFormats: {\n                  millisecond: [''],\n                  second: [''],\n                  minute: [''],\n                  hour: [''],\n                  day: ['%Y-%m-%d'],\n                  month: ['%Y-%m-%d'],\n                  year: ['%Y-%m-%d'],\n                  all: ['%Y-%m-%d'],\n                },\n              },\n            },\n          },\n          tooltip: {\n            xDateFormat: '%Y-%m-%d',\n            pointFormat:\n              '<span style=\"color:{series.color}\">{series.name}</span>: <b>{point.y}%</b><br/>',\n            valueDecimals: 2,\n          },\n          navigator: {\n            enabled: false,\n          },\n          rangeSelector: {\n            enabled: true,\n            buttons: [\n              {\n                type: 'month',\n                count: 1,\n                text: '1\u6708',\n              },\n              {\n                type: 'month',\n                count: 3,\n                text: '3\u6708',\n              },\n              {\n                type: 'month',\n                count: 6,\n                text: '6\u6708',\n              },\n              {\n                type: 'year',\n                count: 1,\n                text: '1\u5E74',\n              },\n              {\n                type: 'all',\n                text: '\u6700\u5927',\n              },\n            ],\n          },\n          series: dataList,\n        });\n      }\n      defineNetWorthTrend.prototype.init(Data_netWorthTrend);\n      addGrandTotalMap(Data_grandTotal, 'y');\n    </script>\n    <script>\n    {\n      const vscode = acquireVsCodeApi();\n      let isChecked = " + immersiveBackground + ";\n      $('body').toggleClass('require-immersive', isChecked);\n      $('#immersive').prop('checked', isChecked);\n      $('#immersive').on('click', function() {\n        isChecked = $(this).prop('checked');\n        $('body').toggleClass('require-immersive', isChecked);\n        vscode.postMessage({ name: 'immersiveBackground', value: isChecked });\n      });\n    };\n    </script>\n  </body></html>";
}
exports.default = fundTrend;
//# sourceMappingURL=fundTrend.js.map