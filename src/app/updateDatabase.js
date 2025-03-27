"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var environment_1 = require("../environments/environment"); // Ajusta la ruta si es necesario
// Inicializar Firebase
var app = (0, app_1.initializeApp)(environment_1.environment.firebase);
var firestore = (0, firestore_1.getFirestore)(app);
function updateRolesAndCreateCollections() {
    return __awaiter(this, void 0, void 0, function () {
        var usersCollection, usersSnapshot, _i, _a, userDoc, userData, userId, roleRef, roleSnapshot, userRole, doctorData, patientData, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    usersCollection = (0, firestore_1.collection)(firestore, 'users');
                    return [4 /*yield*/, (0, firestore_1.getDocs)(usersCollection)];
                case 1:
                    usersSnapshot = _b.sent();
                    if (usersSnapshot.empty) {
                        console.log("⚠️ No hay usuarios en la colección 'users'.");
                        return [2 /*return*/];
                    }
                    _i = 0, _a = usersSnapshot.docs;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    userDoc = _a[_i];
                    userData = userDoc.data();
                    userId = userDoc.id;
                    console.log("\uD83D\uDD0D Procesando usuario: ".concat(userId, ", Data:"), userData);
                    // Verificar si el usuario tiene un campo 'rol'
                    if (!userData['rol'] || typeof userData['rol'].path !== 'string') {
                        console.log("\u26A0\uFE0F Usuario ".concat(userId, " no tiene una referencia v\u00E1lida en 'rol'."));
                        return [3 /*break*/, 8];
                    }
                    roleRef = (0, firestore_1.doc)(firestore, userData['rol'].path);
                    return [4 /*yield*/, (0, firestore_1.getDoc)(roleRef)];
                case 3:
                    roleSnapshot = _b.sent();
                    if (!roleSnapshot.exists()) {
                        console.log("\u274C No se encontr\u00F3 el rol para el usuario ".concat(userId, "."));
                        return [3 /*break*/, 8];
                    }
                    userRole = roleSnapshot.id;
                    console.log("\uD83D\uDFE2 Usuario ".concat(userId, " tiene rol: ").concat(userRole));
                    if (!(userRole === 'admin')) return [3 /*break*/, 5];
                    doctorData = {
                        userId: userId,
                        name: userData['username'] || 'Sin nombre',
                        email: userData['email'] || '',
                        experience: userData['experience'] || 0,
                        clinic_location: userData['clinic_location'] || 'No especificada',
                        phone: userData['phone'] || 'No especificado',
                        rating: userData['rating'] || 0,
                        appointments: [] // Inicialmente sin citas
                    };
                    console.log("\uD83D\uDCCC Insertando en 'doctors':", doctorData);
                    return [4 /*yield*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(firestore, 'doctors', userId), doctorData)];
                case 4:
                    _b.sent();
                    console.log("\u2705 Doctor ".concat(userData['username'], " agregado."));
                    return [3 /*break*/, 8];
                case 5:
                    if (!(userRole === 'common_user')) return [3 /*break*/, 7];
                    patientData = {
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
                    console.log("\uD83D\uDCCC Insertando en 'patients':", patientData);
                    return [4 /*yield*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(firestore, 'patients', userId), patientData)];
                case 6:
                    _b.sent();
                    console.log("\u2705 Paciente ".concat(userData['username'], " agregado."));
                    return [3 /*break*/, 8];
                case 7:
                    console.log("\u26A0\uFE0F Rol desconocido (".concat(userRole, ") para el usuario ").concat(userId, "."));
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9:
                    console.log('✅ Actualización completada.');
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _b.sent();
                    console.error("❌ Error en la actualización:", error_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// Ejecutar la función
updateRolesAndCreateCollections().catch(console.error);
