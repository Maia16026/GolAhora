using System.Collections.Generic;
using System.Linq;

namespace GolAhora.Actividades
{
    public class Liga : Competicion
    {
        // Entity framework
        public List<Fecha> Fechas { get; set; } = new List<Fecha>(); 

        // Tabla de posiciones
        public List<RegistroTabla> Posiciones { get; set; } = new List<RegistroTabla>(); 


        // Constructores
        public Liga() : base() { }

        public Liga(string nombreActividad) : base(nombreActividad) { }

        public int CupoMaximo { get; set; }

        


        // Lógica de negocio
        // 1. EL ALGORITMO DEL FIXTURE (Todos contra Todos)
        public void GenerarFixture()
        {
            if (Equipos == null || Equipos.Count < 2) 
                throw new Exception("Se necesitan al menos 2 equipos para iniciar la liga.");

            // Hacemos una copia de la lista para no alterar la original
            var listaEquipos = Equipos.ToList();

            // Si es IMPAR, agregamos un equipo fantasma llamado "LIBRE"
            bool tieneLibre = listaEquipos.Count % 2 != 0;
            if (tieneLibre)
            {
                listaEquipos.Add(new Equipo { IdEquipo = -1, Nombre = "LIBRE" });
            }

            int numRondas = listaEquipos.Count - 1;
            int mitad = listaEquipos.Count / 2;

            Fechas = new List<Fecha>();

            for (int i = 0; i < numRondas; i++)
            {
                var nuevaFecha = new Fecha { NumeroFecha = i + 1, Partidos = new List<Partido>() };

                for (int j = 0; j < mitad; j++)
                {
                    var local = listaEquipos[j];
                    var visitante = listaEquipos[listaEquipos.Count - 1 - j];

                    // Solo creamos el partido si ninguno de los dos es el equipo "LIBRE"
                    if (local.IdEquipo != -1 && visitante.IdEquipo != -1)
                    {
                        nuevaFecha.Partidos.Add(new Partido 
                        {
                            IdEquipoLocal = local.IdEquipo,
                            IdEquipoVisitante = visitante.IdEquipo,
                            // IdCancha queda nulo automáticamente gracias a nuestro Fix
                            Estado = "Pendiente"
                        });
                    }
                }
                Fechas.Add(nuevaFecha);

                // Rotación del algoritmo: El primer equipo queda fijo, el resto rota un lugar
                var ultimoEquipo = listaEquipos[listaEquipos.Count - 1];
                listaEquipos.RemoveAt(listaEquipos.Count - 1);
                listaEquipos.Insert(1, ultimoEquipo);
            }
        }

        // 2. INICIALIZACIÓN DE LA TABLA
        public void InicializarTabla()
        {
            Posiciones = new List<RegistroTabla>(); 
            
            foreach (var equipo in Equipos)
            {
                // Ignoramos al equipo fantasma "LIBRE" para que no aparezca en la tabla de posiciones
                if (equipo.IdEquipo != -1) 
                {
                    Posiciones.Add(new RegistroTabla 
                    {
                        IdEquipo = equipo.IdEquipo,
                        Puntos = 0,
                        PartidosJugados = 0,
                        PartidosGanados = 0,
                        PartidosEmpatados = 0,
                        PartidosPerdidos = 0,
                        GolesFavor = 0, 
                        GolesContra = 0  
                    });
                }
            }
        }

        public void ProcesarResultado(Partido partido) 
        {
            // Actualiza los puntos, goles a favor y en contra 
            // en los registros de la tabla de posiciones.
        }

        public void OrdenarTabla()
        {
            if (Posiciones != null && Posiciones.Any())
            {
                Posiciones = Posiciones
                    .OrderByDescending(p => p.Puntos)
                    .ThenByDescending(p => p.DiferenciaDeGoles())
                    .ThenByDescending(p => p.GolesFavor)
                    .ToList();
                    
                for (int i = 0; i < Posiciones.Count; i++)
                {
                    Posiciones[i].Posicion = i + 1; // Asigna el Puesto 1, 2, 3...
                }
            }
        }

        public override Equipo ObtenerCampeon() 
        {
            OrdenarTabla();
            return Posiciones.FirstOrDefault()?.EquipoAsociado;
        }
    }
}