const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const connection = require("./db");
const stationSchema = require("./stationSchema.js");

const app = express();
const port = 3003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, "public"), {
    "Content-Type": "application/javascript",
  })
);

// Crear el modelo Station basado en el esquema
const Station = connection.model("Station", stationSchema, "stations");

// Rutas

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/stations", async (req, res) => {
  try {
    const results = await Station.find({});
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/stations", async (req, res) => {
  try {
    const { temperature, humidity, light, pulsimeter } = req.body;
    console.log(req.body);

    if (!temperature || !humidity || !light || !pulsimeter) {
      return res.status(400).send("Missing required fields");
    }

    const station = new Station({ temperature, humidity, light, pulsimeter });
    await station.save();

    res.send("Station created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/stations/:id", async (req, res) => {
  const { id } = req.params;
  const { temperature, humidity, light, pulsimeter } = req.body;

  try {
    await Station.findByIdAndUpdate(id, {
      temperature,
      humidity,
      light,
      pulsimeter,
    });
    res.send("Updated station");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/stations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Station.findByIdAndDelete(id);
    res.send("Station removed");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
