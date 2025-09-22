import { useEffect, useMemo, useState } from "react";
import styles from "./AppointmentFormModal.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "https://localhost:7169";

const STEPS = {
  FORM: "FORM",
  PREVIEW: "PREVIEW",
  CREATING: "CREATING"
};

export default function AppointmentFormModal({
  open,
  onClose,
  onCreated,
  pacienteId,
  apiBaseUrl = API_BASE
}) {
  const [step, setStep] = useState(STEPS.FORM);

  // Campos de formulario
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidad, setEspecialidad] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [medicoId, setMedicoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  // Estados auxiliares
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [loadingMedicos, setLoadingMedicos] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Para invalidar preview si algo cambia
  useEffect(() => {
    setPreviewData(null);
    if (step === STEPS.PREVIEW) setStep(STEPS.FORM);
  }, [especialidad, medicoId, fecha, hora, motivo]); // eslint-disable-line

  // Al abrir: reset
  useEffect(() => {
    if (open) {
      resetAll();
      fetchEspecialidades();
    }
  }, [open]);

  // Cargar médicos cuando cambia especialidad
  useEffect(() => {
    if (!especialidad) {
      setMedicos([]);
      setMedicoId("");
      return;
    }
    fetchMedicos(especialidad);
  }, [especialidad]);

  // Cargar horarios cuando hay medico y fecha elegidos
  useEffect(() => {
    if (!medicoId || !fecha) {
      setHorarios([]);
      setHora("");
      return;
    }
    fetchDisponibilidad(medicoId, fecha);
  }, [medicoId, fecha]);

  // Filtrar horarios para fecha hoy con +30 min
  const horariosFiltrados = useMemo(() => {
    if (!fecha || horarios.length === 0) return [];
    const now = new Date();
    const selectedDate = new Date(`${fecha}T00:00:00`);
    const threshold = new Date(now.getTime() + 30 * 60000); // +30 min
    return horarios.filter(h => {
      if (!/^\d{2}:\d{2}$/.test(h)) return false;
      if (selectedDate.toDateString() !== now.toDateString()) return true;
      // comparar hora
      const [hh, mm] = h.split(":").map(Number);
      const slotDate = new Date(selectedDate);
      slotDate.setHours(hh, mm, 0, 0);
      return slotDate.getTime() >= threshold.getTime();
    });
  }, [horarios, fecha]);

  const formValid = pacienteId &&
    especialidad &&
    medicoId &&
    fecha &&
    hora &&
    motivo.trim().length > 0;

  function resetAll() {
    setStep(STEPS.FORM);
    setEspecialidades([]);
    setEspecialidad("");
    setMedicos([]);
    setMedicoId("");
    setFecha("");
    setHorarios([]);
    setHora("");
    setMotivo("");
    setPreviewData(null);
    setErrorMsg("");
    setSubmitting(false);
  }

  function close() {
    resetAll();
    onClose && onClose();
  }

  async function fetchEspecialidades() {
    setLoadingEspecialidades(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/Citas/especialidades`, {
        headers: {
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Error cargando especialidades.");
      const data = await res.json();
      setEspecialidades(data);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoadingEspecialidades(false);
    }
  }

  async function fetchMedicos(especialidadSel) {
    setLoadingMedicos(true);
    setErrorMsg("");
    setMedicoId("");
    setMedicos([]);
    try {
      const token = localStorage.getItem("token");
      const url = `${apiBaseUrl}/api/Citas/medicos?especialidad=${encodeURIComponent(especialidadSel)}`;
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Error cargando médicos.");
      const data = await res.json();
      setMedicos(data);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoadingMedicos(false);
    }
  }

  async function fetchDisponibilidad(medico, fechaSel) {
    setLoadingHorarios(true);
    setErrorMsg("");
    setHora("");
    setHorarios([]);
    try {
      const token = localStorage.getItem("token");
      const url = `${apiBaseUrl}/api/Citas/disponibilidad?medicoId=${medico}&fecha=${fechaSel}`;
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Error cargando disponibilidad.");
      const data = await res.json();
      setHorarios(Array.isArray(data) ? data : []);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoadingHorarios(false);
    }
  }

  async function handlePreview(e) {
    e.preventDefault();
    if (!formValid) {
      setErrorMsg("Complete todos los campos.");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const body = {
        pacienteId,
        medicoId: Number(medicoId),
        fecha,         // preview espera "YYYY-MM-DD"
        hora,          // "HH:mm"
        motivo: motivo.trim()
      };
      const res = await fetch(`${apiBaseUrl}/api/Citas/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });
      const data = await safeJson(res);
      if (!res.ok) {
        throw new Error(data?.mensaje || "No se pudo validar la cita.");
      }
      if (!data.disponible) {
        setErrorMsg(data.mensaje || "Horario no disponible.");
        return;
      }
      setPreviewData(data);
      setStep(STEPS.PREVIEW);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

async function handleCreate() {
  if (!previewData) return;
  setSubmitting(true);
  setStep(STEPS.CREATING);
  setErrorMsg("");
  try {
    const token = localStorage.getItem("token");
    const payload = {
      pacienteId,
      medicoId: Number(medicoId),
      fecha: `${fecha}T00:00:00`,
      hora: hora.length === 5 ? `${hora}:00` : hora,
      motivo: motivo.trim()
    };
    const res = await fetch(`${apiBaseUrl}/api/Citas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const data = await safeJson(res);
    if (res.status === 201) {
      // Añadimos el nombre del médico desde la preview
      const citaConNombre = {
        ...data,
        medicoNombre: previewData.medicoNombre
      };
      onCreated && onCreated(citaConNombre);
      setTimeout(() => {
        close();
      }, 900);
    } else if (res.status === 409) {
      setErrorMsg(data?.message || "Ese turno acaba de ocuparse.");
      setStep(STEPS.FORM);
    } else if (res.status === 400) {
      setErrorMsg(data?.message || "Error de validación.");
      setStep(STEPS.FORM);
    } else {
      setErrorMsg(data?.message || `Error (${res.status}).`);
      setStep(STEPS.FORM);
    }
  } catch (err) {
    setErrorMsg(err.message);
    setStep(STEPS.FORM);
  } finally {
    setSubmitting(false);
  }
}

  const minDate = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  }, []);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>
            {step === STEPS.FORM && "Nueva Cita"}
            {step === STEPS.PREVIEW && "Confirmar Cita"}
            {step === STEPS.CREATING && "Registrando Cita"}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={close}
            aria-label="Cerrar"
            disabled={submitting}
          >
            ×
          </button>
        </header>

        {step === STEPS.FORM && (
          <form onSubmit={handlePreview} className={styles.form}>
            <fieldset className={styles.fieldset} disabled={submitting}>
              <div className={styles.fieldRow}>
                <label>Especialidad</label>
                <div className={styles.inline}>
                  <select
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                  >
                    <option value="">-- Seleccione --</option>
                    {especialidades.map(es => (
                      <option key={es} value={es}>{es}</option>
                    ))}
                  </select>
                  {loadingEspecialidades && <span className={styles.loaderSm} />}
                </div>
              </div>

              <div className={styles.fieldRow}>
                <label>Médico</label>
                <div className={styles.inline}>
                  <select
                    value={medicoId}
                    onChange={(e) => setMedicoId(e.target.value)}
                    disabled={!especialidad || loadingMedicos}
                  >
                    <option value="">-- Seleccione --</option>
                    {medicos.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} ({m.especialidad})
                      </option>
                    ))}
                  </select>
                  {loadingMedicos && <span className={styles.loaderSm} />}
                </div>
              </div>

              <div className={styles.fieldRow}>
                <label>Fecha</label>
                <input
                  type="date"
                  min={minDate}
                  value={fecha}
                  disabled={!medicoId}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>

              <div className={styles.fieldRow}>
                <label>Horario</label>
                <div className={styles.inline}>
                  <select
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    disabled={!fecha || !medicoId || loadingHorarios}
                  >
                    <option value="">
                      {fecha
                        ? (horariosFiltrados.length
                          ? "-- Seleccione --"
                          : (loadingHorarios ? "Cargando..." : "Sin horarios"))
                        : "-- Seleccione fecha --"}
                    </option>
                    {horariosFiltrados.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  {loadingHorarios && <span className={styles.loaderSm} />}
                </div>
                {fecha && horarios.length > 0 && horariosFiltrados.length === 0 && (
                  <p className={styles.note}>
                    No hay horarios ≥ 30 min desde ahora. Elige otra fecha.
                  </p>
                )}
              </div>

              <div className={styles.fieldRow}>
                <label>Motivo</label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                  placeholder="Describe brevemente el motivo de la consulta"
                />
              </div>

              <div className={styles.fieldRow}>
                <label>Paciente ID</label>
                <input
                  type="text"
                  value={pacienteId}
                  disabled
                  className={styles.readonly}
                />
              </div>
            </fieldset>

            {errorMsg && <div className={styles.error}>{errorMsg}</div>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={close}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={!formValid || submitting}
              >
                {submitting ? "Validando..." : "Continuar"}
              </button>
            </div>
          </form>
        )}

        {step === STEPS.PREVIEW && previewData && (
          <div className={styles.previewContainer}>
            <div className={styles.previewBlock}>
              <h3>Resumen de la Cita</h3>
              <ul className={styles.summaryList}>
                <li><strong>Especialidad:</strong> {previewData.especialidad}</li>
                <li><strong>Médico:</strong> {previewData.medicoNombre} (ID {previewData.medicoId})</li>
                <li><strong>Fecha:</strong> {previewData.fecha}</li>
                <li><strong>Hora:</strong> {previewData.hora}</li>
                <li><strong>Motivo:</strong> {previewData.motivo}</li>
              </ul>
              <p className={styles.confirmNote}>
                Verifica que los datos sean correctos antes de confirmar.
              </p>
            </div>

            {errorMsg && <div className={styles.error}>{errorMsg}</div>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setStep(STEPS.FORM)}
                disabled={submitting}
              >
                Atrás
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleCreate}
                disabled={submitting}
              >
                {submitting ? "Creando..." : "Confirmar"}
              </button>
            </div>
          </div>
        )}

        {step === STEPS.CREATING && (
          <div className={styles.creatingBox}>
            <div className={styles.spinnerLg} />
            <p>Registrando cita...</p>
            {errorMsg && <div className={styles.error} style={{ marginTop: "1rem" }}>{errorMsg}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}