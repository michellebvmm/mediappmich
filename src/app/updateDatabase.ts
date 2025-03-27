import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocs, collection, setDoc, getDoc } from 'firebase/firestore';
import { environment } from '../environments/environment'; // Ajusta la ruta si es necesario

// Inicializar Firebase
const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);

async function updateRolesAndCreateCollections() {
    try {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);

        if (usersSnapshot.empty) {
            console.log("⚠️ No hay usuarios en la colección 'users'.");
            return;
        }

        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const userId = userDoc.id;

            console.log(`🔍 Procesando usuario: ${userId}, Data:`, userData);

            // Verificar si el usuario tiene un campo 'rol'
            if (!userData['rol'] || typeof userData['rol'].path !== 'string') {
                console.log(`⚠️ Usuario ${userId} no tiene una referencia válida en 'rol'.`);
                continue;
            }

            // Obtener el rol real desde la referencia
            const roleRef = doc(firestore, userData['rol'].path);
            const roleSnapshot = await getDoc(roleRef);

            if (!roleSnapshot.exists()) {
                console.log(`❌ No se encontró el rol para el usuario ${userId}.`);
                continue;
            }

            const userRole = roleSnapshot.id; // Obtiene el ID del documento de rol

            console.log(`🟢 Usuario ${userId} tiene rol: ${userRole}`);

            if (userRole === 'admin') {
                // Datos del doctor
                const doctorData = {
                    userId: userId,
                    name: userData['username'] || 'Sin nombre',
                    email: userData['email'] || '',
                    experience: userData['experience'] || 0,
                    clinic_location: userData['clinic_location'] || 'No especificada',
                    phone: userData['phone'] || 'No especificado',
                    rating: userData['rating'] || 0,
                    appointments: [] // Inicialmente sin citas
                };

                console.log(`📌 Insertando en 'doctors':`, doctorData);
                await setDoc(doc(firestore, 'doctors', userId), doctorData);
                console.log(`✅ Doctor ${userData['username']} agregado.`);
            } 
            else if (userRole === 'common_user') {
                // Datos del paciente
                const patientData = {
                    userId: userId,
                    name: userData['username'] || 'Sin nombre',
                    email: userData['email'] || '',
                    phone: userData['phone'] || 'No especificado',
                    address: {
                        street: userData['street'] || '',
                        ext_number: userData['ext_number'] || '',
                        int_number: userData['int_number'] || '',
                        colony: userData['colony'] || '',
                    },
                    rating: userData['rating'] || 0,
                    appointments: [] // Inicialmente sin citas
                };

                console.log(`📌 Insertando en 'patients':`, patientData);
                await setDoc(doc(firestore, 'patients', userId), patientData);
                console.log(`✅ Paciente ${userData['username']} agregado.`);
            } else {
                console.log(`⚠️ Rol desconocido (${userRole}) para el usuario ${userId}.`);
            }
        }

        console.log('✅ Actualización completada.');
    } catch (error) {
        console.error("❌ Error en la actualización:", error);
    }
}

// Ejecutar la función
updateRolesAndCreateCollections().catch(console.error);
