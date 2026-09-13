function getFechaLocal() {
    const hoy = new Date();

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