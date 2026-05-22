"use client";

import { useEffect, useRef, useState } from "react";

import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";

import HistoricoTab from "@/components/dashboard/HistoricoTab";
import LoadingBlock from "@/components/dashboard/LoadingBlock";
import ModelsTab from "@/components/dashboard/ModelsTab";
import PageHeader from "@/components/dashboard/PageHeader";
import PredictionsTab from "@/components/dashboard/PredictionsTab";
import SummaryTab from "@/components/dashboard/SummaryTab";
import { formatDate, parseLocalDate } from "@/utils/dateUtils";
import ApiService from "@/service/apiService";

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

      setMetricas(Object.values(metricasData || {}));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    consultarDetalleModelo(modeloSeleccionado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeloSeleccionado]);

  return (
    <main className="page-container">
      <Toast ref={toast} />

      <PageHeader loading={loading} onRefresh={loadInicial} />

      {loading && <LoadingBlock />}

     <TabView>
  <TabPanel header="Resumen" leftIcon="pi pi-chart-bar mr-2">
    <SummaryTab resumen={resumen} modelosInfo={modelosInfo} />
  </TabPanel>

  <TabPanel header="Histórico" leftIcon="pi pi-table mr-2">
    <HistoricoTab
      loading={loading}
      historico={historico}
      asesoresOptions={asesoresOptions}
      histIdUser={histIdUser}
      histFechaInicio={histFechaInicio}
      histFechaFin={histFechaFin}
      onSelectAsesor={seleccionarAsesorHistorico}
      onChangeFechaInicio={setHistFechaInicio}
      onChangeFechaFin={setHistFechaFin}
      onConsultar={consultarHistorico}
    />
  </TabPanel>

  <TabPanel header="Modelos" leftIcon="pi pi-sitemap mr-2">
    <ModelsTab
      loading={loading}
      metricas={metricas}
      modeloSeleccionado={modeloSeleccionado}
      detalleModelo={detalleModelo}
      onChangeModelo={setModeloSeleccionado}
      onConsultarDetalle={() => consultarDetalleModelo()}
    />
  </TabPanel>

  <TabPanel header="Predicciones" leftIcon="pi pi-bolt mr-2">
    <PredictionsTab
      loading={loading}
      predicciones={predicciones}
      asesoresOptions={asesoresOptions}
      predModo={predModo}
      predFecha={predFecha}
      predFechaInicio={predFechaInicio}
      predFechaFin={predFechaFin}
      predIdUser={predIdUser}
      predModelo={predModelo}
      onChangeModo={setPredModo}
      onChangeFecha={setPredFecha}
      onChangeFechaInicio={setPredFechaInicio}
      onChangeFechaFin={setPredFechaFin}
      onChangeAsesor={setPredIdUser}
      onChangeModelo={setPredModelo}
      onConsultar={consultarPredicciones}
    />
  </TabPanel>
</TabView>
    </main>
  );
}