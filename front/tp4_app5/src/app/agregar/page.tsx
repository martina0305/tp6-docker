"use client";

import { useEffect, useState } from "react";
import { Lista } from "../Modelo";
import {
  AgregarItinerarioParams,
  AgregarItinerarioRespuesta,
  agregarItinerario,
} from "../utils";
import Link from "next/link";
import { redirect } from "next/navigation";

const RESPUESTA_INICIAL = { mensaje: "", status: true };

export default function Home() {
  // El estado del formulario
  const [formulario, setFormulario] =
    useState<AgregarItinerarioRespuesta>(RESPUESTA_INICIAL);

  // La funcion que se llama al mandar el formulario
  const enviarFormulario = async (formData: FormData) => {
    setFormulario({mensaje: "loading...", status: true})
    const destino = formData.get("destino");
    const viajero = formData.get("viajero");
    const inicio = formData.get("inicio");
    const fin = formData.get("fin");
    if (
      destino == undefined ||
      viajero == undefined ||
      inicio == undefined ||
      fin == undefined
    ) {
      setFormulario({ mensaje: "Faltan datos!", status: false });
    } else {
      const params: AgregarItinerarioParams = {
        destino: destino.toString(),
        viajero: viajero.toString(),
        inicio: new Date(inicio.toString()),
        fin: new Date(fin.toString()),
      };

      await agregarItinerario(params)
        .then(setFormulario)
      
      redirect("/")
     
    }
  };

  // DOM
  return (
    <>
      <Link href="/" className="btn" prefetch={true}>
        Volver al listado
      </Link>

      <br></br>
      <br></br>

      <h1 className="text-3xl mb-8 text-center">Agregar Ciudad</h1>

      {!formulario.status ? (
        <div role="alert" className="alert alert-info">
          <span>{formulario?.mensaje}</span>
        </div>
      ) : formulario.mensaje ?
      (
        <div role="alert" className="alert alert-success">
          <span>{formulario?.mensaje}</span>
        </div>
      ) : (
        ""
      )}

      <form
        action={enviarFormulario}
        className="form-control gap-2 items-center"
      >
        <input
          name="destino"
          type="text"
          placeholder="Nombre de la ciudad...."
          className="input input-bordered w-full max-w-xs"
        ></input>
        {/* <input
          name="viajero"
          type="text"
          placeholder="Tipo de viajero...."
          className="input input-bordered w-full max-w-xs"
        ></input> */}

        <select
          name="viajero"
          className="select select-bordered w-full max-w-xs"
        >
          <option value="" disabled selected>
            Tipo de viajero....
          </option>
          <option value="negocios">Negocios</option>
          <option value="turismo">Turismo</option>
          <option value="aventura">Aventura</option>
          <option value="familia">Familia</option>
        </select>

        <input
          name="inicio"
          type="date"
          placeholder="Fecha de inicio...."
          className="input input-bordered w-full max-w-xs"
        ></input>
        <input
          name="fin"
          type="date"
          placeholder="Fecha de fin...."
          className="input input-bordered w-full max-w-xs"
        ></input>

        <button className="btn btn-primary text-gray-50 size-min" type="submit">
          Agregar
        </button>
      </form>
    </>
  );
}
