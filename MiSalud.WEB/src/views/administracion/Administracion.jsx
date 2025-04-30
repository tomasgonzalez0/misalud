import BackButton from "../../components/BackButton/BackButton";
import SectionButton from "../../components/SectionButton/SectionButton.jsx";
import { sectionButtonsByRole } from "../../data/rolesData.js";
import Styles from "./Administracion.module.css";
import OptionButton from "../../components/OptionButton/OptionButton.jsx";
import Input from "../../components/Input/Input.jsx";
import { useState } from "react";
import Swal from 'sweetalert2';

export default function Administracion() {
    const btn = sectionButtonsByRole["administrador"] || []; 
    return(
        <section className={Styles["Administracion"]}>
            <BackButton />
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
  
    const handleBuscarPaciente = async () => {
        if (!cedula) {
          Swal.fire({
            icon: 'info',
            title: 'Ocurrió un error',
            text: 'Primero ingrese la cédula de un paciente',
            confirmButtonText: 'Listo',
          });
          return;
        }
      
        try {
          const res = await fetch(`https://localhost:7169/api/Pacientes/buscar/${cedula}`);
          if (!res.ok) throw new Error("Paciente no encontrado");
          const data = await res.json();
          console.log(data);// RECORDAR ELIMINAR LOS CONSOLE.LOG
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Paciente no encontrado',
            text: 'Verifica que la cédula ingresada sea correcta.',
            confirmButtonText: 'Entendido',
          });
          console.error("Error al buscar paciente:", error.message);
        }
      };
      
  
    return (
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
        <OptionButton text="Añadir paciente" onClick={() => {}} />
      </div>
    );
  }