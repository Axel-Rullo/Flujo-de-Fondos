// graficos.js

(function () {

// ── PALETA DE COLORES (desde theme.css) ───────

const themeStyles = getComputedStyle(document.documentElement);
const colorVar = (nombre) => themeStyles.getPropertyValue(nombre).trim();

Chart.defaults.font.family = "'Inter', sans-serif";

// ── GRÁFICO CIRCULAR: FLUJO ───────────────────

function renderChartIngresosEgresos() {
    const ctx = document.getElementById('chart-ingresos-egresos');
    Chart.getChart(ctx)?.destroy(); // evita conflicto al recargar la vista

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Cuenta A', 'Cuenta B', 'Cuenta C', 'Cuenta D', 'Cuenta E'],
            datasets: [{
                data: [1000000, 2000000, 3000000, 4000000, 5000000],
                backgroundColor: [colorVar('--orange'), colorVar('--red'), colorVar('--blue'), colorVar('--yellow'), colorVar('--green')],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', align: 'start', labels: { color: colorVar('--white'), font: { size: 14, weight: 'bold' } } },
                datalabels: {
                    color: colorVar('--white'),
                    font: { weight: 'bold', size: 16 },
                    formatter: (value) => value.toLocaleString('es-AR'),
                    textStrokeColor: colorVar('--black'),
                    textStrokeWidth: 3
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// ── GRÁFICO DE BARRAS: CHEQUES ───────────────────

function renderChartCheques() {
    const ctx = document.getElementById('chart-cheques');
    Chart.getChart(ctx)?.destroy(); // evita conflicto al recargar la vista

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Corrientes', 'Diferidos', 'A Vencer', 'Vencidos'],
            datasets: [{
                data: [4000000, 3000000, 2000000, 1000000],
                backgroundColor: [colorVar('--green'), colorVar('--blue'), colorVar('--red'), colorVar('--yellow')],
                borderWidth: 2,
                borderColor: colorVar('--black'),
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                datalabels: {
                    color: colorVar('--white'),
                    font: { weight: 'bold', size: 16 },
                    formatter: (value) => value.toLocaleString('es-AR'),
                    textStrokeColor: colorVar('--black'),
                    textStrokeWidth: 3
                }
            },
            scales: {
                x: {
                    ticks: { color: colorVar('--white'), font: { size: 14, weight: 'bold' } },
                    grid: { display: false },
                    border: { display: true, color: colorVar('--black'), width: 2 }
                },
                y: {
                    ticks: { color: colorVar('--white'), font: { size: 14, weight: 'bold' } },
                    grid: { display: false },
                    border: { display: true, color: colorVar('--black'), width: 2 }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

renderChartIngresosEgresos();
renderChartCheques();

})();