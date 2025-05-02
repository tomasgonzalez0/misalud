import BackButton from "../../components/BackButton/BackButton";
import SectionButton from "../../components/SectionButton/SectionButton.jsx";
import { sectionButtonsByRole } from "../../data/rolesData.js";
import Styles from "./Administracion.module.css";
import OptionButton from "../../components/OptionButton/OptionButton.jsx";
import Input from "../../components/Input/Input.jsx";
import { useState } from "react";
import Swal from 'sweetalert2';
import { Navigate, useNavigate } from "react-router-dom";
import 'sweetalert2/dist/sweetalert2.min.css';
import InformationBlock from "../../components/InformationBlock/InformationBlock.jsx";

export default function Administracion() {
    const btn = sectionButtonsByRole["administrador"] || []; 
    return(
        <section className={Styles["Administracion"]}>
            <BackButton route="/"/>
            <SectionButton
                label={btn[0].label} 
                image={btn[0].img} 
            />
            <AdministracionMenu />
        </section>
    );
}

function AdministracionMenu() {
    const [cedula, setCedula] = useState("");
    const [paciente, setPaciente] = useState(null);
    const navigate = useNavigate();
  
    const handleBuscarPaciente = async () => {
        if (!cedula) {
            Swal.fire({
                icon: 'info',
                title: 'Ocurrió un error',
                text: 'Primero ingrese la cédula de un paciente',
                confirmButtonText: 'Listo',
                customClass: {
                  popup: 'my-swal-popup',
                  title: 'my-swal-title',
                  confirmButton: 'my-swal-confirm-button',
                  htmlContainer: 'my-swal-text'
                }
              });
          return;
        }
      
        try {
          const res = await fetch(`https://localhost:7169/api/Pacientes/buscar/${cedula}`);
          if (!res.ok) throw new Error("Paciente no encontrado");
          const data = await res.json();
          console.log(data);// RECORDAR ELIMINAR LOS CONSOLE.LOG
          if(res.ok) setPaciente(data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error',
                text: 'Paciente no encontrado',
                confirmButtonText: 'Listo',
                customClass: {
                  popup: 'my-swal-popup',
                  title: 'my-swal-title',
                  confirmButton: 'my-swal-confirm-button',
                  htmlContainer: 'my-swal-text'
                }
              })
          console.error("Error al buscar paciente:", error.message);
        }
      };
      
    
    if(paciente===null)return (
      <div className={Styles["AdministracionMenu"]}>
        <Input
          nameTag={"CC"}
          value={cedula}
          onChange={(e) => {
            const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
            setCedula(soloNumeros);
          }}
        />
        <OptionButton text="Buscar paciente" onClick={handleBuscarPaciente} />
        <OptionButton text="Añadir paciente" onClick={() => navigate("/formulario")} />
      </div>
    );

    return(
      <div className={Styles["AdministracionMenu"]}>
          <InformationBlock
            title="Información" 
            text={
              [paciente.nombre,
              paciente.registroId,
              paciente.direccion,
              paciente.telefono,
              paciente.email]}
              />
          <OptionButton text="Editar información." onClick={() => {}} />
      </div>
    );
  }