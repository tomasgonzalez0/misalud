import React, { useState } from 'react';
import BackButton from '../../components/BackButton/BackButton';
import SectionButton from '../../components/SectionButton/SectionButton';
import Input from '../../components/Input/Input';
import { sectionButtonsByRole } from "../../data/rolesData.js";
import FormButton from '../../components/FormsButton/FormButton.jsx';
import Styles from './Form.module.css';
import { data, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function FormularioPaciente({type}) {
  const [paciente, setPaciente] = useState(null);
  const { registroId } = useParams();

  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  useEffect(() => {
    if (type === "editar") {
      fetch(`https://localhost:7169/api/Pacientes/buscar/${registroId}`)
        .then(res => res.json())
        .then(data => {
          setPaciente(data);
          setNombre(data.nombre);
          setCedula(data.registroId);
          setDireccion(data.direccion);
          setTelefono(data.telefono);
          setEmail(data.email);
          setPassword(data.password);
        })
        .catch(err => console.error("Error:", err));
    }
  }, [registroId]);
  


  const [errors, setErrors] = useState({
    nombre: '',
    cedula: '',
    direccion: '',
    telefono: '',
    email: '',
    password: ''
  });

  const btn = sectionButtonsByRole["administrador"] || []; 

const validarTelefono = (value) => {
  if (!/^\+?\d{7,15}$/.test(value.replace(/[\s()-]/g, ''))) {
    return 'Entre 7 y 15 dígitos';
  }

  return '';
};


  const validarEmail = (value) => {
    const emailV = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailV.test(value) && value !== '') {
      return ' Formato email inválido';
    }
    return '';
  };

  const validarDireccion = (value) => {
    if (value !== '' && !/^[a-zA-Z0-9\s,.#-]+$/.test(value)) {
      return 'La dirección debe ser alfanumérica';
    }
    return '';
  };
  const validarPassword = (value) => {
    if (!value || value.length < 8) {
      return 'Falta 8 caracteres';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Falta una letra mayúscula';
    }
    if (!/[a-z]/.test(value)) {
      return 'Falta una letra minúscula';
    }
    if (!/[0-9]/.test(value)) {
      return 'Falta un número';
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(value)) {
      return 'Falta un carácter especial';
    }
    return '';
  };
  

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
    setErrors({ ...errors, nombre: e.target.value ? '' : 'El nombre es requerido' });
  };

  const handleCedulaChange = (e) => {
    const value = e.target.value;
  
    if (!/^\d*$/.test(value)) return; 
    if (value.length > 11) return; 
  
    setCedula(value);
  
    setErrors({ 
      ...errors, 
      cedula: value === '' ? 'La cédula es requerida' : '' 
    });
  };
  const handleDireccionChange = (e) => {
    const value = e.target.value;
    setDireccion(value);
    setErrors({ ...errors, direccion: validarDireccion(value) });
  };

  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
    const value = e.target.value.replace(/\D/g, '').slice(0, 10); 
    setErrors({ ...errors, telefono: validarTelefono(value) });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({ ...errors, email: validarEmail(value) });
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors({ ...errors, password: validarPassword(value) });
  }; 
   const navigate = useNavigate();


  const handleSubmit = async () => {
    if (type === "editar" && !paciente) {
      Swal.fire("Cargando", "Espere mientras se carga el paciente", "info");
      return;
    }
    
    const newErrors = {
      nombre: nombre.trim() ? '' : 'El nombre es requerido',
      cedula: cedula.trim()
        ? /^\d+$/.test(cedula)
          ? ''
          : 'Solo se permiten números'
        : 'La cédula es requerida',
      direccion: direccion.trim() ? validarDireccion(direccion) : 'La dirección es requerida',
      telefono: telefono.trim() ? validarTelefono(telefono) : 'El teléfono es requerido',
      email: email.trim() ? validarEmail(email) : 'El email es requerido',
      password:
        type === 'añadir'
          ? password.trim()
            ? validarPassword(password)
            : 'Contraseña requerida'
          : ''
    };
  
    setErrors(newErrors);
    const hayErrores = Object.values(newErrors).some(error => error !== '');
    if (hayErrores) return;
    let data;
      data = {
      nombre,
      direccion,
      telefono,
      email,
      registroId: cedula,
      password: password || paciente?.password,
      ...(type === 'editar' && { id: paciente?.id })
    };
  
    const url =
      type === 'añadir'
        ? 'https://localhost:7169/api/Pacientes'
        : `https://localhost:7169/api/Pacientes/${paciente?.id}`;
  
    const method = type === 'añadir' ? 'POST' : 'PUT';
  
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
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
        const text = await response.text();
        throw new Error(text);
      }
    } catch (error) {
      let parsedError = 'Ocurrió un error inesperado';
    
      try {
        const errJson = JSON.parse(error.message);

        if (errJson?.message?.includes('Ya existe un paciente con ese número de cédula')) {
          parsedError = 'Ya existe un paciente con esta cédula registrada.';
        } else if (errJson?.errors) {
          parsedError = Object.values(errJson.errors).flat().join(' - ');
        }
      } catch (_) {}
    
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
  
  

  return (
    <div className={Styles["formulario-paciente"]}>
      <BackButton route="/administracion" />
      <SectionButton
        label={btn[0].label}
        image={btn[0].img}
        subtitle={`${type === 'añadir' ? 'Añadir' : 'Editar'} paciente`}
      />

      <div className={Styles["form-container"]}>
        <Input nameTag="Nombre *" value={nombre} onChange={handleNombreChange} type="text" errorMessage={errors.nombre} />
        <Input nameTag="Cédula *" value={cedula} onChange={handleCedulaChange} type="text" errorMessage={errors.cedula} />
        <Input nameTag="Dirección *" value={direccion} onChange={handleDireccionChange} type="text" errorMessage={errors.direccion} />
        <Input nameTag="Teléfono *" value={telefono} onChange={handleTelefonoChange} type="text" errorMessage={errors.telefono} />
        <Input nameTag="Email *" value={email} onChange={handleEmailChange} type="email" errorMessage={errors.email} />

        {type === 'añadir' && (
          <Input nameTag="Contraseña *" value={password} onChange={handlePasswordChange} type="password" errorMessage={errors.password} />
        )}

        <FormButton text={type === 'añadir' ? 'Añadir' : 'Editar'} onClick={handleSubmit} type="button" />
      </div>
    </div>
  );
}
