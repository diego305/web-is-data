/* ==========================================================================
 * I+S Data Solutions — Motor cliente en ES5 estricto (Versión Liviana)
 * Compatibilidad: IE11+, Firefox 52+/ESR 78/115, Chrome 49+, Safari 9+
 * Sin const/let, sin arrow functions, sin template literals, sin módulos ES,
 * sin Array.prototype.includes, sin Object.entries, sin ?. ni ??.
 * ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "is_data_solutions_entrevistas_v1";
  var COMPANY_ADDRESS = "E. Carriego N° 431, La Rioja, Argentina";
  var MAX_OBSTACLES = 3;

  var STORAGE_LABELS = {
    spreadsheets: "Planillas de cálculo (Excel, Google Sheets) en carpetas locales o compartidas",
    erp: "Software de gestión o ERP (Tango, Bejerman, SAP, Odoo, sistema a medida, etc.)",
    billing: "Sistema de facturación electrónica o comprobantes fiscales",
    crm: "CRM o plataformas de ventas / e-commerce",
    paper: "Documentos en papel / cuadernos de registro diario",
    other: "Otro"
  };

  var INTEGRATION_LABELS = {
    "1": "1 - Muy fragmentada: Cada área maneja sus propios archivos y no coinciden entre sí.",
    "2": "2 - Básica: Hay sistemas distintos y cruzamos datos manualmente a fin de mes.",
    "3": "3 - Parcialmente integrada: Usamos un sistema central pero con muchas planillas auxiliares.",
    "4": "4 - Integrada: Toda la información clave convive en una única base de datos."
  };

  var FREQUENCY_LABELS = {
    realtime: "Tiempo real / diaria",
    weekly: "Semanal",
    monthly: "Mensual (al cierre administrativo)",
    eventual: "Eventual / solo cuando se necesita un informe puntual"
  };

  var CONFIDENCE_LABELS = {
    low: "Bajo: Solemos encontrar duplicados, errores de carga o números que no cierran.",
    medium: "Medio: Los datos son confiables pero requieren revisión y limpieza manual previa.",
    high: "Alto: Los registros son consistentes, estandarizados y auditados periódicamente."
  };

  var REPORT_TIME_LABELS = {
    hours_days: "Horas o días de trabajo manual recopilando y cruzando planillas.",
    half_day: "Medio día, con plantillas prearmadas pero manuales.",
    minutes: "Se obtienen en minutos de forma automática.",
    none: "No contamos con reportes periódicos formales."
  };

  var BI_TOOL_LABELS = {
    excel: "Planillas de Excel / tablas dinámicas",
    static_pdf: "Reportes estáticos en PDF / impresos",
    bi_tools: "Herramientas de BI (Power BI, Looker Studio, Tableau)",
    erp_native: "Informes nativos del ERP / software contable",
    none: "Ninguna / sólo consultas directas puntuales"
  };

  var MATRIZ = {
    "Nivel 1: Inicial / Disperso": {
      criterio: "Uso intensivo de planillas aisladas, datos en papel, reportes manuales lentos.",
      solucion: "Normalización y Tablero Base: Limpieza de datos + conexión de planillas a Looker Studio / Power BI con métricas comerciales directas.",
      prioridades: [
        "Digitalizar y estandarizar planillas críticas",
        "Eliminar registros en papel o cuadernos",
        "Construir el primer tablero comercial unificado (ventas y cobros)",
        "Capacitar al equipo en buenas prácticas de carga"
      ]
    },
    "Nivel 2: Operativo / Estructurado": {
      criterio: "Cuentan con ERP o facturación centralizada, pero reportan en Excel manual.",
      solucion: "Pipeline y Data Modeling: Conexión a la base de datos o exportaciones automáticas + Tablero Ejecutivo de KPIs estratégicos.",
      prioridades: [
        "Conectar BI directamente a la base del ERP / facturación",
        "Automatizar el pipeline de extracción y transformación de datos",
        "Desarrollar tablero directivo multidisciplinario (ventas, stock y finanzas)",
        "Reducir el tiempo de preparación de informes de días a minutos"
      ]
    },
    "Nivel 3: Avanzado / Preparado": {
      criterio: "Datos integrados y actualizados, buscan autonomía y exploración profunda.",
      solucion: "BI Integral & Analítica Predictiva: Tableros drill-down multidimensionales, alertas automáticas y preparación para modelos de IA.",
      prioridades: [
        "Implementar alertas tempranas de desvíos y anomalías",
        "Modelos de segmentación avanzada de clientes y forecasting de demanda",
        "Gobernanza y democratización de datos (autoservicio BI)",
        "Integración de analítica predictiva y modelos de machine learning"
      ]
    }
  };

  /* Helpers ES5 seguros (sin polyfills externos) */
  function trimStr(str) {
    return (str || "").replace(/^\s+|\s+$/g, "");
  }

  function hasValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === val) return true;
    }
    return false;
  }

  function addClass(el, cls) {
    if (!el) return;
    if ((" " + el.className + " ").indexOf(" " + cls + " ") === -1) {
      el.className = trimStr(el.className + " " + cls);
    }
  }

  function removeClass(el, cls) {
    if (!el) return;
    el.className = trimStr((" " + el.className + " ").replace(" " + cls + " ", " "));
  }

  function getCheckedValues(name) {
    var nodes = document.getElementsByName(name);
    var res = [];
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].checked) {
        res.push(nodes[i].value);
      }
    }
    return res;
  }

  function getRadioValue(name) {
    var nodes = document.getElementsByName(name);
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].checked) {
        return nodes[i].value;
      }
    }
    return "";
  }

  function formatDateYMD(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
  }

  /* Motor de scoring idéntico al de la versión principal (en ES5) */
  function calcularPuntajeAlmacenamiento(fuentes, otroDetalle) {
    if (!fuentes || fuentes.length === 0) return 20.0;
    var tienePapel = hasValue(fuentes, "paper");
    var tienePlanillas = hasValue(fuentes, "spreadsheets");
    var tieneErp = hasValue(fuentes, "erp");
    var tieneFacturacion = hasValue(fuentes, "billing");
    var tieneCrm = hasValue(fuentes, "crm");
    var tieneOtroDigital = hasValue(fuentes, "other") && trimStr(otroDetalle).length > 0;
    var score = 35.0;

    if (tieneErp && tieneCrm && !tienePapel) {
      score = 95.0;
    } else if (tieneErp && !tienePapel && (tieneFacturacion || tienePlanillas || tieneOtroDigital)) {
      score = 75.0;
    } else if (tieneErp) {
      score = tienePapel ? 60.0 : 70.0;
    } else if (tieneCrm && !tienePapel) {
      score = tieneFacturacion || tieneOtroDigital ? 70.0 : 60.0;
    } else if (tieneFacturacion && !tienePapel) {
      score = tienePlanillas || tieneOtroDigital ? 55.0 : 50.0;
    } else if (tienePlanillas && !tienePapel) {
      score = tieneOtroDigital ? 45.0 : 40.0;
    } else if (tienePapel) {
      score = 20.0;
    } else if (tieneOtroDigital) {
      score = 45.0;
    }
    return Math.min(100.0, Math.max(10.0, score));
  }

  function evaluarDiagnostico(r) {
    var intScores = { "1": 25.0, "2": 50.0, "3": 75.0, "4": 100.0 };
    var freqScores = { realtime: 100.0, weekly: 75.0, monthly: 50.0, eventual: 25.0 };
    var confScores = { high: 100.0, medium: 65.0, low: 25.0 };
    var timeScores = { minutes: 100.0, half_day: 65.0, hours_days: 35.0, none: 20.0 };
    var toolScores = { bi_tools: 100.0, erp_native: 75.0, excel: 50.0, static_pdf: 35.0, none: 15.0 };

    var pAlm = calcularPuntajeAlmacenamiento(r.fuentes, r.fuenteOtro);
    var pInt = intScores[r.integracion] || 50.0;
    var pFreq = freqScores[r.frecuencia] || 40.0;
    var pCal = confScores[r.confianza] || 40.0;
    var sTiempo = timeScores[r.tiempoReporte] || 30.0;
    var sHerr = toolScores[r.herramienta] || 30.0;
    var pEfic = Math.round(((sTiempo * 0.5) + (sHerr * 0.5)) * 10) / 10;

    var scoreGlobal = Math.round(
      ((pAlm * 0.20) + (pInt * 0.25) + (pFreq * 0.15) + (pCal * 0.20) + (pEfic * 0.20)) * 10
    ) / 10;

    var nivel = "Nivel 3: Avanzado / Preparado";
    if (scoreGlobal < 45.0) {
      nivel = "Nivel 1: Inicial / Disperso";
    } else if (scoreGlobal < 75.0) {
      nivel = "Nivel 2: Operativo / Estructurado";
    }

    return {
      scoreGlobal: scoreGlobal,
      nivel: nivel,
      matriz: MATRIZ[nivel],
      dimensiones: [
        { nombre: "Almacenamiento y Fuentes", valor: pAlm },
        { nombre: "Integración entre Áreas", valor: pInt },
        { nombre: "Frecuencia de Actualización", valor: pFreq },
        { nombre: "Calidad y Consistencia", valor: pCal },
        { nombre: "Eficiencia de Reportes", valor: pEfic }
      ]
    };
  }

  /* Persistencia defensiva: nunca rompe si localStorage está bloqueado (IE11 file:// o modo estricto) */
  function readSavedList() {
    try {
      if (!window.localStorage) return [];
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Object.prototype.toString.call(parsed) === "[object Array]" ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveDiagnosticLocally(record) {
    try {
      if (!window.localStorage) return false;
      var list = readSavedList();
      list.unshift(record);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* Descarga compatible con IE11 (msSaveOrOpenBlob), Firefox ESR, Chrome 49+ y Safari 9+ */
  function downloadTextFile(filename, content) {
    try {
      if (window.Blob) {
        var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, filename);
          return;
        }
        var urlApi = window.URL || window.webkitURL;
        if (urlApi && urlApi.createObjectURL) {
          var url = urlApi.createObjectURL(blob);
          var link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(function () {
            urlApi.revokeObjectURL(url);
          }, 250);
          return;
        }
      }
      window.location.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    } catch (e) {
      /* Último recurso en navegadores muy restrictivos: abrir diálogo de impresión */
      window.print();
    }
  }

  /* Construcción segura del DOM (solo createTextNode / textContent para evitar XSS) */
  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") {
      el.appendChild(document.createTextNode(text));
    }
    return el;
  }

  function buildReportText(data, diag, fecha) {
    var lines = [
      "# REPORTE DE EVALUACIÓN DE MADUREZ DE DATOS & BI",
      "I+S DATA SOLUTIONS — Information + Solutions",
      "========================================================================",
      "Empresa: " + data.empresa,
      "Responsable: " + data.responsable + (data.rol ? " (" + data.rol + ")" : ""),
      "Sector: " + data.sector + (data.sector === "Otro" && data.sectorOtro ? " (" + data.sectorOtro + ")" : ""),
      "Colaboradores: " + data.colaboradores,
      "Fecha: " + fecha,
      "Puntaje Global: " + diag.scoreGlobal + " / 100",
      "Nivel de Madurez: " + diag.nivel,
      "",
      "PUNTAJE POR DIMENSIÓN:"
    ];
    for (var i = 0; i < diag.dimensiones.length; i++) {
      lines.push("  - " + diag.dimensiones[i].nombre + ": " + diag.dimensiones[i].valor + "/100");
    }
    lines.push("");
    lines.push("CRITERIO DIAGNÓSTICO:");
    lines.push(diag.matriz.criterio);
    lines.push("");
    lines.push("SOLUCIÓN INICIAL RECOMENDADA:");
    lines.push(diag.matriz.solucion);
    lines.push("");
    lines.push("PLAN DE ACCIÓN:");
    for (var j = 0; j < diag.matriz.prioridades.length; j++) {
      lines.push("  Paso " + (j + 1) + ": " + diag.matriz.prioridades[j]);
    }
    lines.push("");
    lines.push("PROCESO PRIORITARIO: " + data.prioridad + (data.prioridad === "Otro" && data.prioridadOtro ? " (" + data.prioridadOtro + ")" : ""));
    lines.push("VALOR ESPERADO: " + data.valorEsperado);
    lines.push("OBSERVACIONES: " + (data.observaciones || "Sin observaciones"));
    lines.push("EVALUADOR: " + (data.evaluador || "Autodiagnóstico"));
    lines.push("========================================================================");
    lines.push("I+S DATA SOLUTIONS — " + COMPANY_ADDRESS);
    return lines.join("\n");
  }

  function renderReport(data, diag, persisted) {
    var resultWrap = document.getElementById("reporte-resultado");
    var alertEl = document.getElementById("reporte-alerta");
    var bodyEl = document.getElementById("reporte-cuerpo");
    var formWrap = document.getElementById("contenedor-formulario");
    var fecha = formatDateYMD(new Date());

    alertEl.innerHTML = "";
    bodyEl.innerHTML = "";

    if (persisted) {
      removeClass(alertEl, "is-warning");
      alertEl.appendChild(createEl("strong", "", "Diagnóstico completado con éxito. "));
      alertEl.appendChild(document.createTextNode("El informe de " + data.empresa + " ya está listo y guardado en este navegador."));
    } else {
      addClass(alertEl, "is-warning");
      alertEl.appendChild(createEl("strong", "", "Informe generado sin guardado local. "));
      alertEl.appendChild(document.createTextNode("El navegador restringió el almacenamiento local; descargá el archivo .txt para conservar el resultado."));
    }

    var toolbar = createEl("div", "toolbar-row no-print");
    var btnNew = createEl("button", "btn-secondary", "Nuevo Diagnóstico");
    btnNew.type = "button";
    btnNew.onclick = function () {
      addClass(resultWrap, "is-hidden");
      removeClass(formWrap, "is-hidden");
      window.scrollTo(0, 0);
    };

    var btnPrint = createEl("button", "btn-secondary", "Imprimir Informe");
    btnPrint.type = "button";
    btnPrint.onclick = function () {
      window.print();
    };

    var btnDownload = createEl("button", "btn-primary", "Descargar Informe (.txt)");
    btnDownload.type = "button";
    btnDownload.onclick = function () {
      var safeName = data.empresa.toLowerCase().replace(/[^a-z0-9]+/g, "_") || "organizacion";
      downloadTextFile("diagnostico_bi_" + safeName + ".txt", buildReportText(data, diag, fecha));
    };

    toolbar.appendChild(btnNew);
    toolbar.appendChild(btnPrint);
    toolbar.appendChild(btnDownload);
    bodyEl.appendChild(toolbar);

    var header = createEl("div", "dark-panel");
    header.appendChild(createEl("div", "dark-kicker", "INFORME DE EVALUACIÓN BI · " + fecha));
    header.appendChild(createEl("h2", "dark-title", data.empresa));
    header.appendChild(
      createEl(
        "p",
        "",
        "Responsable: " + data.responsable + (data.rol ? " (" + data.rol + ")" : "") +
        " · Sector: " + data.sector + (data.sector === "Otro" && data.sectorOtro ? " (" + data.sectorOtro + ")" : "") +
        " · " + data.colaboradores + " colaboradores"
      )
    );
    header.appendChild(
      createEl(
        "p",
        "dark-score",
        "Diagnóstico Oficial: " + diag.nivel + " — Score Global: " + diag.scoreGlobal + " / 100 pts"
      )
    );
    bodyEl.appendChild(header);

    /* Tabla de 5 dimensiones con barras CSS simples */
    var dimTitle = createEl("h3", "section-heading", "Desglose por Dimensión (0 a 100%)");
    bodyEl.appendChild(dimTitle);

    var table = createEl("table", "data-table");
    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    headRow.appendChild(createEl("th", "", "Dimensión"));
    headRow.appendChild(createEl("th", "col-score", "Nivel"));
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < diag.dimensiones.length; i++) {
      var dim = diag.dimensiones[i];
      var tr = document.createElement("tr");
      tr.appendChild(createEl("td", "", dim.nombre));
      var tdVal = createEl("td", "col-score");
      var track = createEl("div", "bar-track");
      var fillClass = dim.valor >= 75 ? "bar-fill bar-blue" : (dim.valor >= 55 ? "bar-fill bar-bronze" : "bar-fill bar-red");
      var fill = createEl("div", fillClass);
      fill.style.width = dim.valor + "%";
      track.appendChild(fill);
      tdVal.appendChild(track);
      tdVal.appendChild(createEl("span", "mono", dim.valor + "%"));
      tr.appendChild(tdVal);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    bodyEl.appendChild(table);

    /* Dictamen y plan */
    var planBox = createEl("div", "subbox mt-12");
    planBox.appendChild(createEl("h3", "subbox-title blue-text", "Dictamen y Solución Inicial Recomendada"));
    var pCrit = createEl("p", "");
    pCrit.appendChild(createEl("strong", "", "Criterio Diagnóstico: "));
    pCrit.appendChild(document.createTextNode(diag.matriz.criterio));
    planBox.appendChild(pCrit);

    var pSol = createEl("p", "");
    pSol.appendChild(createEl("strong", "", "Solución Recomendada: "));
    pSol.appendChild(document.createTextNode(diag.matriz.solucion));
    planBox.appendChild(pSol);

    var ol = createEl("ol", "num-list");
    for (var j = 0; j < diag.matriz.prioridades.length; j++) {
      ol.appendChild(createEl("li", "", diag.matriz.prioridades[j]));
    }
    planBox.appendChild(ol);
    bodyEl.appendChild(planBox);

    /* Resumen de respuestas */
    var detailBox = createEl("div", "subbox mt-12");
    detailBox.appendChild(createEl("h3", "subbox-title", "Resumen del Relevamiento"));
    var ul = createEl("ul", "bullet-list");
    ul.appendChild(createEl("li", "", "Integración: " + (INTEGRATION_LABELS[data.integracion] || data.integracion)));
    ul.appendChild(createEl("li", "", "Frecuencia: " + (FREQUENCY_LABELS[data.frecuencia] || data.frecuencia)));
    ul.appendChild(createEl("li", "", "Calidad: " + (CONFIDENCE_LABELS[data.confianza] || data.confianza)));
    ul.appendChild(createEl("li", "", "Tiempo de reporte: " + (REPORT_TIME_LABELS[data.tiempoReporte] || data.tiempoReporte)));
    ul.appendChild(createEl("li", "", "Herramienta actual: " + (BI_TOOL_LABELS[data.herramienta] || data.herramienta)));
    ul.appendChild(createEl("li", "", "Proceso prioritario: " + data.prioridad + (data.prioridad === "Otro" && data.prioridadOtro ? " (" + data.prioridadOtro + ")" : "")));
    ul.appendChild(createEl("li", "", "Valor esperado: " + data.valorEsperado));
    if (data.observaciones) {
      ul.appendChild(createEl("li", "", "Observaciones: " + data.observaciones));
    }
    detailBox.appendChild(ul);
    bodyEl.appendChild(detailBox);

    addClass(formWrap, "is-hidden");
    removeClass(resultWrap, "is-hidden");
    window.scrollTo(0, 0);
  }

  /* Navegación por secciones mejorada progresivamente (preserva #hash) */
  function initNavigation() {
    addClass(document.documentElement, "js-enabled");
    var validSections = ["propuesta", "diagnostico", "modelo", "metodologia", "perfil"];
    var navLinks = document.getElementById("lite-nav-list").getElementsByTagName("a");

    function activateSection(id) {
      var targetId = hasValue(validSections, id) ? id : "diagnostico";
      for (var i = 0; i < validSections.length; i++) {
        var sec = document.getElementById(validSections[i]);
        if (sec) {
          if (validSections[i] === targetId) {
            addClass(sec, "is-current");
          } else {
            removeClass(sec, "is-current");
          }
        }
      }
      for (var j = 0; j < navLinks.length; j++) {
        var linkSec = navLinks[j].getAttribute("data-section");
        if (linkSec === targetId) {
          addClass(navLinks[j], "is-active");
          navLinks[j].setAttribute("aria-current", "page");
        } else {
          removeClass(navLinks[j], "is-active");
          navLinks[j].removeAttribute("aria-current");
        }
      }
      window.scrollTo(0, 0);
    }

    function bindLinks(nodeList) {
      for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].onclick = function (e) {
          var secId = this.getAttribute("data-section");
          if (secId) {
            if (e && e.preventDefault) e.preventDefault();
            activateSection(secId);
            if (window.location.hash !== "#" + secId) {
              window.location.hash = secId;
            }
            return false;
          }
        };
      }
    }

    bindLinks(navLinks);
    bindLinks(document.getElementsByClassName("js-goto"));

    var initialHash = (window.location.hash || "").replace("#", "");
    activateSection(initialHash || "diagnostico");

    if (window.addEventListener) {
      window.addEventListener("hashchange", function () {
        var h = (window.location.hash || "").replace("#", "");
        if (h) activateSection(h);
      }, false);
    }
  }

  /* Lógica interactiva del formulario y botones auxiliares */
  function initForm() {
    var form = document.getElementById("diagnostico-form");
    var errorEl = document.getElementById("form-error");
    var sectorSel = document.getElementById("f-sector");
    var sectorOtroWrap = document.getElementById("wrap-sector-otro");
    var cbFuenteOtro = document.getElementById("cb-fuente-otro");
    var fuenteOtroWrap = document.getElementById("wrap-fuente-otro");
    var prioSel = document.getElementById("f-prioridad");
    var prioOtroWrap = document.getElementById("wrap-prioridad-otro");
    var obsCounter = document.getElementById("obstaculos-contador");
    var btnBorrar = document.getElementById("btn-borrar-local");
    var clearFeedback = document.getElementById("clear-feedback");

    function syncOtherFields() {
      if (sectorSel.value === "Otro") removeClass(sectorOtroWrap, "is-hidden");
      else addClass(sectorOtroWrap, "is-hidden");

      if (cbFuenteOtro.checked) removeClass(fuenteOtroWrap, "is-hidden");
      else addClass(fuenteOtroWrap, "is-hidden");

      if (prioSel.value === "Otro") removeClass(prioOtroWrap, "is-hidden");
      else addClass(prioOtroWrap, "is-hidden");
    }

    function syncObstaclesLimit() {
      var boxes = document.getElementsByName("obstaculos");
      var count = 0;
      var i;
      for (i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) count++;
      }
      obsCounter.innerHTML = "";
      obsCounter.appendChild(
        document.createTextNode("(Seleccione hasta " + MAX_OBSTACLES + " — " + count + "/" + MAX_OBSTACLES + " seleccionados)")
      );
      for (i = 0; i < boxes.length; i++) {
        var disabled = !boxes[i].checked && count >= MAX_OBSTACLES;
        boxes[i].disabled = disabled;
        if (disabled) addClass(boxes[i].parentNode, "is-disabled");
        else removeClass(boxes[i].parentNode, "is-disabled");
      }
    }

    function refreshClearButton() {
      var list = readSavedList();
      if (list.length > 0) {
        btnBorrar.innerHTML = "";
        btnBorrar.appendChild(document.createTextNode("Borrar historial local (" + list.length + ")"));
        removeClass(btnBorrar, "is-hidden");
      } else {
        addClass(btnBorrar, "is-hidden");
      }
    }

    sectorSel.onchange = syncOtherFields;
    cbFuenteOtro.onchange = syncOtherFields;
    prioSel.onchange = syncOtherFields;

    var obsBoxes = document.getElementsByName("obstaculos");
    for (var k = 0; k < obsBoxes.length; k++) {
      obsBoxes[k].onchange = syncObstaclesLimit;
    }

    btnBorrar.onclick = function () {
      try {
        if (window.localStorage) window.localStorage.removeItem(STORAGE_KEY);
        refreshClearButton();
        clearFeedback.innerHTML = "";
        clearFeedback.appendChild(document.createTextNode("Se eliminaron los diagnósticos guardados en este navegador."));
      } catch (e) {
        clearFeedback.innerHTML = "";
        clearFeedback.appendChild(document.createTextNode("No se pudo limpiar el almacenamiento local en este navegador."));
      }
    };

    function showError(msg) {
      errorEl.innerHTML = "";
      errorEl.appendChild(document.createTextNode(msg));
      removeClass(errorEl, "is-hidden");
      errorEl.focus();
      if (errorEl.scrollIntoView) {
        errorEl.scrollIntoView(true);
      }
    }

    form.onsubmit = function (e) {
      if (e && e.preventDefault) e.preventDefault();
      addClass(errorEl, "is-hidden");

      var data = {
        evaluador: trimStr(document.getElementById("f-evaluador").value),
        responsable: trimStr(document.getElementById("f-responsable").value),
        rol: trimStr(document.getElementById("f-rol").value),
        empresa: trimStr(document.getElementById("f-empresa").value),
        colaboradores: document.getElementById("f-colaboradores").value,
        sector: sectorSel.value,
        sectorOtro: trimStr(document.getElementById("f-sector-otro").value),
        fuentes: getCheckedValues("fuentes"),
        fuenteOtro: trimStr(document.getElementById("f-fuente-otro").value),
        integracion: getRadioValue("integracion"),
        frecuencia: getRadioValue("frecuencia"),
        confianza: getRadioValue("confianza"),
        tiempoReporte: getRadioValue("tiempo_reporte"),
        herramienta: getRadioValue("herramienta"),
        obstaculos: getCheckedValues("obstaculos").slice(0, MAX_OBSTACLES),
        prioridad: prioSel.value,
        prioridadOtro: trimStr(document.getElementById("f-prioridad-otro").value),
        valorEsperado: getRadioValue("valor_esperado"),
        observaciones: trimStr(document.getElementById("f-observaciones").value)
      };

      if (!data.responsable) {
        showError("Por favor, ingrese el nombre del referente de la organización.");
        return false;
      }
      if (!data.empresa) {
        showError("Por favor, ingrese el nombre de la empresa u organización.");
        return false;
      }
      if (data.sector === "Otro" && !data.sectorOtro) {
        showError("Por favor, especifique el sector o actividad principal.");
        return false;
      }
      if (data.fuentes.length === 0) {
        showError("Debe seleccionar al menos una fuente de almacenamiento de datos.");
        return false;
      }
      if (hasValue(data.fuentes, "other") && !data.fuenteOtro) {
        showError("Por favor, especifique el otro medio de almacenamiento.");
        return false;
      }
      if (data.prioridad === "Otro" && !data.prioridadOtro) {
        showError("Por favor, especifique el área o proceso prioritario.");
        return false;
      }

      var diag = evaluarDiagnostico(data);
      var fuentesLabels = [];
      for (var i = 0; i < data.fuentes.length; i++) {
        fuentesLabels.push(STORAGE_LABELS[data.fuentes[i]] || data.fuentes[i]);
      }

      var persisted = saveDiagnosticLocally({
        id: new Date().getTime(),
        created_at: formatDateYMD(new Date()),
        empresa: data.empresa,
        responsable_nombre: data.responsable,
        responsable_rol: data.rol,
        sector: data.sector,
        almacenamiento_fuentes: fuentesLabels,
        score_global: diag.scoreGlobal,
        nivel_madurez: diag.nivel
      });

      refreshClearButton();
      renderReport(data, diag, persisted);
      return false;
    };

    /* Botones de Caso Modelo */
    var btnPrintModelo = document.getElementById("btn-print-modelo");
    if (btnPrintModelo) {
      btnPrintModelo.onclick = function () {
        window.print();
      };
    }

    var btnDownloadModelo = document.getElementById("btn-download-modelo");
    if (btnDownloadModelo) {
      btnDownloadModelo.onclick = function () {
        var txt = [
          "DIAGNÓSTICO MODELO Y PROPUESTA DE IMPLEMENTACIÓN BI",
          "I+S DATA SOLUTIONS — Information + Solutions",
          "========================================================================",
          "Empresa: Distribuidora Cuyo Express S.A.",
          "Referente: Valeria Gómez (Directora de Operaciones)",
          "Sector: Comercio mayorista / minorista · 51 a 200 colaboradores",
          "Score Global: 65.8 / 100 pts — Nivel 2: Operativo / Estructurado",
          "",
          "Dimensiones: Almacenamiento 75%, Integración 50%, Frecuencia 75%, Calidad 65%, Eficiencia 70%",
          "Propuesta (6 semanas / 4 fases): Pipeline automatizado desde ERP Tango + Tablero Ejecutivo de Stock y Compras.",
          "========================================================================",
          "I+S DATA SOLUTIONS — " + COMPANY_ADDRESS
        ].join("\n");
        downloadTextFile("diagnostico_y_propuesta_modelo_is_data_solutions.txt", txt);
      };
    }

    syncOtherFields();
    syncObstaclesLimit();
    refreshClearButton();
  }

  /* Arranque seguro compatible con IE11 / FF 52+ / Chrome 49+ */
  if (document.readyState === "loading" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function () {
      initNavigation();
      initForm();
    }, false);
  } else {
    initNavigation();
    initForm();
  }
})();
