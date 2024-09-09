# App 5° - Organizador de viajes usando AI

## Alumnos

Jimena Zapolski y Manuel Olguin

## Selección de API

La selección de la API no fue nada sencilla. En nuestra investigación encontramos que hay gran número de API de generación de texto como ChatGPT. Pero muy pocas de ellas son gratuitas y fáciles de usar. Nos topamos con decenas de opciones, entre ellas

* MindStudio
* Local AI
* Gemini

La mejor opción para nosotros fue esta última, ya que muchas de las demás opciones se basan en crear modelos a medida, y para el alcance de este proyecto no lo vemos necesario. Gemini es relativamente sencilla de usar, donde se le envía una request POST con el texto de consulta y este devuelve la respuesta. Además se pueden gestionar cadenas de request para funcionar como una conversación. Esto último no lo vemos necesario para este proyecto, pero quizás los siguientes desarrolladores le encuentren algún uso.

Adjuntamos los siguientes links que pueden ser de ayuda para trabajar con esta API:

[Documentación](https://ai.google.dev/gemini-api/docs)

[Video explicativo de como usuarla](https://youtu.be/_CqKs0cQCfo)

## Ejemplo de prompt para la API

Haciendo numerosas pruebas y basándonos en el modelo que planteamos, generamos la siguiente prompt para que la IA devuelva un JSON estructurado de la manera que deseamos.

Prompt:
````
Crea un itinerario de viaje para ir a visitar ${viaje.destino} siendo un viajero de tipo ${viaje.viajero  === 'ciudad' ? 'urbano' : viaje.viajero === 'vida nocturna' ? 'nocturno' : viaje.viajero === 'museos' ? 'cultural' : 'naturalista'} entre los dias ${viaje.inicio.toLocaleDateString()} a las ${viaje.inicio.toLocaleTimeString()} y ${viaje.fin.toLocaleDateString()} a las ${viaje.fin.toLocaleTimeString()}.

IMPORTANTE: El Output debe ser EXCLUSIVAMENTE codigo en formato JSON (sin datos extras, ni notas) con la siguiente estructura:

{
 "dias": [
  {
   "fecha": "15/07/2024",
   "actividades": [
    {
     "Inicio": "09:00",
     "Fin": "10:00",
     "Nombre": "Desayuno en el hotel",
     "descripcion": "Disfrutar de un rico desayuno tipico argentino con medialunas"
    },
    {
     "Inicio": "10:00",
     "Fin": "12:00",
     "Nombre": "Plaza de Mayo",
     "descripcion": "Visita a la Plaza de Mayo, el corazón político de la ciudad, donde se encuentran la Casa Rosada, el Cabildo y la Catedral Metropolitana."
    },
    {
     "Inicio": "12:00",
     "Fin": "13:00",
     "Nombre": "9 de Julio",
     "descripcion": "Caminata por la Avenida 9 de Julio, la avenida más ancha del mundo."
    },
    {
     "Inicio": "13:00",
     "Fin": "14:30",
     "Nombre": "Parrilla Benito",
     "descripcion": "Almuerzo en un restaurante en el barrio de Microcentro."
    },
    {
     "Inicio": "14:30",
     "Fin": "16:00",
     "Nombre": "Teatro Colón",
     "descripcion": "Visita al Teatro Colón, uno de los teatros de ópera más importantes del mundo."
    },
    {
     "Inicio": "16:00",
     "Fin": "19:00",
     "Nombre": "Paseo en Barco",
     "descripcion": "Paseo en barco por el Río de la Plata, disfrutando de las vistas de la ciudad y sus alrededores."
    },
    {
     "Inicio": "19:00",
     "Fin": "21:00",
     "Nombre": "Cena Palermitana",
     "descripcion": "Cena en un restaurante en el barrio de Palermo Soho, conocido por su vida nocturna y sus restaurantes de moda."
    },
    {
     "Inicio": "21:00",
     "Fin": "23:00",
     "Nombre": "Paseo Nocturno por Palermo",
     "descripcion": "Disfrutar de la vida nocturna en Palermo Soho, visitando bares y discotecas."
    }
   ]
  }
 ]
}
````
Para llegar a este resultado, seguimos las prácticas de armado de prompt de este artículo:

[**How To Get Consistent JSON From Google Gemini (With Practical Example)**](https://hasanaboulhasan.medium.com/how-to-get-consistent-json-from-google-gemini-with-practical-example-48612ed1ab40 )

Encontramos gran efectividad en las pruebas con este prompt, aun así a veces no devuelve la data en formato JSON o agrega texto extra. Por esto, creemos que el resultado de la API debe ser verificado y de no cumplir los requisitos (contener un JSON) llamar a la API nuevamente. Además esta función debe poder extraer el JSON de una cadena de caracteres (string) en el caso de que sea devuelto con texto por fuera de lo requerido. IMPORTANTE: En las pruebas que realizamos, cuando la api devuelve un JSON siempre esta dentro de un bloque de codigo.

## Decisiones de modelado

Arrancamos el proceso de DDD eligiendo las entidades del proyecto:

* **Viaje:** Va a tener la información de la consulta del usuario (Destino elegido, Tipo de viajero e inicio y fin del viaje). Tomamos las siguientes decisiones:
    1. Destino. Estuvimos debatiendo sobre distintas alternativas ya que en el planteamiento del problema se habla de poder consultar por continente, país o ciudad. Para eso evaluamos incluir otra API que nos provea con esta información para que el usuario elija, pero finalmente decidimos que sea un string ya que se va del alcance del proyecto y no es realmente necesario.
    2. Tipo de viajero. Se guarda como información numérica para dejar la puerta abierta a los siguientes grupos para que del lado del frontend puedan diferenciar los diferentes viajeros y generar distintas vistas para ellos, si así quisieran.
    
    3. Inicio y Fin. Son de tipo Date, ya que queremos poder armar el viaje más completo al usuario otorgándole actividades desde su horas de llegada hasta su hora de salida. Por ejemplo: si el usuario llega a la mañana ya puede empezar con actividades a diferencia de si llega a la noche y solo tiene tiempo de cenar.

* **Actividad:** Va a tener información de una actividad específica, por ejemplo visitar un museo de 15hs a 16hs. Por lo tanto esta entidad cuenta con fecha de Inicio y Fin, nombre y una descripción para saber más.

* **Dia:** Va a tener información de las actividades del día. Funciona como un array de  actividades. (Actividad[ ])

* **Itinerario:** Teniendo en cuenta de que debemos guardar los cronogramas del usuario, consideramos que esta interface debe tener un ID único para identificarlo, el Viaje con los datos de búsqueda del usuario y los días con sus respectivas actividades (Dia[ ]).
    1. El ID único es para que en caso de que el usuario quiera eliminar/consultar un itinerario específico pueda hacerlo.

* **Lista:** La lista es un listado de todos los itinerarios del usuario. (Itinerario[])


## Métodos que expone el modelo

Nos pareció que el itinerario necesitaba agregar, borrar y consultar. Modificaciones no hace falta porque en el problema no está especificado, a pesar de esto, borrar itinerario si lo consideramos necesario en caso de que el usuario no la haya pasado bien en sus vacaciones y quiera olvidarlas. Por otro lado, creemos que consultar si es importante ya que la aplicación además de traerlos en un listado, podría tener una página específica que requiera traer un único itinerario.

> Al agregar itinerario se debe llamar a la función GeneradorDias(Viaje) la cual se encarga de hacer la consulta a la API para que genere el listado de Dias con sus respectivas actividades. Esta función (GeneradorDias) también debe encargarse de corroborar que el output de la API contenga un JSON, y de no ser así reenviar el prompt.

El único método que consideramos para la Lista es la consulta, ya que en la base de datos no va a ser necesario generar un listado ya que no hay diferentes usuarios, y esta lista se puede generar en el backend.

Para las demás entidades no consideramos necesario asignarles métodos específicos ya que están englobadas en los itinerarios.



## Algunas ideas para los siguientes

Encontramos algunas páginas web que son parecidas a lo que se pide en el planteamiento del problema, las dejamos acá abajo como referencia tanto para el equipo de backend como para el de frontend.

[Let's Strip](https://letstrip.ai/?ref=aitools.fyi&utm_source=aitools.fyi)

[Trip Planner AI](https://tripplanner.ai/)


#

_Esta documentación fue hecha con mucho amor así que Diego aprobamos plis. Para que te compadezcas te dejamos este meme_



![image](https://media.discordapp.net/attachments/843267150583037952/1232821502878158938/meme.png?ex=662ad9ff&is=6629887f&hm=79e4ec2d7646a952fab6c23c3907f5949e4e2796e2bae3a6416bff4e15cebdc5&=&format=webp&quality=lossless&width=423&height=571)


