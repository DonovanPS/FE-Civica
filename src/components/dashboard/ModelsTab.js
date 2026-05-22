"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";

import ConfusionMatrix from "@/components/ConfusionMatrix";
import { MODELOS_DETALLE } from "@/constants/dashboardOptions";
import { numberBody } from "@/utils/tableTemplates";

export default function ModelsTab({
  loading,
  metricas,
  modeloSeleccionado,
  detalleModelo,
  onChangeModelo,
  onConsultarDetalle,
}) {
  return (
    <>
      <div className="card">
        <h3>Comparación de métricas</h3>

        <DataTable
          value={metricas}
          paginator
          rows={10}
          emptyMessage="No hay métricas para mostrar."
          stripedRows
        >
          <Column field="modelo" header="Modelo" sortable />
          <Column
            header="Accuracy"
            body={(row) => numberBody(row, "accuracy", 4)}
            sortable
          />
          <Column
            header="Recall no cumple"
            body={(row) => numberBody(row, "recall_no_cumple", 4)}
            sortable
          />
          <Column
            header="F1 no cumple"
            body={(row) => numberBody(row, "f1_no_cumple", 4)}
            sortable
          />
          <Column
            header="ROC AUC"
            body={(row) => numberBody(row, "roc_auc", 4)}
            sortable
          />
        </DataTable>
      </div>

      <div className="card">
        <div className="flex flex-column md:flex-row md:align-items-end gap-3">
          <div className="w-full md:w-20rem">
            <label className="block mb-2">Modelo</label>
            <Dropdown
              className="w-full"
              value={modeloSeleccionado}
              options={MODELOS_DETALLE}
              onChange={(e) => onChangeModelo(e.value)}
              placeholder="Seleccione modelo"
            />
          </div>

          <Button
            label="Consultar detalle"
            icon="pi pi-search"
            onClick={onConsultarDetalle}
            loading={loading}
          />
        </div>

        <Divider />

        <h3>Matriz de confusión</h3>
        <ConfusionMatrix matriz={detalleModelo?.matriz_confusion} />
      </div>
    </>
  );
}