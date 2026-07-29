using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GolAhora.Usuarios
{
    public class Usuario
    {
        private int dni;   
        private string nombre; 
        private string apellido;
        private Direccion direccion;
        private int telefono;
        private string mail;
        private string contrasena;

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Dni
        {
            get { return dni; } 
            set { dni = value; }
        }

        [Required(ErrorMessage = "El nombre es obligatorio")] // segunda validacion de seguridad
        public string? Nombre
        {
            get { return nombre; }
            set { nombre = value; }
        }

        [Required (ErrorMessage = "El apellido es obligatorio")]
        public string? Apellido
        {
            get { return apellido; }
            set { apellido = value; }
        }

        public Direccion direccion_
        {
            get { return direccion; }
            set { direccion = value; }
        }

        public int Telefono
        {
            get { return telefono; }
            set { telefono = value; }

        }

        [Required(ErrorMessage = "El mail es obligatorio")]
        public string? Mail
        {
            get { return mail; }
            set { mail = value; }
        }
        
        [Required (ErrorMessage = "La contraseña es obligatoria")]
        public string? Contrasena
        {
            get { return contrasena; }
            set { contrasena = value; }
        }


        public Usuario()
        {

        }
        public Usuario(int dni, string nombre, string apellido, Direccion direccion, int telefono, string mail, string contrasena)
        {
            this.dni = dni;
            this.nombre = nombre;
            this.apellido = apellido;
            this.direccion = direccion;
            this.telefono = telefono;
            this.mail = mail;
            this.contrasena = contrasena;
        }


        public void registrarUsuario()
        {
            
        }

        public void consultarUsuario ()
        {

        }

        public void modificarUsuario()
        {
            
        }

        public void imprimirDatos()
        {
            
        }




    }
}