import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton/BackButton';
import SectionButton from '../../components/SectionButton/SectionButton';
import Input from '../../components/Input/Input';
import { sectionButtonsByRole } from "../../data/rolesData.js";
import FormButton from '../../components/FormsButton/FormButton.jsx';
import Styles from './Form.module.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = 'https://localhost:7169';

export default function FormularioPaciente({ type }) {
  const { registroId } = useParams();        // parámetro de la URL (cédula/registroId)
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);

  // Campos
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Errores
  const [errors, setErrors] = useState({
    nombre: '',
    cedula: '',
    direccion: '',
    telefono: '',
    email: '',
    password: ''
  });

  // Cargar paciente si es edición
  useEffect(() => {
    if (type === 'editar' && registroId) {
      fetch(`${API_BASE}/api/Pacientes/buscar/${registroId}`)
        .then(r => {
          if (!r.ok) throw new Error('Paciente no encontrado');
          return r.json();
        })
        .then(data => {
          setPaciente(data);
          setNombre(data.nombre || '');
            setCedula(data.registroId || '');
          setDireccion(data.direccion || '');
          setTelefono(data.telefono || '');
          setEmail(data.email || '');
          // password: no se rellena (el backend no lo expone)
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo cargar el paciente.', 'error');
        });
    }
  }, [type, registroId]); // *** CAMBIO: añadí 'type'

  // Validaciones
  const validarTelefono = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return 'Entre 7 y 15 dígitos';
    return '';
  };
  const validarEmail = (value) => {
    if (!value) return '';
    const emailV = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailV.test(value) ? '' : 'Formato email inválido';
  };
  const validarDireccion = (value) => {
    if (!value) return '';
    return /^[a-zA-Z0-9\s,.#-]+$/.test(value) ? '' : 'La dirección debe ser alfanumérica';
  };
  const validarPassword = (value) => {
    if (!value || value.length < 8) return 'Faltan 8 caracteres';
    if (!/[A-Z]/.test(value)) return 'Falta una letra mayúscula';
    if (!/[a-z]/.test(value)) return 'Falta una letra minúscula';
    if (!/[0-9]/.test(value)) return 'Falta un número';
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(value)) return 'Falta un carácter especial';
    return '';
  };

  // Handlers
  const handleNombreChange = (e) => {
    const v = e.target.value;
    setNombre(v);
    setErrors(prev => ({ ...prev, nombre: v ? '' : 'El nombre es requerido' }));
  };

  const handleCedulaChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    if (value.length > 11) return;
    setCedula(value);
    setErrors(prev => ({ ...prev, cedula: value ? '' : 'La cédula es requerida' }));
  };

  const handleDireccionChange = (e) => {
    const v = e.target.value;
    setDireccion(v);
    setErrors(prev => ({ ...prev, direccion: v ? validarDireccion(v) : 'La dirección es requerida' }));
  };

  const handleTelefonoChange = (e) => {
    const raw = e.target.value;
    setTelefono(raw);
    const digits = raw.replace(/\D/g, '');
    setErrors(prev => ({ ...prev, telefono: digits ? validarTelefono(digits) : 'El teléfono es requerido' }));
  };

  const handleEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    setErrors(prev => ({ ...prev, email: v ? validarEmail(v) : 'El email es requerido' }));
  };

  const handlePasswordChange = (e) => {
    const v = e.target.value;
    setPassword(v);
    setErrors(prev => ({ ...prev, password: validarPassword(v) }));
  };

  // Submit
  const handleSubmit = async () => {
    if (type === 'editar' && !paciente) {
      Swal.fire('Cargando', 'Espere mientras se carga el paciente', 'info');
      return;
    }

    // Validar campos
    const newErrors = {
      nombre: nombre.trim() ? '' : 'El nombre es requerido',
      cedula: cedula.trim()
        ? (/^\d+$/.test(cedula) ? '' : 'Solo números')
        : 'La cédula es requerida',
      direccion: direccion.trim() ? validarDireccion(direccion) : 'La dirección es requerida',
      telefono: telefono.trim() ? validarTelefono(telefono) : 'El teléfono es requerido',
      email: email.trim() ? validarEmail(email) : 'El email es requerido',
      password: type === 'añadir'
        ? (password.trim() ? validarPassword(password) : 'Contraseña requerida')
        : ''
    };

    setErrors(newErrors);
    const hayErrores = Object.values(newErrors).some(e => e);
    if (hayErrores) return;

    // Construir payload
    const payload = {
      nombre,
      direccion,
      telefono,
      email,
      registroId: cedula
    };

    if (type === 'añadir') {
      // Sólo en creación incluir password si realmente lo gestionas aquí
      payload.password = password;
    } else {
      if (!paciente?.id) {
        Swal.fire('Error', 'Paciente sin ID cargado.', 'error');
        return;
      }
      payload.id = paciente.id;
    }

    const url = type === 'añadir'
      ? `${API_BASE}/api/Pacientes`
      : `${API_BASE}/api/Pacientes/${paciente.id}`; // *** CAMBIO (antes faltaba /Pacientes)

    const method = type === 'añadir' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: `Paciente ${type === 'añadir' ? 'añadido' : 'actualizado'}`,
          confirmButtonText: 'Listo',
          customClass: {
            popup: 'my-swal-popup',
            title: 'my-swal-title',
            confirmButton: 'my-swal-confirm-button',
            htmlContainer: 'my-swal-text'
          }
        });
        navigate('/administracion');
      } else {
        let msg = 'Error al guardar.';
        try {
          const errTxt = await res.text();
          msg = errTxt || msg;
        } catch {}
        throw new Error(msg);
      }
    } catch (err) {
      let parsedError = 'Ocurrió un error inesperado';
      try {
        const errJson = JSON.parse(err.message);
        if (errJson?.message?.includes('Ya existe un paciente')) {
          parsedError = 'Ya existe un paciente con esta cédula.';
        } else if (errJson?.errors) {
          parsedError = Object.values(errJson.errors).flat().join(' - ');
        } else if (errJson?.message) {
          parsedError = errJson.message;
        }
      } catch {
        if (err.message) parsedError = err.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar paciente',
        text: parsedError,
        confirmButtonText: 'Listo',
        customClass: {
          popup: 'my-swal-popup',
          title: 'my-swal-title',
          confirmButton: 'my-swal-confirm-button',
          htmlContainer: 'my-swal-text'
        }
      });
    }
  };

  const adminButtons = sectionButtonsByRole["Administrador"] || [];

  return (
    <div className={Styles["formulario-paciente"]}>
      <BackButton route="/administracion" />
      {adminButtons[0] && (
        <SectionButton
          label={adminButtons[0].label}
          image={adminButtons[0].img}
          subtitle={`${type === 'añadir' ? 'Añadir' : 'Editar'} paciente`}
        />
      )}

      <div className={Styles["form-container"]}>
        <Input nameTag="Nombre *" value={nombre} onChange={handleNombreChange} type="text" errorMessage={errors.nombre} />
        <Input nameTag="Cédula *" value={cedula} onChange={handleCedulaChange} type="text" errorMessage={errors.cedula} />
        <Input nameTag="Dirección *" value={direccion} onChange={handleDireccionChange} type="text" errorMessage={errors.direccion} />
        <Input nameTag="Teléfono *" value={telefono} onChange={handleTelefonoChange} type="text" errorMessage={errors.telefono} />
        <Input nameTag="Email *" value={email} onChange={handleEmailChange} type="email" errorMessage={errors.email} />

        {type === 'añadir' && (
          <Input
            nameTag="Contraseña *"
            value={password}
            onChange={handlePasswordChange}
            type="password"
            errorMessage={errors.password}
          />
        )}

        <FormButton
          text={type === 'añadir' ? 'Añadir' : 'Editar'}
          onClick={handleSubmit}
          type="button"
        />
      </div>
    </div>
  );
}