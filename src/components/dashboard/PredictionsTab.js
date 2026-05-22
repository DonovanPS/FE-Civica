"use client";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";

import { TIPOS_PREDICCION } from "@/constants/dashboardOptions";
import {
  cumpleBody,
  probabilityBody,
  riesgoBody,
} from "@/utils/tableTemplates";

export default function PredictionsTab({
  loading,
  predicciones,
  asesoresOptions,
  predModo,
  predFecha,
  predFechaInicio,
  predFechaFin,
  predIdUser,
  onChangeModo,
  onChangeFecha,
  onChangeFechaInicio,
  onChangeFechaFin,
  onChangeAsesor,
  onConsultar,
}) {
  return (
    <>
      <div className="card">
        <div className="grid">
          <div className="col-12 md:col-3">
            <label className="block mb-2">Tipo de consulta</label>
            <Dropdown
              className="w-full"
              value={predModo}
              options={TIPOS_PREDICCION}
              onChange={(e) => onChangeModo(e.value)}
            />
          </div>

          {predModo === "fecha" ? (
            <div className="col-12 md:col-3">
              <label className="block mb-2">Fecha</label>
              <Calendar
                className="w-full"
                value={predFecha}
                onChange={(e) => onChangeFecha(e.value)}
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>
          ) : (
            <>
              <div className="col-12 md:col-3">
                <label className="block mb-2">Fecha inicio</label>
                <Calendar
                  className="w-full"
                  value={predFechaInicio}
                  onChange={(e) => onChangeFechaInicio(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>

              <div className="col-12 md:col-3">
                <label className="block mb-2">Fecha fin</label>
                <Calendar
                  className="w-full"
                  value={predFechaFin}
                  onChange={(e) => onChangeFechaFin(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>
            </>
          )}

          <div className="col-12 md:col-4">
            <label className="block mb-2">Asesor opcional</label>
            <Dropdown
              className="w-full"
              value={predIdUser}
              options={asesoresOptions}
              onChange={(e) => onChangeAsesor(e.value)}
              placeholder="Todos los asesores"
              filter
              showClear
              emptyMessage="No hay asesores disponibles"
              emptyFilterMessage="No se encontraron asesores"
            />
          </div>

          <div className="col-12 md:col-2 flex align-items-end">
            <Button
              className="w-full"
              label="Predecir"
              icon="pi pi-bolt"
              onClick={onConsultar}
              loading={loading}
            />
          </div>
        </div>

        <div className="mt-3 text-sm text-color-secondary">
          Modelo utilizado para la predicción: <b>stacking</b>.
        </div>
      </div>

      <DataTable
        value={predicciones}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage="No hay predicciones para mostrar."
        stripedRows
      >
        <Column field="fecha_prediccion" header="Fecha" sortable />
        <Column field="id_user" header="Asesor" sortable />
        <Column field="modelo" header="Modelo" sortable />
        <Column
          header="Predicción"
          body={(row) => cumpleBody(row, "cumple_predicho")}
          sortable
        />
        <Column
          header="Prob. cumplir"
          body={(row) => probabilityBody(row, "probabilidad_cumplir")}
          sortable
        />
        <Column
          header="Prob. no cumplir"
          body={(row) => probabilityBody(row, "probabilidad_no_cumplir")}
          sortable
        />
        <Column header="Riesgo" body={riesgoBody} sortable />
        <Column
          field="dias_con_dato_ult_30_dias"
          header="Días hist. 30d"
          sortable
        />
      </DataTable>
    </>
  );
}