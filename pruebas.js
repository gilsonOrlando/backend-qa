const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const removeDuplicates = (array) => {
    // Diccionario para rastrear IDs únicos
    const uniqueMap = new Map();
    const uniqueArray = [];

    array.forEach(item => {
        // Convierte el ID a cadena para comparación
        const itemId = item._id.toString(); // Asegúrate de que `_id` esté en formato de cadena

        // Verifica si el ID ya está en el mapa
        if (!uniqueMap.has(itemId)) {
            uniqueMap.set(itemId, true);
            uniqueArray.push(item);
        }
    });

    return uniqueArray;
};

// Ejemplo de uso con tus datos
const items = [
    { _id: new ObjectId('669d38dad8fc616327822180') },
    { _id: new ObjectId('669d3910d8fc6163278229b6') },
    { _id: new ObjectId('669d3929d8fc616327822c72') },
    { _id: new ObjectId('669d3939d8fc616327822f2e') },
    { _id: new ObjectId('669d3948d8fc6163278231ea') },
    { _id: new ObjectId('669d395ed8fc6163278234a6') },
    { _id: new ObjectId('669d3972d8fc616327823762') },
    { _id: new ObjectId('669d3948d8fc6163278231ea') }, // Duplicado
    { _id: new ObjectId('669d39e2d8fc616327823a1e') },
    { _id: new ObjectId('669d39f5d8fc616327823cda') },
    { _id: new ObjectId('669d38dad8fc616327822180') }, // Duplicado
    // Más datos...
];

const uniqueItems = removeDuplicates(items);
console.log(uniqueItems);
