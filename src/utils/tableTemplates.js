"use client";

import { Tag } from "primereact/tag";

export function percentBody(row, field) {
  const value = row[field];

  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return `${Number(value).toFixed(2)}%`;
}

export function probabilityBody(row, field) {
  const value = row[field];

  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return `${(Number(value) * 100).toFixed(2)}%`;
}

export function numberBody(row, field, decimals = 2) {
  const value = row[field];

  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return Number(value).toFixed(decimals);
}

export function riesgoBody(row) {
  const riesgo = row.nivel_riesgo;

  if (riesgo === "alto") {
    return <Tag value="Alto" severity="danger" />;
  }

  if (riesgo === "medio") {
    return <Tag value="Medio" severity="warning" />;
  }

  if (riesgo === "bajo") {
    return <Tag value="Bajo" severity="success" />;
  }

  return <Tag value="Sin dato" />;
}

export function cumpleBody(row, field = "cumple_predicho") {
  const value = row[field];

  if (value === true || value === 1) {
    return <Tag value="Cumple" severity="success" />;
  }

  if (value === false || value === 0) {
    return <Tag value="No cumple" severity="danger" />;
  }

  return <Tag value="Sin dato" />;
}