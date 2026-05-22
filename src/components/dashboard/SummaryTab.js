"use client";

import { Tag } from "primereact/tag";

import MetricCard from "@/components/MetricCard";

export default function SummaryTab({ resumen, modelosInfo }) {
  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-3">
          <MetricCard
            title="Registros asesor-día"
            value={resumen?.registros_asesor_dia}
            icon="pi-database"
          />
        </div>

        <div className="col-12 md:col-3">
          <MetricCard
            title="Asesores"
            value={resumen?.asesores}
            icon="pi-users"
          />
        </div>

        <div className="col-12 md:col-3">
          <MetricCard
            title="Promedio disponibilidad"
            value={resumen ? `${resumen.promedio_pct_disponibilidad}%` : "-"}
            icon="pi-percentage"
          />
        </div>

        <div className="col-12 md:col-3">
          <MetricCard
            title="Cumplimiento general"
            value={resumen ? `${resumen.pct_registros_que_cumplen}%` : "-"}
            icon="pi-check-circle"
          />
        </div>
      </div>

      <div className="card">
        <h3>Ventana de datos</h3>
        <p className="m-0 text-color-secondary">
          Desde <b>{resumen?.fecha_minima || "-"}</b> hasta{" "}
          <b>{resumen?.fecha_maxima || "-"}</b>.
        </p>
      </div>

      <div className="card">
        <h3>Modelos disponibles</h3>
        <p className="text-color-secondary">
          Modelo principal: <b>{modelosInfo?.modelo_principal || "stacking"}</b>
        </p>

        <div className="flex flex-wrap gap-2">
          {(modelosInfo?.modelos || []).map((modelo) => (
            <Tag key={modelo} value={modelo} severity="info" />
          ))}
        </div>
      </div>
    </>
  );
}