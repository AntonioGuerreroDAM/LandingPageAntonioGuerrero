const admin = require('firebase-admin');
const fs = require('fs');

// 1. Carga tu llave privada
const serviceAccount = require("./clave-admin.json");

// 2. Inicializa el Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function sincronizar() {
    console.log("Conectando como administrador...");
    try {
        // Traer todos los documentos de la colección 'pedidos'
        const snapshot = await db.collection('pedidos').get();
        const pedidos = [];
        
        snapshot.forEach(doc => {
            pedidos.push({ id: doc.id, ...doc.data() });
        });

        // 3. Guardar en el archivo JSON local de tu proyecto
        fs.writeFileSync('pedidos.json', JSON.stringify(pedidos, null, 2));
        
        console.log(`✅ ¡Éxito! Se han sincronizado ${pedidos.length} pedidos en pedidos.json`);
    } catch (error) {
        console.error("❌ Error al sincronizar:", error);
    }
}

sincronizar();