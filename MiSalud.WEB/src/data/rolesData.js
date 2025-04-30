import AdminImg from '../img/Admin.png';
import AgendaImg from '../img/Agenda.png';
import FormulasImg from '../img/Formula.png';
import HistorialImg from '../img/Historial.png';

export const sectionButtonsByRole = {
  administrador: [
    { type: 'administracion', label: 'Administración', img: AdminImg },
    { type: 'agenda', label: 'Agenda', img: AgendaImg },
    { type: 'formulas', label: 'Fórmulas', img: FormulasImg },
    { type: 'historial', label: 'Historial Clínico', img: HistorialImg },
  ],
  medico: [
    { type: 'agenda', label: 'Agenda', img: AgendaImg },
    { type: 'formulas', label: 'Fórmulas', img: FormulasImg },
    { type: 'historial', label: 'Historial Clínico', img: HistorialImg },
  ],
  paciente: [
    { type: 'agenda', label: 'Agenda', img: AgendaImg },
    { type: 'formulas', label: 'Fórmulas', img: FormulasImg },
    { type: 'historial', label: 'Historial Clínico', img: HistorialImg },
  ],
  secretaria: [
    { type: 'agenda', label: 'Agenda', img: AgendaImg },
    { type: 'formulas', label: 'Fórmulas', img: FormulasImg },
  ]
};
