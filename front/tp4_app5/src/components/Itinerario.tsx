// Itinerario.tsx
import Link from "next/link";
import type { Itinerario } from "../app/Modelo";

interface ItinerarioProps {
    itinerario: Itinerario;
    handleDelete: (id: number) => void;
}

export default function ItinerarioItem(props: ItinerarioProps) {
    return (       
        <div className="bg-sky-700 p-6 rounded-lg shadow-md block transition-transform transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => props.handleDelete(props.itinerario.id)} className="btn btn-sm btn-circle btn-ghost text-white">✕</button>    
            </div>
            <Link key={props.itinerario.id} href={`./mostrar/${props.itinerario.id}`}>              
                <p className="text-5xl text-center text-white mb-6">{props.itinerario.id}</p>
            </Link>
        </div>      
    );
}