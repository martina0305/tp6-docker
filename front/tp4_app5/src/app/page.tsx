"use client"

import { useCallback, useEffect, useState } from "react";
import { Itinerario, Lista } from "./Modelo";
import Link from 'next/link'
import { api } from "./utils";
import ItinerarioItem from "@/components/Itinerario";
import { borrarItinerario } from "@/app/utils";

const LISTA_INICIAL: Lista = { itinerarios: [] };

export default function Home() {
  const [listado, setListado] = useState<Lista>(LISTA_INICIAL);
  const [mensaje, setMensaje] = useState<string>('');
  const [deleted, setDeleted] = useState<boolean>(false);

  useEffect(() => {
    api<Lista>('/v1/itinerarios')
      .then((data: Lista) => {
        setListado({itinerarios: data.itinerarios});
      })
  },[deleted])
  
  const handleDelete = useCallback(async (id: number) => {
    setMensaje("borrando...")
    const respuesta = await borrarItinerario(id);
    setMensaje(respuesta);
    setDeleted(!deleted);
  }, [listado])

  return (
    <>
      <h1 className="text-3xl mb-8">Tu lista de itinerarios</h1>

      <Link href="/agregar" className="btn btn-primary text-slate-50" prefetch={true}>
        Agregar Destino
      </Link>

      <div className="container mx-auto p-4">
        {mensaje && <p className="text-red-500 font-bold">{mensaje}</p>}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {listado.itinerarios.map(i => (
            <ItinerarioItem key={i.id} itinerario={i} handleDelete={handleDelete} /> 
          ))}
        </div>
      </div>
    </>
  );
}