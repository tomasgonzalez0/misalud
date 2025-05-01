import React, { useState } from 'react';
import BackButton from '../../components/BackButton/BackButton';
import FooterBar from '../../components/FooterBar/FooterBar';
import SectionButton from '../../components/SectionButton/SectionButton';
import Input from '../../components/Input/Input';
import { sectionButtonsByRole } from "../../data/rolesData.js";
import FormButton from '../../components/FormsButton/FormButton.jsx';
import Styles from './Form.module.css';

export default function FormularioPaciente() {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState({
    nombre: '',
    cedula: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const btn = sectionButtonsByRole["administrador"] || []; 

  const validarTelefono = (value) => {
    const telefonoV = /^\d{10}$/;
    if (!telefonoV.test(value) && value !== '') {
      return 'telefono incorrecto';
    }
    return '';
  };

  const validarEmail = (value) => {
    const emailV = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailV.test(value) && value !== '') {
      return 'Formato de correo electrónico inválido';
    }
    return '';
  };

  const validarDireccion = (value) => {
    if (value !== '' && !/^[a-zA-Z0-9\s,.#-]+$/.test(value)) {
      return 'La dirección debe ser alfanumérica';
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


  const handleSubmit = () => {
    const newErrors = {
      nombre: nombre ? '' : 'El nombre es requerido',
      cedula: cedula ? '' : 'La cédula es requerida',
      direccion: validarDireccion(direccion),
      telefono: validarTelefono(telefono),
      email: validarEmail(email)
    };

    setErrors(newErrors);

    const hayErrores = Object.values(newErrors).some(error => error !== '');
    
    if (!hayErrores) {
      console.log('Formulario enviado correctamente', {
        nombre, cedula, direccion, telefono, email
      });
      // Aquí iría la lógica para enviar los datos
      alert('Paciente añadido con éxito');
    }
  };

  //    {Styles[""]}
  return (
    <div className= {Styles["formulario-paciente"]}>
      <div className={Styles["header"]}>
        <BackButton />
      </div>

      <div className={Styles["section-header"]}>
        <SectionButton
            label={btn[0].label} 
            image={btn[0].img} 
        />

        <div className= {Styles["form-container"]}>
          <Input 
            nameTag="Nombre" 
            value={nombre} 
            onChange={handleNombreChange} 
          />
          {errors.nombre && <p className={Styles["error"]}>{errors.nombre}</p>}

          <Input 
            nameTag="Cedula" 
            value={cedula} 
            onChange={handleCedulaChange} 
          />
          {errors.cedula && <p className={Styles["error"]}>{errors.cedula}</p>}

          <Input 
            nameTag="Direccion" 
            value={direccion} 
            onChange={handleDireccionChange} 
          />
          {errors.direccion && <p className={Styles["error"]}>{errors.direccion}</p>}

          <Input 
            nameTag="Telefono" 
            value={telefono} 
            onChange={handleTelefonoChange} 
          />
          {errors.telefono && <p className={Styles["error"]}>{errors.telefono}</p>}

          <Input 
            nameTag="Email" 
            value={email} 
            onChange={handleEmailChange} 
          />
          {errors.email && <p className={Styles["error"]}>{errors.email}</p>}
          
          <div className = {Styles["button"]}>
            <FormButton text={"Añadir"} onClick={handleSubmit}  type = "button"/>
          </div>
          
        </div>
      </div>
      <div className={Styles["footer"]}>
      <FooterBar />
      </div>
    </div>
  );
}