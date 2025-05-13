import AdminImg from '../img/Admin.png';
import AgendaImg from '../img/Agenda.png';
import FormulasImg from '../img/Formula.png';
import HistorialImg from '../img/Historial.png';

export const sectionButtonsByRole = {
  Administrador: [
    { type: 'administracion', label: 'Administración', img: AdminImg, path: '/administracion' },
    { type: 'agenda', label: 'Agenda', img: AgendaImg, path: '/agenda' },
    { type: 'formulas', label: 'Fórmulas', img: FormulasImg, path: '/formulas' },
    { type: 'historial', label: 'Historial Clínico', img: HistorialImg, path: '/historial' },
  ],
  Medico: [
    { type: 'agenda', label: 'Agenda', img: AgendaImg, path: '/agenda' },
    { type: 'formulas', label: 'Fórmulas', img: FormulasImg, path: '/formulas' },
    { type: 'historial', label: 'Historial Clínico', img: HistorialImg, path: '/historial' },
  ],
  Paciente: [
    { type: 'agenda', label: 'Agenda', img: AgendaImg, path: '/agenda' },
    { type: 'formulas', label: 'Fórmulas', img: FormulasImg, path: '/formulas' },
    { type: 'historial', label: 'Historial Clínico', img: HistorialImg, path: '/historial' },
  ],
  Secretaria: [
    { type: 'administracion', label: 'Administración', img: AdminImg, path: '/administracion' },
    { type: 'agenda', label: 'Agenda', img: AgendaImg, path: '/agenda' },
    { type: 'formulas', label: 'Fórmulas', img: FormulasImg, path: '/formulas' },
    
  ]
};
