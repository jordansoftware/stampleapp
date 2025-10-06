import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { StorageService } from './StorageService';

export class ReportService {
  static buildReportHtml({ title, periodLabel, workDays, totalHours }) {
    const rows = workDays
      .map(
        (d) => `
        <tr>
          <td>${StorageService.parseIsoDateToLocal(d.date).toLocaleDateString('de-DE')}</td>
          <td>${d.startTime}</td>
          <td>${d.endTime}</td>
          <td style="text-align:right">${d.totalHours.toFixed(2)}</td>
        </tr>`
      )
      .join('');

    return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #333; }
          h1 { margin: 0 0 8px 0; }
          .subtitle { color: #666; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border-bottom: 1px solid #eee; padding: 8px; font-size: 12px; }
          th { text-align: left; background: #f9f9f9; }
          .total { margin-top: 16px; font-weight: bold; text-align: right; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="subtitle">Zeitraum: ${periodLabel}</div>
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Start</th>
              <th>Ende</th>
              <th style="text-align:right">Stunden</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="total">Gesamtsumme: ${totalHours.toFixed(2)} Stunden</div>
      </body>
    </html>`;
  }

  static async generatePdf({ title, periodLabel, workDays, fileName }) {
    const totalHours = workDays.reduce((acc, d) => acc + (d.totalHours || 0), 0);
    const html = this.buildReportHtml({ title, periodLabel, workDays, totalHours });
    const { uri } = await Print.printToFileAsync({ html, fileName });
    return { uri, html };
  }
}


