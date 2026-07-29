using GolAhora.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace GolAhora.Factory
{
    internal class FabricaDeAdministrador: FabricaDeUsuarios
    {
        override public Usuario crearUsuario()
        {
            return new Administrador();
        }

    }
}
