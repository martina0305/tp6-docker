export const convertirFecha = (fecha: Date) : string => {
    const date: Date = new Date(Number(fecha));

    const formattedDate: string = date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    return formattedDate;
}