export interface Viaje {
    destino: string;
    viajero: string;
    inicio: Date;
    fin: Date;
}
export interface Actividad {
  id: number;
  inicio: Date;
  fin: Date;
  nombre: string;
  descripcion: string;
}
export interface Itinerario {
  id: number,
  viaje: Viaje,
  actividades: Actividad[]
}
export interface Lista {
  itinerarios: Itinerario[]
}

  /* export interface Ciudad {
    id: number,
    nombre: string,
    temperatura: number
}
export interface Listado {
    ciudades: Ciudad[]
}
export interface Alerta {
    cuando: Date,
    nombreCiudad: string,
    temperaturaActual: number
}
 */