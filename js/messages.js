
firebase.initializeApp({
    apiKey: "AIzaSyD9J1OorCJq9OpXNJbmRQyFg-4oP1IgdPI",
    authDomain: "axyoume.firebaseapp.com",
    projectId: "axyoume",
    storageBucket: "axyoume.firebasestorage.app",
    messagingSenderId: "447974722638",
    appId: "1:447974722638:web:b54d513c273b79e80cc71f"
});

const db = firebase.firestore();


// LISTENERS PARA ENVIAR MENSAJE PARA REGISTRAR
let buttonA = document.getElementById("btnEnviarA");
let buttonX = document.getElementById("btnEnviarX");
buttonA.addEventListener("click", function () {
    const mensaje = document.getElementById("mensaje").value;
    registrarMensaje(mensaje, "A");
});
buttonX.addEventListener("click", function () {
    const mensaje = document.getElementById("mensaje").value;
    registrarMensaje(mensaje, "X");
});


// FUNCION PARA REGISTRAR UN MENSAJE
function registrarMensaje(mensaje, origen) {
    let visitDate = new Date();
    db.collection("axmessages").add(
        {
            mensaje: mensaje,
            origen: origen,
            date: visitDate.toLocaleDateString(),
            time: visitDate.toLocaleTimeString(),
            visitDate: firebase.firestore.Timestamp.fromDate(visitDate),
        }
    )
        .then((docRef) => {
            console.log("Mensaje registrado con ID: ", docRef.id);
            document.getElementById("mensaje").value = "";
        })
        .catch((error) => {
            console.error("Error registrando mensaje: ", error);
        });
}

// Convertir enlace en clickable
function enlazarTexto(texto) {
    // Regex para detectar URLs
    const urlRegex = /((https?:\/\/)[\w\-._~:/?#@!$&'()*+,;=%]+)/g;
    return texto.replace(urlRegex, '<a href="$1" class="underline text-blue-200 hover:text-blue-400" target="_blank">$1</a>');
}





// LISTADO DE REGISTROS DE LA COLECCION
const container = document.getElementById("messages-container");

db.collection("axmessages")
    .orderBy("visitDate", "desc")
    .onSnapshot((querySnapshot) => {
        container.innerHTML = ""; // Limpiar mensajes previos para evitar duplicados

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const origen = data.origen;
            const date = new Date(data.visitDate.seconds * 1000); // Convertir timestamp Firestore

            // Formatear la fecha y hora
            const optionsDate = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
            const formattedDate = date.toLocaleDateString('es-ES', optionsDate).replace(",", "");
            const formattedTime = date.toLocaleTimeString('es-ES', optionsTime).replace(":", ":");

            // Definir estilos según el origen del mensaje
            const alignClass = origen === "A" ? "self-start" : "self-end";
            const bgColorClass = origen === "A" ? "bg-pink-700" : "bg-pink-500";
            const roundedClass = origen === "A" ? "rounded-r-xl rounded-bl-xl" : "rounded-l-xl rounded-br-xl";

            // Crear el HTML del mensaje
            const messageHTML = `
                <div class="${alignClass}">
                    <div class="${roundedClass} ${bgColorClass} text-white px-3 py-2 mt-2 inline-block">
                        <span class="text-[8pt] font-mono text-gray-200">📅 ${formattedDate} ⌚️ ${formattedTime} Hrs</span>
                        <p>${enlazarTexto(data.mensaje)}</p>
                    </div>
                </div>
            `;

            // Insertar el mensaje en el contenedor
            container.innerHTML += messageHTML;
        });
    });





// ELIMINAR REGISTROS DE LA COLECCION
// Filtrar los registros con timeZone "America/Santiago"
// db.collection("axmessages")
//    // .where("timeZone", "==", "America/Santiago")  // Filtra los documentos por timeZone
//     .get()
//     .then((querySnapshot) => {
//         // Recorrer todos los documentos obtenidos
//         querySnapshot.forEach((doc) => {
//             // Eliminar cada documento
//             db.collection("axmessages").doc(doc.id).delete()
//                 .then(() => {
//                     console.log("Documento eliminado con ID: ", doc.id);
//                 })
//                 .catch((error) => {
//                     console.error("Error eliminando el documento con ID: ", doc.id, error);
//                 });
//         });
//     })
//     .catch((error) => {
//         console.error("Error obteniendo los registros: ", error);
//     });
