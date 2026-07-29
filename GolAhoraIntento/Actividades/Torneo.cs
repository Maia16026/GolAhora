using System;
using System.Collections.Generic;
using System.Linq;

namespace GolAhora.Actividades
{
    public class Torneo : Competicion
    {
        // entity framework
        // relacion 1 a muchos, 1 torneo tiene muchas llaves
        public List<Partido> Llaves { get; set; } = new List<Partido>(); 


        // constructores

        public Torneo() : base() { }

        public Torneo(string nombreActividad) : base(nombreActividad) { }
        public int CupoMaximo { get; set; }


        // logica de negocio completa y corregida

        public void GenerarLlaves() 
        {
            if (Equipos == null || Equipos.Count < 2) return;

            Llaves.Clear();

            // Emparejamos los equipos de a dos usando las propiedades reales: Local y Visitante
            for (int i = 0; i < Equipos.Count; i += 2)
            {
                if (i + 1 < Equipos.Count)
                {
                    Partido nuevoPartido = new Partido
                    {
                        Local = Equipos[i],        // Nombre corregido
                        Visitante = Equipos[i + 1],  // Nombre corregido
                        Ronda = 1,
                        Estado = "Pendiente"
                    };
                    Llaves.Add(nuevoPartido);
                }
            }
        }

        public void AvanzarRonda() 
        {
            if (Llaves == null || !Llaves.Any()) return;

            // Buscamos el número de la ronda más alta
            int rondaActual = Llaves.Max(p => p.Ronda);

            // Filtramos los partidos de esa ronda
            var partidosRondaActual = Llaves.Where(p => p.Ronda == rondaActual).ToList();

            // Si hay partidos sin terminar, frenamos
            if (partidosRondaActual.Any(p => p.Estado != "Finalizado")) return;

            // Si quedaba un solo partido, ya jugaron la final
            if (partidosRondaActual.Count == 1) return;

            // Cosechamos los ganadores
            List<Equipo> ganadores = partidosRondaActual
                .Select(p => p.ObtenerGanador())
                .Where(g => g != null) // Evitamos nulos por si hubo empates no resueltos
                .ToList();

            // Cruzamos a los ganadores en la siguiente ronda
            for (int i = 0; i < ganadores.Count; i += 2)
            {
                if (i + 1 < ganadores.Count)
                {
                    Partido partidoSiguienteRonda = new Partido
                    {
                        Local = ganadores[i],       // Nombre corregido
                        Visitante = ganadores[i + 1], // Nombre corregido
                        Ronda = rondaActual + 1,
                        Estado = "Pendiente"
                    };
                    Llaves.Add(partidoSiguienteRonda);
                }
            }
        }

        // Implementación OBLIGATORIA del método abstracto de la clase padre
        public override Equipo ObtenerCampeon() 
        {
            var partidoFinal = Llaves.LastOrDefault();

            if (partidoFinal != null && partidoFinal.Estado == "Finalizado")
            {
                return partidoFinal.ObtenerGanador();
            }

            return null;
        }
    }
}