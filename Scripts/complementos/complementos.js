/* Calcula la fecha de hoy y si es necesario le suma X dias */
function getFechaLocal(diasASumar = 0) {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + diasASumar);

    return hoy.getFullYear() + '-' + 
    String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
    String(hoy.getDate()).padStart(2, '0');
}

function diasHastaVencimiento(fecha_cobro) {
    const vencimiento = new Date(fecha_cobro);
    vencimiento.setDate(vencimiento.getDate() + 30);
    const hoy = new Date(getFechaLocal());
    return Math.round((vencimiento - hoy) / (1000 * 60 * 60 * 24));
}