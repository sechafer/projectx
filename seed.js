const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Importar Modelos
const User = require('./models/User'); // Asegúrate de que la ruta sea correcta
const Forgot = require('./models/Forgot'); // Asegúrate de que la ruta sea correcta
const Order = require('./models/Order'); // Asegúrate de que la ruta sea correcta
const Product = require('./models/Products'); // Asegúrate de que la ruta sea correcta

dotenv.config();

// Datos de Ejemplo
const users = [
    {
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        password: "hashedpassword123", // Asegúrate de usar contraseñas hasheadas en producción
        address: "Calle Falsa 123",
        pincode: "123456",
        phone: "1234567890"
    },
    // Agrega más usuarios si lo deseas
];

const forgotEntries = [
    {
        userid: "someUserId",
        email: "juan.perez@example.com",
        token: "someRandomToken123"
    },
    // Agrega más entradas si lo deseas
];

const products = [
    {
        title: "Camiseta Básica",
        slug: "camiseta-basica",
        desc: "Una camiseta básica de algodón.",
        img: "url_de_la_imagen",
        category: "Ropa",
        colour: "Azul",
        price: 19.99,
        availableQty: 100
    },
    {
        title: "Jeans Clásicos",
        slug: "jeans-clasicos",
        desc: "Jeans clásicos de corte recto.",
        img: "url_de_la_imagen",
        category: "Ropa",
        colour: "Negro",
        price: 49.99,
        availableQty: 50
    },
    // Agrega más productos si lo deseas
];

const orders = [
    {
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        orderId: "ORD123456",
        paymentInfo: "Tarjeta de Crédito",
        products: {
            // Estructura de los productos según tu esquema
            camisetas: 2,
            jeans: 1
        },
        address: "Calle Falsa 123",
        city: "Ciudad Ejemplo",
        pincode: "123456",
        phone: "1234567890",
        transactionId: "TXN789456",
        amount: 89.97,
        status: "Procesando",
        deliveryStatus: "pendiente"
    },
    // Agrega más órdenes si lo deseas
];

const seedDB = async () => {
    try {
        await connectDB();

        // Limpiar Colecciones
        await User.deleteMany({});
        await Forgot.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        console.log('Colecciones limpiadas.');

        // Insertar Datos
        await User.insertMany(users);
        console.log('Usuarios insertados.');

        await Forgot.insertMany(forgotEntries);
        console.log('Entradas de Forgot insertadas.');

        await Product.insertMany(products);
        console.log('Productos insertados.');

        await Order.insertMany(orders);
        console.log('Órdenes insertadas.');

        console.log('Datos de semilla insertados correctamente.');
        process.exit();
    } catch (error) {
        console.error('Error al insertar datos de semilla:', error);
        process.exit(1);
    }
};

seedDB();