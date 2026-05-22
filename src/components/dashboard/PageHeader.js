"use client";

import { Button } from "primereact/button";

export default function PageHeader({ loading, onRefresh }) {
  return (
    <div className="card">
      <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
        <div>
          <h1 className="page-title">Disponibilidad de Asesores</h1>
          <p className="page-subtitle">
            Dashboard de histórico, evaluación de modelos y predicción de
            cumplimiento de 6 horas.
          </p>
        </div>

        <Button
          label="Actualizar"
          icon="pi pi-refresh"
          onClick={onRefresh}
          loading={loading}
        />
      </div>
    </div>
  );
}