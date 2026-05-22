"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabPanel, TabView } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import ApiService from "@/service/apiService";
import MetricCard from "@/components/MetricCard";
import ConfusionMatrix from "@/components/ConfusionMatrix";

const MODELOS = [
  { label: "Stacking", value: "stacking" },
  { label: "Regresión logística", value: "logistic_regression" },
  { label: "Random Forest", value: "random_forest" },
  { label: "XGBoost", value: "xgboost" },
  { label: "Todos", value: "all" },
];

function formatDate(date) {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseLocalDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function percentBody(row, field) {
  const value = row[field];

  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return `${Number(value).toFixed(2)}%`;
}

function probabilityBody(row, field) {
  const value = row[field];

  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return `${(Number(value) * 100).toFixed(2)}%`;
}

function numberBody(row, field, decimals = 2) {
  const value = row[field];

  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return Number(value).toFixed(decimals);
}

function riesgoBody(row) {
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

function cumpleBody(row, field = "cumple_predicho") {
  const value = row[field];

  if (value === true || value === 1) {
    return <Tag value="Cumple" severity="success" />;
  }

  if (value === false || value === 0) {
    return <Tag value="No cumple" severity="danger" />;
  }

  return <Tag value="Sin dato" />;
}

export default function Home() {
  const toast = useRef(null);

  const [loading, setLoading] = useState(false);

  const [resumen, setResumen] = useState(null);
  const [modelosInfo, setModelosInfo] = useState(null);
  const [metricas, setMetricas] = useState([]);

  const [asesoresDetalle, setAsesoresDetalle] = useState([]);
  const [asesoresOptions, setAsesoresOptions] = useState([]);

  const [historico, setHistorico] = useState([]);
  const [histIdUser, setHistIdUser] = useState(null);
  const [histFechaInicio, setHistFechaInicio] = useState(null);
  const [histFechaFin, setHistFechaFin] = useState(null);

  const [modeloSeleccionado, setModeloSeleccionado] = useState("stacking");
  const [detalleModelo, setDetalleModelo] = useState(null);

  const [predicciones, setPredicciones] = useState([]);
  const [predModo, setPredModo] = useState("fecha");
  const [predFecha, setPredFecha] = useState(null);
  const [predFechaInicio, setPredFechaInicio] = useState(null);
  const [predFechaFin, setPredFechaFin] = useState(null);
  const [predIdUser, setPredIdUser] = useState(null);
  const [predModelo, setPredModelo] = useState("stacking");

  const showError = (error) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error?.message || "Ha ocurrido un error",
      life: 4500,
    });
  };

  const showWarn = (message) => {
    toast.current?.show({
      severity: "warn",
      summary: "Validación",
      detail: message,
      life: 3500,
    });
  };

  const buildAsesorOptions = (resumenData) => {
    const detalle = resumenData?.asesores_detalle || [];

    if (detalle.length > 0) {
      return detalle.map((asesor) => ({
        label: `${asesor.id_user} (${asesor.primer_evento} a ${asesor.ultimo_evento})`,
        value: asesor.id_user,
      }));
    }

    return (resumenData?.lista_asesores || []).map((idUser) => ({
      label: idUser,
      value: idUser,
    }));
  };

  const seleccionarAsesorHistorico = (idUser) => {
    setHistIdUser(idUser);

    if (!idUser) {
      setHistFechaInicio(
        resumen?.fecha_minima ? parseLocalDate(resumen.fecha_minima) : null
      );
      setHistFechaFin(
        resumen?.fecha_maxima ? parseLocalDate(resumen.fecha_maxima) : null
      );
      return;
    }

    const asesor = asesoresDetalle.find((item) => item.id_user === idUser);

    if (!asesor) return;

    setHistFechaInicio(parseLocalDate(asesor.primer_evento));
    setHistFechaFin(parseLocalDate(asesor.ultimo_evento));
  };

  const loadInicial = async () => {
    setLoading(true);

    try {
      const [resumenData, modelosData, metricasData] = await Promise.all([
        ApiService.getHistoricoResumen(),
        ApiService.getModelos(),
        ApiService.getMetricasModelos(),
      ]);

      setResumen(resumenData);
      setModelosInfo(modelosData);

      setHistFechaInicio(
        resumenData?.fecha_minima ? parseLocalDate(resumenData.fecha_minima) : null
      );
      setHistFechaFin(
        resumenData?.fecha_maxima ? parseLocalDate(resumenData.fecha_maxima) : null
      );

      const metricasArray = Object.values(metricasData || {});
      setMetricas(metricasArray);

      setAsesoresDetalle(resumenData?.asesores_detalle || []);
      setAsesoresOptions(buildAsesorOptions(resumenData));
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const consultarHistorico = async () => {
    if (histFechaInicio && histFechaFin && histFechaFin < histFechaInicio) {
      showWarn("La fecha final no puede ser menor que la fecha inicial.");
      return;
    }

    setLoading(true);

    try {
      const data = await ApiService.getHistoricoDisponibilidad({
        id_user: histIdUser,
        fecha_inicio: formatDate(histFechaInicio),
        fecha_fin: formatDate(histFechaFin),
        limit: 1000,
      });

      setHistorico(data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const consultarDetalleModelo = async (modelo = modeloSeleccionado) => {
    if (modelo === "all") return;

    setLoading(true);

    try {
      const data = await ApiService.getDetalleModelo(modelo);
      setDetalleModelo(data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const consultarPredicciones = async () => {
    if (predModo === "fecha" && !predFecha) {
      showWarn("Selecciona una fecha para generar la predicción.");
      return;
    }

    if (predModo === "rango" && (!predFechaInicio || !predFechaFin)) {
      showWarn("Selecciona fecha inicial y fecha final para generar la predicción.");
      return;
    }

    if (predModo === "rango" && predFechaFin < predFechaInicio) {
      showWarn("La fecha final no puede ser menor que la fecha inicial.");
      return;
    }

    setLoading(true);

    try {
      const params = {
        id_user: predIdUser,
        modelo: predModelo,
      };

      if (predModo === "fecha") {
        params.fecha = formatDate(predFecha);
      } else {
        params.fecha_inicio = formatDate(predFechaInicio);
        params.fecha_fin = formatDate(predFechaFin);
      }

      const data = await ApiService.getPredicciones(params);
      setPredicciones(data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInicial();
  }, []);

  useEffect(() => {
    consultarDetalleModelo(modeloSeleccionado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeloSeleccionado]);

  return (
    <main className="page-container">
      <Toast ref={toast} />

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
            onClick={loadInicial}
            loading={loading}
          />
        </div>
      </div>

      {loading && (
        <div className="card flex justify-content-center">
          <ProgressSpinner />
        </div>
      )}

      <TabView>
        <TabPanel header="Resumen" leftIcon="pi pi-chart-bar mr-2">
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
              Modelo principal:{" "}
              <b>{modelosInfo?.modelo_principal || "stacking"}</b>
            </p>

            <div className="flex flex-wrap gap-2">
              {(modelosInfo?.modelos || []).map((modelo) => (
                <Tag key={modelo} value={modelo} severity="info" />
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Histórico" leftIcon="pi pi-table mr-2">
          <div className="card">
            <div className="grid">
              <div className="col-12 md:col-3">
                <label className="block mb-2">Asesor</label>
                <Dropdown
                  className="w-full"
                  value={histIdUser}
                  options={asesoresOptions}
                  onChange={(e) => seleccionarAsesorHistorico(e.value)}
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
                  onChange={(e) => setHistFechaInicio(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>

              <div className="col-12 md:col-3">
                <label className="block mb-2">Fecha fin</label>
                <Calendar
                  className="w-full"
                  value={histFechaFin}
                  onChange={(e) => setHistFechaFin(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>

              <div className="col-12 md:col-3 flex align-items-end">
                <Button
                  className="w-full"
                  label="Consultar histórico"
                  icon="pi pi-search"
                  onClick={consultarHistorico}
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
        </TabPanel>

        <TabPanel header="Modelos" leftIcon="pi pi-sitemap mr-2">
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
                  options={MODELOS.filter((m) => m.value !== "all")}
                  onChange={(e) => setModeloSeleccionado(e.value)}
                  placeholder="Seleccione modelo"
                />
              </div>

              <Button
                label="Consultar detalle"
                icon="pi pi-search"
                onClick={() => consultarDetalleModelo()}
                loading={loading}
              />
            </div>

            <Divider />

            <h3>Matriz de confusión</h3>
            <ConfusionMatrix matriz={detalleModelo?.matriz_confusion} />
          </div>
        </TabPanel>

        <TabPanel header="Predicciones" leftIcon="pi pi-bolt mr-2">
          <div className="card">
            <div className="grid">
              <div className="col-12 md:col-3">
                <label className="block mb-2">Tipo de consulta</label>
                <Dropdown
                  className="w-full"
                  value={predModo}
                  options={[
                    { label: "Fecha exacta", value: "fecha" },
                    { label: "Rango de fechas", value: "rango" },
                  ]}
                  onChange={(e) => setPredModo(e.value)}
                />
              </div>

              {predModo === "fecha" ? (
                <div className="col-12 md:col-3">
                  <label className="block mb-2">Fecha</label>
                  <Calendar
                    className="w-full"
                    value={predFecha}
                    onChange={(e) => setPredFecha(e.value)}
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
                      onChange={(e) => setPredFechaInicio(e.value)}
                      dateFormat="yy-mm-dd"
                      showIcon
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <label className="block mb-2">Fecha fin</label>
                    <Calendar
                      className="w-full"
                      value={predFechaFin}
                      onChange={(e) => setPredFechaFin(e.value)}
                      dateFormat="yy-mm-dd"
                      showIcon
                    />
                  </div>
                </>
              )}

              <div className="col-12 md:col-3">
                <label className="block mb-2">Modelo</label>
                <Dropdown
                  className="w-full"
                  value={predModelo}
                  options={MODELOS}
                  onChange={(e) => setPredModelo(e.value)}
                />
              </div>

              <div className="col-12 md:col-4">
                <label className="block mb-2">Asesor opcional</label>
                <Dropdown
                  className="w-full"
                  value={predIdUser}
                  options={asesoresOptions}
                  onChange={(e) => setPredIdUser(e.value)}
                  placeholder="Todos los asesores"
                  filter
                  showClear
                  emptyMessage="No hay asesores disponibles"
                  emptyFilterMessage="No se encontraron asesores"
                />
              </div>

              <div className="col-12 md:col-3 flex align-items-end">
                <Button
                  className="w-full"
                  label="Predecir"
                  icon="pi pi-bolt"
                  onClick={consultarPredicciones}
                  loading={loading}
                />
              </div>
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
        </TabPanel>
      </TabView>
    </main>
  );
}