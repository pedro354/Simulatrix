const lights = [
  document.getElementById("light1"),
  document.getElementById("light2"),
  document.getElementById("light3")
];

const ac = document.getElementById("ac");
const tempDisplay =
  document.getElementById("tempDisplay");

const scenarioInput =
  document.getElementById("scenarioInput");

const submitScenario =
  document.getElementById("submitScenario");

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return { r, g, b };
}

function updateLight(
  element,
  colorHex,
  intensity
) {
  const color = hexToRgb(colorHex);

  const opacity = intensity / 100;

  element.style.background =
    `radial-gradient(
      circle,
      rgba(${color.r}, ${color.g}, ${color.b}, ${opacity}) 0%,
      rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.5}) 30%,
      transparent 70%
    )`;
}

function applyConfiguration(config) {
  const lamp1 =
    config[0]["luz principal"];

  const lamp2 =
    config[1]["luz esquerda"];

  const lamp3 =
    config[2]["luz direita"];

  const air =
    config[3]["ar condicionado"];

  updateLight(
    lights[0],
    lamp1["código rgb"],
    lamp1.intensidade
  );

  updateLight(
    lights[1],
    lamp2["código rgb"],
    lamp2.intensidade
  );

  updateLight(
    lights[2],
    lamp3["código rgb"],
    lamp3.intensidade
  );

  tempDisplay.textContent =
    `${air.temperatura}°C`;

  ac.style.background =
    air.estado === "ligado"
      ? "#4da6ff"
      : "#555";
}

submitScenario.addEventListener(
  "click",
  async () => {
    const description =
      scenarioInput.value.trim();

    if (!description) return;

    try {
      await fetch("/setHouseSetup", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          description
        })
      });

      scenarioInput.value = "";
    } catch (error) {
      console.error(error);
    }
  }
);

async function refreshHouse() {
  try {
    const response =
      await fetch("/config.json");

    const config =
      await response.json();

    applyConfiguration(config);
  } catch (error) {
    console.error(error);
  }
}

refreshHouse();

setInterval(
  refreshHouse,
  3000
);