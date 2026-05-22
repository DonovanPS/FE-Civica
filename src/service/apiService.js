const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Error consultando el backend");
  }

  return data;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

const ApiService = {
  getHealth() {
    return fetchJson("/health");
  },

  getHistoricoResumen() {
    return fetchJson("/historico/resumen");
  },

  getHistoricoDisponibilidad(params = {}) {
    return fetchJson(`/historico/disponibilidad${buildQuery(params)}`);
  },

  getModelos() {
    return fetchJson("/modelos");
  },

  getMetricasModelos() {
    return fetchJson("/modelos/metricas");
  },

  getDetalleModelo(nombreModelo) {
    return fetchJson(`/modelos/${nombreModelo}`);
  },

  getPredicciones(params = {}) {
    return fetchJson(`/predicciones${buildQuery(params)}`);
  },
};

export default ApiService;