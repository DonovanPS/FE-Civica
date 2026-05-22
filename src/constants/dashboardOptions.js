export const MODELOS = [
  { label: "Stacking", value: "stacking" },
  { label: "Regresión logística", value: "logistic_regression" },
  { label: "Random Forest", value: "random_forest" },
  { label: "XGBoost", value: "xgboost" },
  { label: "Todos", value: "all" },
];

export const MODELOS_DETALLE = MODELOS.filter((modelo) => modelo.value !== "all");

export const TIPOS_PREDICCION = [
  { label: "Fecha exacta", value: "fecha" },
  { label: "Rango de fechas", value: "rango" },
];