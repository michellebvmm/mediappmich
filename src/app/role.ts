import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocs, collection, updateDoc, setDoc } from 'firebase/firestore';
import { environment } from '../environments/environment'; // Asegúrate de que la ruta sea correcta

// Inicializar Firebase
const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);

async function updateRolesAndCreateDoctorCollection() {
    const usersCollection = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersCollection);

    for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Verificar si el rol es 'admin' o 'common_user'
        if (userData['rol']) {
            const userRole = userData['rol'];

            // Si el rol es 'admin', agregarlo a la colección de 'doctors'
            if (userRole === 'admin') {
                const doctorData = {
                    name: userData['name'],
                    email: userData['email'],
                    specialty: userData['specialty'] || 'General',  // Asegúrate de tener estos datos
                    clinic: userData['clinic'] || 'Default Clinic',
                    availability: userData['availability'] || 'Available'
                };

                // Crear un documento en la colección 'doctors' con el mismo ID del usuario
                await setDoc(doc(firestore, 'doctors', userDoc.id), doctorData);
                console.log(`Doctor ${userData['name']} creado en la colección de doctores.`);
            } 
            // Si el rol es 'common_user', tratarlos como pacientes
            else if (userRole === 'common_user') {
                console.log(`El usuario ${userData['name']} es un paciente.`);
                // Aquí puedes hacer algo más si es necesario para los pacientes
            }
        }
    }

    console.log('Actualización completada.');
}

// Llama a la función
updateRolesAndCreateDoctorCollection().catch(console.error);
