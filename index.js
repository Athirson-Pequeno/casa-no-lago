const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/db.js");

const clienteRoute = require("./routes/clienteRoute");
const quartosRoute = require("./routes/quartosRoute");
const reservaRoute = require("./routes/reservaRoute");

const app = express();

app.use(bodyParser.json());

app.use("/clientes", clienteRoute);
app.use("/quartos", quartosRoute);
app.use("/reservas", reservaRoute);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
