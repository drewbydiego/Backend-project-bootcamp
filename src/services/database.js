const sqlite3 = require("sqlite3");
const path = require("path");
const { error } = require("console");

//Creando ruta para guardar db
const pathDB = path.resolve(process.cwd(), "src", "db", "database.sqlite");
//console.log(pathDB);
//Inicializando base de datos
const db = new sqlite3.Database(pathDB);

//Estructura para ejecutar queries
const run = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (errors) {
      if (errors) {
        return reject(errors);
      }
      return resolve({
        status: true,
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
};

const get = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (errors, rows) => {
      if (errors) {
        return reject(errors);
      }
      return resolve(rows);
    });
  });
};

const initDB = async () => {
  try {
    process.env.TZ = "America/Mexico_City"; // Establecer la zona horaria local

    await run(`CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY,
            title TEXT,
            description TEXT,
            isDone INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  initDB,
  run,
  get,
};
