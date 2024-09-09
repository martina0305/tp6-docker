CREATE TABLE Viaje (
    id INTEGER PRIMARY KEY,
    destino TEXT NOT NULL,
    viajero TEXT NOT NULL,
    inicio TEXT NOT NULL,
    fin TEXT NOT NULL
);
CREATE TABLE Actividad (
    id INTEGER PRIMARY KEY,
    itinerario_id INTEGER NOT NULL,
    inicio TEXT NOT NULL,
    fin TEXT NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (itinerario_id) REFERENCES Itinerario(id)
);
CREATE TABLE Itinerario (
    id INTEGER PRIMARY KEY,
    viaje_id INTEGER NOT NULL,
    FOREIGN KEY (viaje_id) REFERENCES Viaje(id)
);
CREATE TABLE Lista (
    id INTEGER PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES Itinerario(id)
);
CREATE TABLE Dia (
    id INTEGER PRIMARY KEY,
    itinerario_id INTEGER NOT NULL,
    actividad_id INTEGER NOT NULL,
    FOREIGN KEY (itinerario_id) REFERENCES Itinerario(id),
    FOREIGN KEY (actividad_id) REFERENCES Actividad(id)
);