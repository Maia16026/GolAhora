using GolAhora.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace GolAhora.Factory
{
    public abstract class FabricaDeUsuarios
    {
        public const int administrador = 1;
        public const int cliente = 2;
        public const int entrenador = 3;
        public const int profesor = 4;
        public const int defecto = 5;

        public static Usuario crearUsuarioPreseteado()
        {
            return crearUsuario(defecto);
        }

        //uso el ? en string porque me tira advertencia de nulleable
        public static Usuario crearUsuario(int queUsuario, string? especialidad = null, int antiguedad = 0)
        {
            FabricaDeUsuarios fabrica = null;

            switch (queUsuario)
            {
                case administrador:
                    fabrica = new FabricaDeAdministrador();
                    break;
                case cliente:
                    fabrica = new FabricaDeCliente();
                    break;
                case entrenador:
                case profesor:
                    fabrica = new FabricaDeInstructor(queUsuario, especialidad, antiguedad);
                    break;
            }
            return fabrica.crearUsuario();
        }

        public abstract Usuario crearUsuario();
    }
}
