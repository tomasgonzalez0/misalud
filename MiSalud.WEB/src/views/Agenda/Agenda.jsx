import { useState, useMemo } from "react";
import BackButton from "../../components/BackButton/BackButton";
import NoAppointments from "../../assets/NoAppointments.png";
import styles from "./Agenda.module.css";
import AppointmentFormModal from "../../components/AppointmentFormModal/AppointmentFormModal";

const PACIENTE_ID_DEMO = 2008;

export default function Agenda() {
  const [showForm, setShowForm] = useState(false);
  const [citas, setCitas] = useState([]);

  function handleCreated(cita) {
    setCitas(prev => [...prev, cita]);
  }

  return (
    <article className={styles["agenda-container"]}>
      <BackButton route="/" />
      <AgendaContent
        citas={citas}
        onAddClick={() => setShowForm(true)}
      />
      <AppointmentFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        pacienteId={PACIENTE_ID_DEMO}
        onCreated={handleCreated}
      />
    </article>
  );
}

function AgendaContent({ citas, onAddClick }) {
  const hasCitas = citas.length > 0;
  return (
    <section
      className={
        hasCitas
          ? `${styles["agenda-content"]} ${styles["has-citas"]}`
          : styles["agenda-content"]
      }
    >
      <h1>Agenda</h1>
      {hasCitas ? <CitasList citas={citas} /> : <NoAppointmentsMessage />}

      <AddAppointmentButton onClick={onAddClick} />
    </section>
  );
}

function NoAppointmentsMessage() {
  return (
    <section className={styles["no-appointments-message"]}>
      <img src={NoAppointments} alt="No appointments" />
      <h2>No tienes citas</h2>
      <p>Presiona el botón para agregar</p>
    </section>
  );
}

function CitasList({ citas }) {
  const ordenadas = useMemo(() => {
    return [...citas].sort((a, b) => {
      const aDT = new Date(`${a.fecha}T${(a.hora || "00:00")}`);
      const bDT = new Date(`${b.fecha}T${(b.hora || "00:00")}`);
      return aDT - bDT;
    });
  }, [citas]);

  return (
    <div className={styles["citas-wrapper"]}>
      <div className={styles["citas-list"]} role="list" aria-label="Listado de citas">
        {ordenadas.map(c => (
          <CitaCard key={c.id} cita={c} />
        ))}
      </div>
    </div>
  );
}

function CitaCard({ cita }) {
  const { id, fecha, hora, motivo, estado, medicoId, medicoNombre } = cita;

  const fechaFormateada = (() => {
    if (!fecha) return "";
    try {
      const horaNorm = (hora || "00:00").substring(0, 5);
      const dt = new Date(`${fecha}T${horaNorm}:00`);
      if (isNaN(dt.getTime())) return `${fecha} ${hora}`;
      const formatter = new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      const timeFormatter = new Intl.DateTimeFormat("es-ES", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
      return capitalize(formatter.format(dt)) + " a las " + timeFormatter.format(dt);
    } catch {
      return `${fecha} ${hora}`;
    }
  })();

  return (
    <article className={styles["cita-card"]} role="listitem">
      <div className={styles["cita-main"]}>
        <h3 className={styles["cita-titulo"]}>
          {motivo ? truncate(motivo, 40) : `Cita #${id}`}
        </h3>
        <p className={styles["cita-detalle"]}>
          {fechaFormateada}
          {motivo ? `, ${motivo.toLowerCase()}` : ""}
        </p>
        <div className={styles["cita-meta"]}>
          <span className={styles["tag-medico"]}>
            Dr(a). {medicoNombre || `#${medicoId}`}
          </span>
          <span
            className={`${styles["estado"]} ${
              styles[`estado-${(estado || "programada").toLowerCase()}`]
            }`}
          >
            {estado || "Programada"}
          </span>
        </div>
      </div>
      <div className={styles["cita-actions"]}>
        <button
          type="button"
          className={`${styles["action-btn"]} ${styles["action-delete"]}`}
          disabled
        >
          Eliminar
        </button>
        <button
          type="button"
          className={`${styles["action-btn"]} ${styles["action-outline"]}`}
          disabled
        >
          Reprogramar
        </button>
      </div>
    </article>
  );
}

function AddAppointmentButton({ onClick }) {
  return (
    <div className={styles["button-container"]}>
      <button
        className={styles["add-appointment-button"]}
        onClick={onClick}
        aria-label="Agregar cita"
      >
        +
      </button>
    </div>
  );
}

/* Helpers */
function truncate(str, max) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}
function capitalize(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}