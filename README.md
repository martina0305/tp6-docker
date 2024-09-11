# TP6 Reporte
### Organizandonos con Docker :whale:
La estructura del proyecto quedo de la siguiente manera:
```
tp6-docker/
├── back/
│   ├── Dockerfile        # Dockerfile para el backend
│   ├── src/              # Código fuente del backend (TypeScript)
│   └── package.json      # Dependencias y scripts del backend
├── front/
│   ├── Dockerfile        # Dockerfile para el frontend
│   ├── src/              # Código fuente del frontend (React, etc.)
│   └── package.json      # Dependencias y scripts del frontend
└── docker-compose.yml     # Configuración de Docker Compose para frontend y backend
```

### Creación de imagenes y docker-compose.yaml
Armamos las imágenes y el docker-compose.yaml siguiendo el video de la clase y a su vez consultando con Chat GPT.

### Muchos problemas === muchas soluciones 
A continuación dejamos una lista de los problemas que tuvimos y dejamos la solución de como hicimos para que el servicio siga funcionando aún después de que se haya reiniciado.

1. **Problemas al ejecutar el backend en Docker**:
   - **Problema**: Al intentar ejecutar `index.ts` directamente, aparecía el error `Cannot find module '/src/index.ts'` debido a que Node.js no puede ejecutar archivos TypeScript directamente.

2. **Configuración de volúmenes en Docker Compose**:
   - **Problema**: Era necesario agregar volúmenes para almacenar los datos del frontend y backend en el contenedor.

3. **Configuración de puertos en `daemon.json`**:
   - **Problema**: Fue necesario agregar el puerto `8080` al archivo `daemon.json` para que Docker redirigiera el tráfico correctamente entre los contenedores del frontend y backend.

4. **Permiso denegado para conectar al socket de Docker**:
   - **Problema**: Al intentar ejecutar `docker ps`, el mensaje de error era: `permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock`.

5. **El usuario no tiene permisos para ejecutar comandos Docker**:
   - **Problema**: El usuario no estaba en el grupo `docker`, lo cual es necesario para ejecutar comandos de Docker sin `sudo`.

6. **Política de reinicio de contenedores**:
   - **Problema**: Los contenedores no se reiniciaban automáticamente después de un reinicio del servidor.
   - **Solución**: Se configuró la política de reinicio añadiendo `restart: always` en el archivo `docker-compose.yml` para garantizar que los contenedores se reinicien automáticamente si el Docker daemon o el servidor se reinician.

7. **Creación del Servicio `systemd` para Docker Compose**:
   - **Problema**: Era necesario que el servicio Docker Compose se iniciara automáticamente al reiniciar el servidor.
   - **Solución**: Se creó un servicio `systemd` para Docker Compose. Esto permite que Docker Compose se inicie automáticamente al arrancar el sistema, asegurando que los contenedores se mantengan en funcionamiento tras un reinicio.

8. **Verificación de los contenedores después del reinicio**:
   - **Problema**: Tras reiniciar el servidor, era necesario verificar que los contenedores se reiniciaran automáticamente.
