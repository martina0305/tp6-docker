import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { agregarItinerario, borrarItinerario, consultarItinerario, consultarLista, Viaje } from "./Modelo";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 3000; //si PORT no existe va a ser undefined, en ese caso quiero que 3000 sea el q use por defecto
const app: Express = express();

app.use(cors());

// Middleware para que acepte JSON
app.use(express.json());

// Función errorHandler para manejar errores
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    res.status(500).send({ message: err.message });
}

// Endpoint para la raíz
app.get("/", (req: Request, res: Response) => {
    res.send("Hola mundo!");
});

// Endpoint para agregar itinerarios
app.post("/v1/itinerario/agregar", (req: Request, res: Response, next: NextFunction) => {
    // Extraemos los parámetros del cuerpo de la solicitud
    const { destino, viajero, inicio, fin } = req.body;

    // Verificamos que todos los parámetros necesarios estén presentes
    if (!destino || !viajero || !inicio || !fin) {
        res.status(400).send({ message: "Los parámetros 'destino', 'viajero', 'inicio' y 'fin' son requeridos" });
        return;
    }

    // Creamos un objeto Viaje con los parámetros recibidos
    const nuevoViaje: Viaje = {
        destino: destino,
        viajero: viajero,
        inicio: new Date(inicio),
        fin: new Date(fin)
    };

    // Llamamos a la función agregarItinerario con el nuevo viaje
    agregarItinerario(nuevoViaje)
        .then((itinerario) => {
            if (itinerario) {
                res.status(201).send({ message: "Itinerario agregado correctamente", itinerario: itinerario });
            } else {
                res.status(500).send({ message: "Hubo un error agregando el itinerario" });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Hubo un error agregando el itinerario" });
            next(err);
        });
});

app.post("/v1/itinerario/borrar", (req: Request, res: Response, next: NextFunction) => {
    // Extraemos el parámetro 'id' del cuerpo de la solicitud
    const { id } = req.body;

    // Verificamos que el parámetro 'id' esté presente
    if (!id) {
        res.status(400).send({ message: "El parámetro 'id' es requerido" });
        return;
    }

    // Llamamos a la función borrarItinerario con el ID recibido
    borrarItinerario(id)
        .then(() => {
            res.send({ message: "Itinerario borrado correctamente" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Hubo un error borrando el itinerario" });
            next(err);
        });
});

app.get("/v1/itinerario/:id", (req: Request, res: Response, next: NextFunction) => {
    // Extraemos el parámetro 'id' de la URL
    const { id } = req.params;

    // Verificamos que el parámetro 'id' esté presente
    if (!id) {
        res.status(400).send({ message: "El parámetro 'id' es requerido" });
        return;
    }

    // Llamamos a la función consultarItinerario con el ID recibido
    consultarItinerario(parseInt(id))
        .then((itinerario) => {
            if (itinerario) {
                res.send(itinerario);
            } else {
                res.status(404).send({ message: "Itinerario no encontrado" });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Hubo un error al consultar el itinerario" });
            next(err);
        });
});

app.get("/v1/itinerarios", (req: Request, res: Response, next: NextFunction) => {
    consultarLista()
        .then((lista) => {
            res.send(lista);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Hubo un error al consultar la lista de itinerarios" });
            next(err);
        });
});

app.listen(port, () => {
    console.log(`[server]: Servidor iniciado en http://localhost:${port}`);
});