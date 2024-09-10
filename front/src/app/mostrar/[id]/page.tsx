"use client"
import React, { useEffect, useState } from 'react'
import { Actividad } from '../../Modelo'
import { Itinerario } from '../../Modelo'
import { api } from '../../utils'
import { convertirFecha } from './utils'

const Mostrar = ({params}: any) => {
    const [listado, setListado] = useState<Actividad[]>([]);
    useEffect(() => {
        api<Itinerario>(`/v1/itinerario/${params.id}`)
            .then((data: Itinerario) => {
                setListado(data.actividades);
            })    
        },[params.id])
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl from-accent-content mb-6">Itinerario {params.id}</h1>
        {listado.map((a) => {
          let inicio = convertirFecha(a.inicio);
          let fin = convertirFecha(a.fin);

          return (
            <div
              key={a.id}
              className="card shadow-lg p-4 mb-4 bg-white rounded-lg"
            >
              <h1 className="text-2xl font-bold mb-2">{a.nombre}</h1>
              <p className="text-gray-700 mb-4">{a.descripcion}</p>
              <p className="text-sm text-gray-500">
                <strong>Inicio:</strong> {inicio}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Fin:</strong> {fin}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Mostrar;