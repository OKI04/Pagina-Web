const mongoose = require("mongoose");
require("dotenv").config(); // ← importante

const uri = process.env.MONGO_URI;

console.log("URI de MongoDB desde .env:", process.env.MONGO_URI); // ← Línea de verificación

const connection = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error(error);
    throw new Error("No se ha podido conectar a la base de datos");
  }
};

module.exports = {
  connection
};
