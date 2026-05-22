"use client";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";

import {
  cumpleBody,
  numberBody,
  percentBody,
} from "@/utils/tableTemplates";

export default function HistoricoTab({
  loading,
  historico,
  asesoresOptions,
  histIdUser,
  histFechaInicio,
  histFechaFin,
  onSelectAsesor,
  onChangeFechaInicio,
  onChangeFechaFin,
  onConsultar,
}) {
  return (
    <>
      <div className="card">
        <div className="grid">
          <div className="col-12 md:col-3">
            <label className="block mb-2">Asesor</label>
            <Dropdown
              className="w-full"
              value={histIdUser}
              options={asesoresOptions}
              onChange={(e) => onSelectAsesor(e.value)}
              placeholder="Todos los asesores"
              filter
              showClear
              emptyMessage="No hay asesores disponibles"
              emptyFilterMessage="No se encontraron asesores"
            />
          </div>

          <div className="col-12 md:col-3">
            <label className="block mb-2">Fecha inicio</label>
            <Calendar
              className="w-full"
              value={histFechaInicio}
              onChange={(e) => onChangeFechaInicio(e.value)}
              dateFormat="yy-mm-dd"
              showIcon
            />
          </div>

          <div className="col-12 md:col-3">
            <label className="block mb-2">Fecha fin</label>
            <Calendar
              className="w-full"
              value={histFechaFin}
              onChange={(e) => onChangeFechaFin(e.value)}
              dateFormat="yy-mm-dd"
              showIcon
            />
          </div>

          <div className="col-12 md:col-3 flex align-items-end">
            <Button
              className="w-full"
              label="Consultar histórico"
              icon="pi pi-search"
              onClick={onConsultar}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <DataTable
        value={historico}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage="No hay datos para mostrar."
        stripedRows
      >
        <Column field="fecha_colombia" header="Fecha" sortable />
        <Column field="id_user" header="Asesor" sortable />
        <Column
          header="Min. available"
          body={(row) => numberBody(row, "minutos_available")}
          sortable
        />
        <Column
          header="% disponibilidad"
          body={(row) => percentBody(row, "pct_disponibilidad_capeada_6h")}
          sortable
        />
        <Column
          header="Cumple 6h"
          body={(row) => cumpleBody(row, "cumple_disponibilidad_6h")}
          sortable
        />
        <Column
          header="Desconexiones"
          field="cantidad_desconexiones_mismo_dia"
          sortable
        />
      </DataTable>
    </>
  );
}