//Creando el servidor
const express = require("express");
const cors = require("cors");
const app = express();
const { initDB } = require("./services/database");
const todoRoutes = require("./routes/todo");

const PORT = 8000;

app.use(express.json());
app.use(cors());
app.use("/api", todoRoutes);
app.use(express.json);
//Importar base de datos

try {
  initDB();
  app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto " + PORT + " running");
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
