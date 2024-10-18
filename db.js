const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Puedes agregar opciones adicionales aquí si es necesario
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1); // Terminar el proceso con error
    }
};

module.exports = connectDB;