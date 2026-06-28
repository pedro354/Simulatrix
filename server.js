const express = require("express");
const fs = require("fs");
const path = require("path");

const { getConfiguration } = require("./open-ai");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/setHouseSetup", async (req, res) => {
  try {
    const { description } = req.body;

    const configuration = await getConfiguration(description);

    const parsedConfiguration = JSON.parse(configuration);

    fs.writeFileSync(
      path.join(__dirname, "config.json"),
      JSON.stringify(parsedConfiguration, null, 2)
    );

    return res.json(parsedConfiguration);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});