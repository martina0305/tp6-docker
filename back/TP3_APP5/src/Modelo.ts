//TP2 - Problema: 
// Me gustaría conocer todo el mundo! Pero parece que el mundo es grande. Y hay muchas cosas para hacer en cada continente, país o ciudad al que voy. 
// Necesito que una aplicación me tire recomendaciones. 
// La información que le quiero dar seria, mas o menos: el tiempo que me voy a ir de viaje, que tipo de viajero soy (de ciudad, vida nocturna, museos, naturaleza, etc.) y a que región del planeta quiero irme (continente, país o ciudad). 
// La aplicación me debería armar un cronograma por día, donde me explique que hacer en todo momento. 
// Y quiero poder tener varios viajes, que la aplicación me los guarde todos para poder volver a ellos cuando quiera.

import { Database } from 'sqlite';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as sqlite3 from "sqlite3";
import { open } from 'sqlite';

// Importo dotenv y lo configuro
import dotenv from "dotenv";
dotenv.config();

// Obtengo la clave de API del archivo .env
const apiKey = process.env.API_KEY;

// Verifico si la clave de API está presente
if (!apiKey) {
  console.error('API_KEY environment variable not set');
  process.exit(1);
}

const googleGenerativeAI = new GoogleGenerativeAI(apiKey);

const model = googleGenerativeAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//Entidades
export interface Viaje {
  destino: string;
  viajero: string;
  inicio: Date;
  fin: Date;
}
export interface Actividad {
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

//abrimos conexión para db
let db: Database;

export async function abrirConexion() {
  return open({
    filename: 'db.sqlite',
    driver: sqlite3.Database
  });
}

async function init() {
  db = await abrirConexion();
}
init();

export async function generadorItinerario(viaje: Viaje): Promise<{ actividades: Actividad[] }> {
  const prompt = `Crea un itinerario de viaje para ir a visitar ${viaje.destino} siendo un viajero de tipo ${viaje.viajero  === 'ciudad' ? 'urbano' : viaje.viajero === 'vida nocturna' ? 'nocturno' : viaje.viajero === 'museos' ? 'cultural' : 'naturalista'} entre los dias ${viaje.inicio.toLocaleDateString()} a las ${viaje.inicio.toLocaleTimeString()} y ${viaje.fin.toLocaleDateString()} a las ${viaje.fin.toLocaleTimeString()}. 

  IMPORTANTE: El Output debe ser EXCLUSIVAMENTE codigo en formato JSON (sin datos extras, ni notas) con la siguiente estructura:
  
  {
   "actividades": [
    {
     "inicio": "09:00",
     "fin": "10:00",
     "nombre": "Desayuno en el hotel",
     "descripcion": "Disfrutar de un rico desayuno tipico argentino con medialunas"
    },
    {
     "inicio": "10:00",
     "fin": "12:00",
     "nombre": "Plaza de Mayo",
     "descripcion": "Visita a la Plaza de Mayo, el corazón político de la ciudad, donde se encuentran la Casa Rosada, el Cabildo y la Catedral Metropolitana."
    },
    {
     "inicio": "12:00",
     "fin": "13:00",
     "nombre": "9 de Julio",
     "descripcion": "Caminata por la Avenida 9 de Julio, la avenida más ancha del mundo."
    },
    {
     "inicio": "13:00",
     "fin": "14:30",
     "nombre": "Parrilla Benito",
     "descripcion": "Almuerzo en un restaurante en el barrio de Microcentro."
    },
    {
     "inicio": "14:30",
     "fin": "16:00",
     "nombre": "Teatro Colón",
     "descripcion": "Visita al Teatro Colón, uno de los teatros de ópera más importantes del mundo."
    },
    {
     "inicio": "16:00",
     "fin": "19:00",
     "nombre": "Paseo en Barco",
     "descripcion": "Paseo en barco por el Río de la Plata, disfrutando de las vistas de la ciudad y sus alrededores."
    },
    {
     "inicio": "19:00",
     "fin": "21:00",
     "nombre": "Cena Palermitana",
     "descripcion": "Cena en un restaurante en el barrio de Palermo Soho, conocido por su vida nocturna y sus restaurantes de moda."
    },
    {
     "inicio": "21:00",
     "fin": "23:00",
     "nombre": "Paseo Nocturno por Palermo",
     "descripcion": "Disfrutar de la vida nocturna en Palermo Soho, visitando bares y discotecas."
    }
   ]
  }`;

  const result = await model.generateContent(prompt);
  
  // Verifica y limpia la respuesta
  const textResponse = result.response.text().trim();
  const jsonResponse = textResponse.startsWith('```json') ? textResponse.slice(7, -3) : textResponse;

  try {
    const parsedResponse = JSON.parse(jsonResponse);
    if (!parsedResponse.actividades || !Array.isArray(parsedResponse.actividades)) {
      throw new Error("Respuesta no tiene el formato esperado.");
    }

    // Mapear las actividades para transformar las fechas y horas a objetos Date
    const actividades = parsedResponse.actividades.map((act: any) => ({
      inicio: new Date(`${viaje.inicio.toDateString()} ${act.inicio}`),
      fin: new Date(`${viaje.inicio.toDateString()} ${act.fin}`),
      nombre: act.nombre,
      descripcion: act.descripcion
    }));

    return { actividades };
  } catch (error) {
    console.error("Error al parsear la respuesta de la API:", error);
    throw new Error("Error al parsear la respuesta de la API");
  }
}

export async function agregarItinerario(viaje: Viaje): Promise<Itinerario> {
  // Genera el itinerario de viaje utilizando la función generadorItinerario
  const itinerario = await generadorItinerario(viaje);

  // Inserta el itinerario en la tabla Itinerario de la base de datos
  const itinerarioResult = await db.run(`INSERT INTO Itinerario (viaje_id) VALUES (?)`, viaje.destino);

  // Obtiene el ID del itinerario insertado a partir del resultado de la operación de inserción
  const itinerarioId = itinerarioResult.lastID;

  if (typeof itinerarioId !== 'number') {
    // Manejar el caso en el que el ID no es un número (por ejemplo, si es undefined)
    throw new Error('Error al obtener el ID del itinerario');
  }

  // Itera sobre cada actividad del itinerario
  for (const actividad of itinerario.actividades) {
    // Inserta cada actividad del itinerario en la tabla Actividad de la base de datos
    await db.run(
      `INSERT INTO Actividad (itinerario_id, inicio, fin, nombre, descripcion) VALUES (?, ?, ?, ?, ?)`,
      itinerarioId, actividad.inicio, actividad.fin, actividad.nombre, actividad.descripcion
    );
  }
  
  // Devuelve el itinerario completo, con el ID del itinerario insertado, el viaje recibido como parámetro y las actividades del itinerario
  return {
    id: itinerarioId,
    viaje: viaje,
    actividades: itinerario.actividades
  };
}

export async function borrarItinerario(id: number): Promise<void> {
  await db.run(`DELETE FROM Itinerario WHERE id = ?`, id);
  await db.run(`DELETE FROM Viaje WHERE id = ?`, id);
}

export async function consultarItinerario(id: number): Promise<Itinerario> {
  const itinerario = await db.get(`SELECT * FROM Itinerario WHERE id = ?`, id);
  const actividades = await db.all(`SELECT * FROM Actividad WHERE itinerario_id = ?`, id);
  const viaje = await db.get(`SELECT * FROM Viaje WHERE id = ?`, itinerario.viaje_id);
  
  return {
      id: itinerario.id,
      viaje: viaje,
      actividades: actividades
  };
}

export async function consultarLista(): Promise<Lista> {
  const itinerarios = await db.all(`SELECT * FROM Itinerario`);
  const lista: Lista = { itinerarios: [] };
  
  for (const itinerario of itinerarios) {
      // Obtener información del viaje asociado al itinerario
      const viaje = await db.get(`SELECT * FROM Viaje WHERE id = ?`, itinerario.viaje_id);
      
      // Obtener actividades del itinerario
      const actividades = await db.all(`SELECT * FROM Actividad WHERE itinerario_id = ?`, itinerario.id);
      
      // Construir el objeto Itinerario con el viaje y las actividades
      lista.itinerarios.push({
          id: itinerario.id,
          viaje: viaje,
          actividades: actividades
      });
  }
  
  return lista;
}

