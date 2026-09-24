// FECHAS

function getFechaLocal() {
    const hoy = new Date();

    return hoy.getFullYear() + '-' +
        String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
        String(hoy.getDate()).padStart(2, '0');
}

function sumarDias(fechaStr, dias) {
    if (!fechaStr) return null;

    const soloFecha = fechaStr.split('T')[0]; // por si llega con hora incluida (ej. TIMESTAMP)
    const fecha = new Date(soloFecha + 'T00:00:00');
    if (isNaN(fecha.getTime())) return null;

    fecha.setDate(fecha.getDate() + dias);

    // Construido a mano en vez de toISOString(): toISOString() convierte a UTC
    // antes de formatear, lo que corre la fecha un día en timezones adelantadas a UTC.
    return fecha.getFullYear() + '-' +
        String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
        String(fecha.getDate()).padStart(2, '0');
}

function diasHastaVencimiento(fecha_cobro, plazoDias = 30) {
    if (!fecha_cobro) return null;

    const vencimientoStr = sumarDias(fecha_cobro, plazoDias);
    if (!vencimientoStr) return null;

    const vencimiento = new Date(vencimientoStr + 'T00:00:00');
    const hoy = new Date(getFechaLocal() + 'T00:00:00');

    return Math.round((vencimiento - hoy) / (1000 * 60 * 60 * 24));
}

// CANTIDAD DE DINERO

if (!window.__importeFormatterInit) {
    window.__importeFormatterInit = true;

    document.addEventListener("input", function(e) {
        if (!e.target.matches("#saldo_cuenta, #importe")) return;

        const input = e.target;
        const cursorPos = input.selectionStart;
        const rawBefore = input.value;

        // Se cuentan dígitos Y el punto decimal (no las comas, que son puro formato
        // reconstruido en cada tecla). Si solo se contaran dígitos, el cursor nunca
        // podría quedar "después del punto" cuando no hay decimales aún escritos,
        // y el Backspace terminaría borrando el dígito de al lado en vez del punto.
        const digitsBeforeCursor = rawBefore.slice(0, cursorPos).replace(/[^\d.]/g, "").length;

        let valor = rawBefore.replace(/[^\d.]/g, "");

        const posicionPunto = valor.indexOf(".");
        if (posicionPunto !== -1) {
            valor =
                valor.substring(0, posicionPunto + 1) +
                valor.substring(posicionPunto + 1).replace(/\./g, "");
        }

        let partes = valor.split(".");
        // Tope de 15 dígitos enteros: por encima de Number.MAX_SAFE_INTEGER (~9×10^15),
        // Number() pierde precisión y empieza a redondear los últimos dígitos a cero.
        // Ningún importe real del sistema necesita más que esto.
        let entero = partes[0].replace(/\D/g, "").slice(0, 15);

        // Máximo 2 decimales
        let decimales = partes[1] !== undefined
            ? partes[1].replace(/\D/g, "").slice(0, 2)
            : "";

        const tienePunto = valor.includes(".");

        // Si el usuario tipeó "." como primer caracter, entero queda vacío;
        // mostramos "0" en vez de dejar un "." suelto que después se pierde
        // silenciosamente en desformatearImporte (parseFloat(".") = NaN).
        let enteroFormateado = entero
            ? Number(entero).toLocaleString("en-US")
            : (tienePunto ? "0" : "");

        const nuevoValor = enteroFormateado + (tienePunto ? "." + decimales : "");
        input.value = nuevoValor;

        // Reposicionar el cursor contando la misma cantidad de dígitos+punto desde el inicio
        let count = 0;
        let newPos = nuevoValor.length;
        for (let i = 0; i < nuevoValor.length; i++) {
            if (/[\d.]/.test(nuevoValor[i])) count++;
            if (count === digitsBeforeCursor) {
                newPos = i + 1;
                break;
            }
        }
        input.setSelectionRange(newPos, newPos);
    });
}


// Convierte "10,000,000.50" → 10000000.50
function desformatearImporte(valor) {
    if (!valor) return null;

    const numero = parseFloat(
        valor.replace(/,/g, "")
    );

    return isNaN(numero) ? null : numero;
}

// Convierte 10000000.50 → "10,000,000.50"
function formatearImporte(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }

    return Number(valor).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}