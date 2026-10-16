import { printToFileAsync } from "expo-print";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { File, Paths } from "expo-file-system";
import { FinancialReportSummary } from "../types/finance.types";

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export async function exportReportPdf(report: FinancialReportSummary): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reporte Financiero</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 40px;
      color: #20372d;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #006045;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand {
      font-size: 26px;
      font-weight: 800;
      color: #006045;
      letter-spacing: -0.5px;
    }
    .brand span {
      color: #b68d4f;
    }
    .title {
      font-size: 18px;
      font-weight: 700;
      margin-top: 4px;
      color: #1a1f1d;
    }
    .period {
      font-size: 13px;
      color: #5c6b60;
      text-align: right;
    }
    .summary-card {
      background: #f4f6ef;
      border: 1px solid #e1e6de;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 28px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5ebe1;
      font-size: 14px;
    }
    .summary-row:last-child {
      border-bottom: none;
      font-weight: 800;
      font-size: 16px;
      color: #006045;
      padding-top: 12px;
    }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #20372d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 13px;
    }
    th {
      background: #006045;
      color: #ffffff;
      text-align: left;
      padding: 10px 12px;
      font-weight: 600;
      border-radius: 4px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e1e6de;
    }
    tr:nth-child(even) td {
      background: #fafbfa;
    }
    .text-right {
      text-align: right;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: #e2efd0;
      color: #3a6412;
    }
    .badge-parts {
      background: #ebe4f3;
      color: #5c3b88;
    }
    .notice {
      background: #e6eee6;
      border-left: 4px solid #006045;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 12px;
      color: #3a4d3f;
      line-height: 1.5;
      margin-top: 24px;
    }
    .footer {
      margin-top: 36px;
      text-align: center;
      font-size: 11px;
      color: #8da093;
      border-top: 1px solid #edf1e7;
      padding-top: 16px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">pitstop<span>.</span></div>
      <div class="title">Reporte Financiero Consolidado</div>
    </div>
    <div class="period">
      <strong>Período consultado:</strong><br/>
      ${report.from} al ${report.to}
    </div>
  </div>

  <div class="summary-card">
    <div class="summary-row">
      <span>Venta antes de descuento</span>
      <strong>${formatMoney(report.salesBeforeDiscount)}</strong>
    </div>
    <div class="summary-row">
      <span>Descuentos aplicados</span>
      <span>-${formatMoney(report.discounts)}</span>
    </div>
    <div class="summary-row">
      <span>IVA por separado (16%)</span>
      <span>${formatMoney(report.taxSeparate)}</span>
    </div>
    <div class="summary-row">
      <span>Comisiones bancarias por tarjeta</span>
      <span style="color: #a1281f;">-${formatMoney(report.cardCommissions)}</span>
    </div>
    <div class="summary-row">
      <span>Venta sin IVA ni descuento</span>
      <span>${formatMoney(report.salesNet)}</span>
    </div>
    <div class="summary-row">
      <span>Flujo neto recibido en caja</span>
      <span>${formatMoney(report.netCashFlow)}</span>
    </div>
  </div>

  <div class="section-title">Desglose por Servicios Realizados</div>
  <table>
    <thead>
      <tr>
        <th>Servicio</th>
        <th>Tipo</th>
        <th class="text-right">Órdenes</th>
        <th class="text-right">Participación</th>
        <th class="text-right">Monto Total</th>
      </tr>
    </thead>
    <tbody>
      ${report.servicesBreakdown
        .map(
          (srv) => `
        <tr>
          <td><strong>${srv.name}</strong></td>
          <td><span class="badge ${srv.category === "parts" ? "badge-parts" : ""}">${srv.category === "parts" ? "Refacciones" : "Mano de obra"}</span></td>
          <td class="text-right">${srv.ordersCount}</td>
          <td class="text-right">${srv.percentage}%</td>
          <td class="text-right"><strong>${formatMoney(srv.totalAmount)}</strong></td>
        </tr>
      `,
        )
        .join("")}
      <tr>
        <td colspan="4" style="font-weight: 700;">Subtotal Mano de Obra:</td>
        <td class="text-right"><strong>${formatMoney(report.totalLabor)}</strong></td>
      </tr>
      <tr>
        <td colspan="4" style="font-weight: 700;">Subtotal Refacciones:</td>
        <td class="text-right"><strong>${formatMoney(report.totalParts)}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="notice">
    <strong>Nota informativa:</strong> El IVA no es ganancia. Las ventas provienen solo de cierres. El flujo de caja incluye anticipos, impuestos, comisiones e ingresos o gastos manuales; no es utilidad.
  </div>

  <div class="footer">
    Reporte generado automáticamente desde Pitstop Taller ERP &middot; ${new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
  </div>
</body>
</html>
  `;

  const { uri } = await printToFileAsync({ html });
  const isAvailable = await isAvailableAsync();
  if (isAvailable) {
    await shareAsync(uri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
      dialogTitle: "Compartir Reporte Financiero",
    });
  }
}

export async function exportReportCsv(report: FinancialReportSummary): Promise<void> {
  const rows: string[] = [];
  rows.push("\uFEFFREPORTE FINANCIERO CONSOLIDADO - PITSTOP TALLER");
  rows.push(`"Período consultado:","${report.from} al ${report.to}"`);
  rows.push(`"Fecha de generación:","${new Date().toISOString()}"`);
  rows.push("");
  rows.push("RESUMEN FINANCIERO");
  rows.push("Concepto,Monto MXN");
  rows.push(`"Venta antes de descuento",${report.salesBeforeDiscount.toFixed(2)}`);
  rows.push(`"Descuentos",-${report.discounts.toFixed(2)}`);
  rows.push(`"IVA por separado",${report.taxSeparate.toFixed(2)}`);
  rows.push(`"Comisiones de tarjeta",-${report.cardCommissions.toFixed(2)}`);
  rows.push(`"Venta sin IVA ni descuento",${report.salesNet.toFixed(2)}`);
  rows.push(`"Flujo neto recibido en caja",${report.netCashFlow.toFixed(2)}`);
  rows.push("");
  rows.push("COMPOSICIÓN DE INGRESOS");
  rows.push("Categoría,Total MXN");
  rows.push(`"Mano de Obra",${report.totalLabor.toFixed(2)}`);
  rows.push(`"Refacciones e Insumos",${report.totalParts.toFixed(2)}`);
  rows.push("");
  rows.push("DESGLOSE POR SERVICIOS");
  rows.push("Servicio,Tipo,Órdenes,Participación %,Total MXN");
  report.servicesBreakdown.forEach((srv) => {
    rows.push(
      `"${srv.name}","${srv.category === "parts" ? "Refacciones" : "Mano de obra"}",${srv.ordersCount},${srv.percentage}%,${srv.totalAmount.toFixed(2)}`,
    );
  });

  const csvContent = rows.join("\r\n");
  const fileName = `reporte-financiero-${Date.now()}.csv`;
  const file = new File(Paths.cache, fileName);
  await file.write(csvContent);

  const isAvailable = await isAvailableAsync();
  if (isAvailable) {
    await shareAsync(file.uri, {
      mimeType: "text/csv",
      dialogTitle: "Exportar Reporte a Excel / CSV",
    });
  }
}

