import React, { useState } from 'react';
import BackButton from '../../components/BackButton/BackButton';
import SectionButton from '../../components/SectionButton/SectionButton';
import Input from '../../components/Input/Input';
import { sectionButtonsByRole } from "../../data/rolesData.js";
import FormButton from '../../components/FormsButton/FormButton.jsx';
import Styles from './Form.module.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function FormularioPaciente({type, paciente}) {
  const [nombre, setNombre] = useState(paciente ?paciente.nombre:'');
  const [cedula, setCedula] = useState(paciente ?paciente.registroId:'');
  const [direccion, setDireccion] = useState(paciente ?paciente.direccion:'');
  const [telefono, setTelefono] = useState(paciente ?paciente.telefono:'');
  const [email, setEmail] = useState(paciente ?paciente.email:'');
  const [password, setPassword] = useState('');

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
  const validarPassword = (value) => {
    if (!value || value.length < 8) {
      return 'Al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Al menos una letra mayúscula';
    }
    if (!/[a-z]/.test(value)) {
      return 'Al menos una letra minúscula';
    }
    if (!/[0-9]/.test(value)) {
      return 'Al menos un número';
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(value)) {
      return 'Al menos un carácter especial';
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
  };  const navigate = useNavigate();


  const handleSubmit = async () => {
    const newErrors = {
      nombre: nombre || paciente ? '' : 'El nombre es requerido',
      cedula: cedula || paciente
        ? /^\d+$/.test(cedula)
          ? ''
          : 'Solo se permiten números'
        : 'La cédula es requerida',
      direccion: direccion || paciente ? validarDireccion(direccion) : 'La dirección es requerida',
      telefono: telefono || paciente ? validarTelefono(telefono) : 'El teléfono es requerido',
      email: email || paciente? validarEmail(email) : 'El email es requerido',
      password:
        type === 'añadir'
          ? password
            ? validarPassword(password)
            : 'La contraseña es requerida'
          : ''
    };
  
    setErrors(newErrors);
    const hayErrores = Object.values(newErrors).some(error => error !== '');
    if (hayErrores) return;
    let data;
   if(type==="añadir"){
      data = {
      nombre,
      direccion,
      telefono,
      email,
      registroId: cedula,
      password: password || paciente?.password, // Siempre se envía
      ...(type === 'editar' && { id: paciente?.id })
    };}else{
      data={
        nombre: paciente.nombre,
        direccion: paciente.direccion,
        telefono: paciente.telefono,
        email: paciente.email,
        registroId: paciente.registroId,
        password: paciente.password,
        ...(type === 'editar' && { id: paciente?.id })
      }
    }
  
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
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    } catch (error) {
      let parsedError = 'Ocurrió un error inesperado';
      try {
        const errJson = JSON.parse(error.message);
        if (errJson?.errors) {
          parsedError = Object.values(errJson.errors).flat().join(' - ');
        }
      } catch (_) {}
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
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
        <Input nameTag="Nombre" value={nombre} onChange={handleNombreChange} type="text" errorMessage={errors.nombre} />
        <Input nameTag="Cedula" value={cedula} onChange={handleCedulaChange} type="text" errorMessage={errors.cedula} />
        <Input nameTag="Direccion" value={direccion} onChange={handleDireccionChange} type="text" errorMessage={errors.direccion} />
        <Input nameTag="Telefono" value={telefono} onChange={handleTelefonoChange} type="text" errorMessage={errors.telefono} />
        <Input nameTag="Email" value={email} onChange={handleEmailChange} type="email" errorMessage={errors.email} />

        {type === 'añadir' && (
          <Input nameTag="Password" value={password} onChange={handlePasswordChange} type="password" errorMessage={errors.password} />
        )}

        <FormButton text={type === 'añadir' ? 'Añadir' : 'Editar'} onClick={handleSubmit} type="button" />
      </div>
    </div>
  );
}


//   const handleSubmit = () => {
//     const newErrors = {
//       nombre: nombre ? '' : 'El nombre es requerido',
//       cedula: cedula ? '' : 'La cédula es requerida',
//       direccion: direccion ? '' : 'La dirección es requerida',
//       telefono: telefono ? '' : 'El teléfono es requerido',
//       email: email ? '' : 'El email es requerido',
//       password: password ? '' : 'La contraseña es requerida'
//     };

//     setErrors(newErrors);

//     const hayErrores = Object.values(newErrors).some(error => error !== '');
    
//     if (!hayErrores) {
//       console.log('Formulario enviado correctamente', {
//         nombre, cedula, direccion, telefono, email
//       });
//       // Aquí iría la lógica para enviar los datos
//       alert('Paciente añadido con éxito');
//     }
//   };

//   //    {Styles[""]}
//   return (
//     <div className= {Styles["formulario-paciente"]}>
//         <BackButton />
//         <SectionButton
//             label={btn[0].label} 
//             image={btn[0].img} 
//         />

//         <div className= {Styles["form-container"]}>
//           <Input 
//             nameTag="Nombre" 
//             value={nombre} 
//             onChange={handleNombreChange} 
//             type={"text"}
//             errorMessage={errors.nombre!=="" && errors.nombre}
//           />
//           {//errors.nombre && <p className={Styles["error"]}>{errors.nombre}</p>
//           }

//           <Input 
//             nameTag="Cedula" 
//             value={cedula} 
//             onChange={handleCedulaChange} 
//             type={"text"}
//             errorMessage={errors.cedula!=="" && errors.cedula}
//           />
//           {//errors.cedula && <p className={Styles["error"]}>{errors.cedula}</p>
//           }

//           <Input 
//             nameTag="Direccion" 
//             value={direccion} 
//             onChange={handleDireccionChange} 
//             type={"text"}
//             errorMessage={errors.direccion!=="" && errors.direccion}
//           />
//           {//errors.direccion && <p className={Styles["error"]}>{errors.direccion}</p>
//           }

//           <Input 
//             nameTag="Telefono" 
//             value={telefono} 
//             onChange={handleTelefonoChange} 
//             type={"text"}
//             errorMessage={errors.telefono!=="" && errors.telefono}
//           />
//           {//errors.telefono && <p className={Styles["error"]}>{errors.telefono}</p>
//           }

//           <Input 
//             nameTag="Email" 
//             value={email} 
//             onChange={handleEmailChange} 
//             type={"email"}
//             errorMessage={errors.email!=="" && errors.email}
//           />
//           {//errors.email && <p className={Styles["error"]}>{errors.email}</p>
//           }
//           <Input 
//             nameTag="Password" 
//             value={password} 
//             onChange={handlePasswordChange} 
//             type={"password"}
//             errorMessage={errors.password!=="" && errors.password}
//           />
          
//           <FormButton text={"Añadir"} onClick={handleSubmit}  type = "button"/>

          
//         </div>
//       </div>
//   );
// }