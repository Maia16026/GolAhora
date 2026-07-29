using GolAhora.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace GolAhora.Factory
{
    internal class FabricaDeCliente:FabricaDeUsuarios
    {
        override public Usuario crearUsuario()
        {
            return new Cliente();
        }


    }
}
