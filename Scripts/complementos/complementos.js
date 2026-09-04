/* Calcula la fecha de hoy y si es necesario le suma X dias */
function getFechaLocal(diasASumar = 0) {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + diasASumar);

    return hoy.getFullYear() + '-' + 
    String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
    String(hoy.getDate()).padStart(2, '0');
}