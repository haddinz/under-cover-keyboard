import ArrayHelper from '../../../../../helper/ArrayHelper';
import DateHelper from '../../../../../helper/DateHelper';
import SensorChartHelper from '../../../../../helper/SensorChartHelper';
import UrlHelper from '../../../../../helper/UrlHelper';
import ChartSeriesData from '../../../../../models/sensorChart/ChartSeriesData';
import AnalyticalDetaiItem from './../AnalyticalDetailItem';

const ChannelProperties = {
  Fam: ArrayHelper.create(0, 5, (i) => i),
  Rox: ArrayHelper.create(0, 5, (i) => i),
};

const exportValuesCsv = (data: ChartSeriesData, fileName: string) => {
  const rows = Math.max(...data.columns.map((c) => c.length));
  const cols = data.columns.length;
  const content: string[] = [];
  for (let row = 0; row < rows; row += 1) {
    const rowContent: any[] = [];
    for (let col = 0; col < cols; col += 1) {
      const colContent = data.columns[col];
      if (colContent && colContent[row]) {
        rowContent.push(colContent[row]);
      }
    }
    content.push(rowContent.join(','));
  }
  UrlHelper.downloadFile(content.join('\r\n'), fileName, 'text/plain');
};

const exportDetailCsv = (data: AnalyticalDetaiItem[], fileName: string) => {
  const content: string[] = ['No,Channel,Ct,Tm'];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    content.push([i + 1, item.label, item.ct, item.meltTemp].join(','));
  }
  UrlHelper.downloadFile(content.join('\r\n'), fileName, 'text/plain');
};

const exportGraph = (html: HTMLElement[], reportModel: { identifier: string, runDuration?: string }, graphName: string, titles: string[] = []) => {
  const runId = reportModel.identifier;
  const svgWrappers = html.map((h) => h.getElementsByClassName('bb')[0]);
  const svgContents: string[] = [];
  let chartWidth = 0;
  let chartHeight = 0;
  for (let i = 0; i < svgWrappers.length; i += 1) {
    const wrapper = svgWrappers[i];
    const svgEl = wrapper.getElementsByTagName('svg')[0];
    const w = svgEl.width.baseVal.value;
    const h = svgEl.height.baseVal.value;
    if (w > chartWidth) {
      chartWidth = w;
    }
    if (h > chartHeight) {
      chartHeight = h;
    }
    let elHtml = modifyXAxisPath(svgEl.innerHTML);
    elHtml = modifyYAxisPath(elHtml);
    svgContents.push(elHtml);
  }
  const width = 100 + chartWidth * svgContents.length;
  const height = chartHeight + 100;
  const duration = reportModel.runDuration ? DateHelper.formatTimeSpan(reportModel.runDuration, 'm:s') : null;
  const durationElement = duration ? `<text x="10" y="40" font-weight="normal">Duration</text><text x="80" y="40" font-weight="bold">${duration}</text>` : '';

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" height="${height}" width="${width}">
    <style>
      * { font-family: Arial; }
      path { fill: none; shape-rendering: geometricPrecision; }
      line { fill: none; }
      .bb-line { stroke-width: 1.5px }
      .bb-axis path { stroke-color: blue;stroke-width: 1; fill: black; }
      .text-label { text-anchor: middle; }
    </style>
    <text x="10" y="20" font-weight="normal">Run ID</text>
    <text x="80" y="20" font-weight="bold">${runId}</text>
      
  ${durationElement}
  ${svgContents.map((el, i) => {
    const y = 50;
    const x = i * chartWidth + 10;
    const title = titles[i];
    return (
      `
      <g transform="translate(${x}, ${y})">
        ${title ? `<text x="${chartWidth / 2}" y="10" font-weight="bold">${title ?? ''}</text>` : ''}
        ${el}
      </g>
      `
    );
  })}
  <g transform="translate(10, ${height - 50})">
  ${ChannelProperties.Fam.map((f, i) => {
    const x = 10 + i * 70;
    const legendSize = 10;
    const color = SensorChartHelper.SensorColors[i];
    return `
      <rect x="${x}" y="10" width="${legendSize}" height="10" fill="${color}" />
      <text x="${x + legendSize + 5}" y="10" dominant-baseline="hanging">Fam-${i}</text>
    `;
  })}
  </g>
  <g transform="translate(400, ${height - 50})">
  ${ChannelProperties.Rox.map((f, i) => {
    const x = 10 + i * 70;
    const legendSize = 10;
    const color = SensorChartHelper.SensorColors[i + 5];
    return `
      <rect x="${x}" y="10" width="${legendSize}" height="10" fill="${color}" />
      <text x="${x + legendSize + 5}" y="10" dominant-baseline="hanging">Rox-${i}</text>
    `;
  })}
  </g>
  </svg>
  `;
  return new Promise((res) => {
    svgToPng(svg, (imgData) => {
      openPngPreview(imgData, graphName);
      res(null);
    });
  });
};

const openPngPreview = (imgData: string, name: string) => {  
  const content = `
    <!doctype html>
    <html>
      <head>
        <title>${name}</title>
        <style>
          #download {
            text-decoration: none;
            padding: 0.5rem;
            font-family: Arial;
            border: solid 1px #ccc;
            border-radius: 5px;
            background-color: darkgreen;
            width: min-content;
            margin: auto;
          }

          a, a:link, a:visited, a:hover, a:focus, a:active{
            color: #fff;
          }
          
          body { min-height: 100vh; margin: 0; padding: 0; background-color: #000 }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin: auto">
          <img alt="${name}" src="${imgData}" />
        </div>
        <p style="text-align: center; margin-bottom: 10px">
          <a id="download" download="${name}.png" href="${imgData}">
            &#128190; Save ${name}.png
          </a>
        </p>
        <script>
          function download() {
            const btn = document.getElementById('download');
            if (btn)
              btn.click();
          }
          // download();
        </script>
      </body>
    </html>
  `;
  const file = new window.Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(file);
  window.open(url);
};

function modifyXAxisPath(innerHTML: string) {
  // Raw path -> <path class="domain" d="M0,6V0H936.7615966796875V6"></path>
  // 1. Replace d="M0,6Vxxxx" -> d="M0,1Vxxxxx"
  // 2. Replace xxxxV6"></path> -> xxxxxV1"></path>
  let html = innerHTML.replaceAll('<path class="domain" d="M0,6V', '<path class="domain" d="M0,1V');
  html = html.replaceAll('V6"></path>', 'V1"></path>');
  return html;
}

function modifyYAxisPath(innerHTML: string) {
  // Raw path -> <path class="domain" d="M-6,1H0V266H-6"></path>
  // 1. Replace d="M-6,1Hxxxx" -> d="M-1,1Hxxxx"
  // 2. Replace xxxxH-6"></path> -> xxxxH-6"></path>
  let html = innerHTML.replaceAll('<path class="domain" d="M-6,1H', '<path class="domain" d="M-1,1H');
  html = html.replaceAll('H-6"></path>', 'H-1"></path>');
  return html;
}

function svgToPng(svgContent: string, callback: (imgData: string) => any) {
  const url = URL.createObjectURL(new Blob([svgContent], { type: 'image/svg+xml' }));
  svgUrlToPng(url, (imgData) => {
    callback(imgData);
    URL.revokeObjectURL(url);
  });
}

function svgUrlToPng(svgUrl: string, callback: (imgData: string) => any) {
  const svgImage = document.createElement('img');
  svgImage.crossOrigin = 'anonymous';
  document.body.appendChild(svgImage);
  svgImage.onload = () => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = svgImage.width;
    canvas.height = svgImage.height;
    ctx.drawImage(svgImage, 0, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(svgImage, 0, 0);

    const imgData = canvas.toDataURL('image/png');
    svgImage.parentElement?.removeChild(svgImage);
    canvas.parentElement?.removeChild(canvas);
    callback(imgData);
  };
  svgImage.src = svgUrl;
}

const AnalyticCapture = {
  exportGraph,
  exportValuesCsv,
  exportDetailCsv,
};

export default AnalyticCapture;
