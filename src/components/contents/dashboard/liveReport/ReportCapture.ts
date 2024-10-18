import ArrayHelper from "../../../../helper/ArrayHelper";
import DateHelper from "../../../../helper/DateHelper";
import SensorChartHelper from "../../../../helper/SensorChartHelper";
import ReportModel from "../../../../postProcess/ReportModel";

const takeSnapshoot = (runId: string, html: HTMLElement, reportModel: ReportModel ) => {
  const svgWrappers = html.getElementsByClassName('bb');
  const svgContents: string[] = [];
  let chartWidth = 0;
  let chartHeight = 0;
  for (let i = 0; i < svgWrappers.length; i += 1) {
    const wrapper = svgWrappers[i];
    const svgEl = wrapper.getElementsByTagName("svg")[0];
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
  const height = chartHeight * 1.7;
  const reportName = `${runId}-graph`;
  // FIXME
  const famPostProcess = ArrayHelper.create(0, 6, (i) => { return { label: `Fam-${i}`, ct: NaN, ampRate: NaN } });
  const roxPostProcess = ArrayHelper.create(0, 6, (i) => { return { label: `Rox-${i}`, ct: NaN, ampRate: NaN } });

  const cellWidth = width / 5;
  const amplification = `
    <g transform="translate(10, ${chartHeight + 60})">
      ${famPostProcess.map((val, i) => {
        const color = SensorChartHelper.SensorColors[i];
        const x = cellWidth * i + (cellWidth / 2);
        return `
          <text class="text-label" x="${x}" y="10" fill="${color}" font-weight="bold">
            ${val.label}
          </text>
          <text class="text-label" x="${x}" y="30" fill="${color}">
            amp: ${toFixed(val.ampRate, 2)} | ct: ${toFixed(val.ct, 2)}
          </text>
        `;
      }).join('')}
      ${roxPostProcess.map((val, i) => {
        const color = SensorChartHelper.SensorColors[i + 5];
        const x = cellWidth * i + (cellWidth / 2);
        return `
          <text class="text-label" x="${x}" y="70" fill="${color}" font-weight="bold">
            ${val.label}
          </text>
          <text class="text-label" x="${x}" y="90" fill="${color}">
            amp: ${toFixed(val.ampRate, 2)} | ct: ${toFixed(val.ct, 2)}
          </text>
        `;
      }).join('')}
    </g>
  `;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" height="${height}" width="${width}">
      <style>
        * {
          font-family: Arial;
        }
        path {
          fill: none;
        }
        line {
          fill: none;
        }
        .bb-axis path {
          stroke-color: blue;
          stroke-width: 1;
          fill: black;
        }
        .text-label {
          text-anchor: middle;
        }
      </style>
      <text x="10" y="20" font-weight="normal">Run ID</text>
      <text x="80" y="20" font-weight="bold">${runId}</text>
      <text x="10" y="40" font-weight="normal">Duration</text>
      <text x="80" y="40" font-weight="bold">${DateHelper.formatTimeSpan(reportModel.runDuration, 'm:s')}</text>
      ${svgContents.map((el, i) => {
        const fam = i === 0 && svgContents.length === 2 ? 'FAM' : undefined;
        const isRox = i === 1;
        const title = isRox ? 'ROX' : fam;
        const x = i * chartWidth + 10;
        return (
          `
          <g transform="translate(${x}, 50)">
            ${title ? `<text x="${chartWidth / 2}" y="10" font-weight="bold">${title ?? ''}</text>` : ''}
            ${el}
          </g>
          `
        );
      })}
      ${amplification}
    </svg>
  `;
  // const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  // create an URI pointing to that blob
  // const url = URL.createObjectURL(blob);
  // const win = open(url);
  // if (!win) {
  //   return;
  // }
  // win.onload = (evt) => URL.revokeObjectURL(url);
  // UrlHelper.downloadFile(blob, reportName, 'image/svg+xml');
  svgToPng(svg, (imgData) => {
    openPngPreview(imgData, reportName);
  });
};

const openPngPreview = (imgData: string, name: string) => {
  const content = `
    <!doctype html>
    <html>
      <head>
        <title>${name}</title>
        <style>
          a {
            text-decoration: none;
            padding: 0.5rem;
            color: #FFFFFF;
            font-family: Arial;
            border: solid 1px #ccc;
            border-radius: 5px;

            display: flex;
            align-items: center;
            width: min-content;
            white-space: pre;
            margin: auto;
          }

          a * {
            margin: auto;
          }

          a svg {
            margin-right: 0.5rem;
          }

          body {
            background-color: #000000;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <img alt="${name}" src="${imgData}" />
        </div>
        <p style="text-align: center; margin-bottom: 10px">
          <a id="download" download="${name}.png" href="${imgData}" id="link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" class="fmlx-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5ZM12 15L8 11H11V6C11 5 11 5 12 5C13 5 13 5 13 6V11H16L12 15ZM5 18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V16H17V16.5C17 16.7761 16.7761 17 16.5 17H7.5C7.22386 17 7 16.7761 7 16.5V16H5V18Z"></path></svg>
            <b>Download ${name}.png</b>
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
}

function modifyXAxisPath(innerHTML: string) {
  // Raw path -> <path class="domain" d="M0,6V0H936.7615966796875V6"></path>
  // 1. Replace d="M0,6Vxxxx" -> d="M0,1Vxxxxx"
  // 2. Replace xxxxV6"></path> -> xxxxxV1"></path>
  let html = innerHTML.replaceAll("<path class=\"domain\" d=\"M0,6V", "<path class=\"domain\" d=\"M0,1V");
  html = html.replaceAll("V6\"></path>", "V1\"></path>");
  return html;
}

function modifyYAxisPath(innerHTML: string) {
  // Raw path -> <path class="domain" d="M-6,1H0V266H-6"></path>
  // 1. Replace d="M-6,1Hxxxx" -> d="M-1,1Hxxxx"
  // 2. Replace xxxxH-6"></path> -> xxxxH-6"></path>
  let html = innerHTML.replaceAll("<path class=\"domain\" d=\"M-6,1H", "<path class=\"domain\" d=\"M-1,1H");
  html = html.replaceAll("H-6\"></path>", "H-1\"></path>");
  return html;
}

function svgToPng(svg, callback) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  svgUrlToPng(url, (imgData) => {
    callback(imgData);
    URL.revokeObjectURL(url);
  });
}

function svgUrlToPng(svgUrl, callback) {
  const svgImage = document.createElement('img');
  svgImage.crossOrigin = 'anonymous';
  document.body.appendChild(svgImage);
  svgImage.onload = function () {
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
      callback(imgData);
      svgImage.parentElement?.removeChild(svgImage);
      canvas.parentElement?.removeChild(canvas);
  };
  svgImage.src = svgUrl;
}

const toFixed = (number: number | undefined | null, decCount: number) => {
  if (!number) {
    return 0;
  }
  if (number.toFixed) {
    return number.toFixed(decCount);
  }
  return 0;
}

const ReportCapture = {
  takeSnapshoot,
};

export default ReportCapture;
