using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class MigracionInicialLimpia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Actividades",
                columns: table => new
                {
                    IdActividad = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NombreActividad = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actividades", x => x.IdActividad);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Certificados",
                columns: table => new
                {
                    IdCertificado = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NombreCertificacion = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EnteEmisor = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Verificado = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FechaEmision = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certificados", x => x.IdCertificado);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Descuentos",
                columns: table => new
                {
                    IdDescuento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Caso = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Valor = table.Column<double>(type: "double", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Descuentos", x => x.IdDescuento);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Equipos",
                columns: table => new
                {
                    IdEquipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nombre = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipos", x => x.IdEquipo);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Recibos",
                columns: table => new
                {
                    IdRecibo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Fecha = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Monto = table.Column<double>(type: "double", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recibos", x => x.IdRecibo);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Reglamentos",
                columns: table => new
                {
                    IdReglamento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TipoReglamento = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PuntosPorVictoria = table.Column<int>(type: "int", nullable: false),
                    PuntosPorEmpate = table.Column<int>(type: "int", nullable: false),
                    MaximaFaltasPorJugador = table.Column<int>(type: "int", nullable: false),
                    CantidadCambios = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reglamentos", x => x.IdReglamento);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TipoCanchas",
                columns: table => new
                {
                    IdTipoCancha = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nombre = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Superficie = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Capacidad = table.Column<int>(type: "int", nullable: false),
                    Precio = table.Column<double>(type: "double", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoCanchas", x => x.IdTipoCancha);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Dni = table.Column<int>(type: "int", nullable: false),
                    Nombre = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Apellido = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Telefono = table.Column<int>(type: "int", nullable: false),
                    Mail = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Contrasena = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Dni);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Cobros",
                columns: table => new
                {
                    IdCobro = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Fecha = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    MontoBase = table.Column<double>(type: "double", nullable: false),
                    Concepto = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Estado = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MontoFinal = table.Column<double>(type: "double", nullable: false),
                    IdDescuento = table.Column<int>(type: "int", nullable: true),
                    IdRecibo = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cobros", x => x.IdCobro);
                    table.ForeignKey(
                        name: "FK_Cobros_Descuentos_IdDescuento",
                        column: x => x.IdDescuento,
                        principalTable: "Descuentos",
                        principalColumn: "IdDescuento");
                    table.ForeignKey(
                        name: "FK_Cobros_Recibos_IdRecibo",
                        column: x => x.IdRecibo,
                        principalTable: "Recibos",
                        principalColumn: "IdRecibo");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Competiciones",
                columns: table => new
                {
                    IdActividad = table.Column<int>(type: "int", nullable: false),
                    IdReglamento = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Competiciones", x => x.IdActividad);
                    table.ForeignKey(
                        name: "FK_Competiciones_Actividades_IdActividad",
                        column: x => x.IdActividad,
                        principalTable: "Actividades",
                        principalColumn: "IdActividad",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Competiciones_Reglamentos_IdReglamento",
                        column: x => x.IdReglamento,
                        principalTable: "Reglamentos",
                        principalColumn: "IdReglamento",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Canchas",
                columns: table => new
                {
                    IdCancha = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdTipoCancha = table.Column<int>(type: "int", nullable: false),
                    DiasHabiles = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HoraInicio = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    HoraFin = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    DuracionMaxima = table.Column<int>(type: "int", nullable: false),
                    Disponible = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Canchas", x => x.IdCancha);
                    table.ForeignKey(
                        name: "FK_Canchas_TipoCanchas_IdTipoCancha",
                        column: x => x.IdTipoCancha,
                        principalTable: "TipoCanchas",
                        principalColumn: "IdTipoCancha",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Administradores",
                columns: table => new
                {
                    Dni = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Administradores", x => x.Dni);
                    table.ForeignKey(
                        name: "FK_Administradores_Usuarios_Dni",
                        column: x => x.Dni,
                        principalTable: "Usuarios",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Direcciones",
                columns: table => new
                {
                    IdDireccion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Calle = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Numero = table.Column<int>(type: "int", nullable: false),
                    Localidad = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Barrio = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CodigoPostal = table.Column<int>(type: "int", nullable: false),
                    DniUsuario = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Direcciones", x => x.IdDireccion);
                    table.ForeignKey(
                        name: "FK_Direcciones_Usuarios_DniUsuario",
                        column: x => x.DniUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Instructores",
                columns: table => new
                {
                    Dni = table.Column<int>(type: "int", nullable: false),
                    Especialidad = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Antiguedad = table.Column<int>(type: "int", nullable: false),
                    IdCertificado = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Instructores", x => x.Dni);
                    table.ForeignKey(
                        name: "FK_Instructores_Certificados_IdCertificado",
                        column: x => x.IdCertificado,
                        principalTable: "Certificados",
                        principalColumn: "IdCertificado");
                    table.ForeignKey(
                        name: "FK_Instructores_Usuarios_Dni",
                        column: x => x.Dni,
                        principalTable: "Usuarios",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Jugadores",
                columns: table => new
                {
                    IdJugador = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdEquipo = table.Column<int>(type: "int", nullable: false),
                    DniUsuario = table.Column<int>(type: "int", nullable: true),
                    NombreInvitado = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DniInvitado = table.Column<int>(type: "int", nullable: true),
                    Dorsal = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jugadores", x => x.IdJugador);
                    table.ForeignKey(
                        name: "FK_Jugadores_Equipos_IdEquipo",
                        column: x => x.IdEquipo,
                        principalTable: "Equipos",
                        principalColumn: "IdEquipo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Jugadores_Usuarios_DniUsuario",
                        column: x => x.DniUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "Dni");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CompeticionEquipo",
                columns: table => new
                {
                    CompeticionesIdActividad = table.Column<int>(type: "int", nullable: false),
                    EquiposIdEquipo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompeticionEquipo", x => new { x.CompeticionesIdActividad, x.EquiposIdEquipo });
                    table.ForeignKey(
                        name: "FK_CompeticionEquipo_Competiciones_CompeticionesIdActividad",
                        column: x => x.CompeticionesIdActividad,
                        principalTable: "Competiciones",
                        principalColumn: "IdActividad",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompeticionEquipo_Equipos_EquiposIdEquipo",
                        column: x => x.EquiposIdEquipo,
                        principalTable: "Equipos",
                        principalColumn: "IdEquipo",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Ligas",
                columns: table => new
                {
                    IdActividad = table.Column<int>(type: "int", nullable: false),
                    CupoMaximo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ligas", x => x.IdActividad);
                    table.ForeignKey(
                        name: "FK_Ligas_Competiciones_IdActividad",
                        column: x => x.IdActividad,
                        principalTable: "Competiciones",
                        principalColumn: "IdActividad",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Torneos",
                columns: table => new
                {
                    IdActividad = table.Column<int>(type: "int", nullable: false),
                    CupoMaximo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Torneos", x => x.IdActividad);
                    table.ForeignKey(
                        name: "FK_Torneos_Competiciones_IdActividad",
                        column: x => x.IdActividad,
                        principalTable: "Competiciones",
                        principalColumn: "IdActividad",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Reservas",
                columns: table => new
                {
                    IdReserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FechaCreacion = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    HoraInicio = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    HoraFin = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    EstadoReserva = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ComprobantePath = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DniCliente = table.Column<int>(type: "int", nullable: false),
                    IdCancha = table.Column<int>(type: "int", nullable: false),
                    IdCobro = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservas", x => x.IdReserva);
                    table.ForeignKey(
                        name: "FK_Reservas_Canchas_IdCancha",
                        column: x => x.IdCancha,
                        principalTable: "Canchas",
                        principalColumn: "IdCancha",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservas_Cobros_IdCobro",
                        column: x => x.IdCobro,
                        principalTable: "Cobros",
                        principalColumn: "IdCobro");
                    table.ForeignKey(
                        name: "FK_Reservas_Usuarios_DniCliente",
                        column: x => x.DniCliente,
                        principalTable: "Usuarios",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Entrenadores",
                columns: table => new
                {
                    Dni = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entrenadores", x => x.Dni);
                    table.ForeignKey(
                        name: "FK_Entrenadores_Instructores_Dni",
                        column: x => x.Dni,
                        principalTable: "Instructores",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Profesores",
                columns: table => new
                {
                    Dni = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profesores", x => x.Dni);
                    table.ForeignKey(
                        name: "FK_Profesores_Instructores_Dni",
                        column: x => x.Dni,
                        principalTable: "Instructores",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Fecha",
                columns: table => new
                {
                    IdFecha = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NumeroFecha = table.Column<int>(type: "int", nullable: false),
                    EstaFinalizada = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IdLiga = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fecha", x => x.IdFecha);
                    table.ForeignKey(
                        name: "FK_Fecha_Ligas_IdLiga",
                        column: x => x.IdLiga,
                        principalTable: "Ligas",
                        principalColumn: "IdActividad",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RegistroTabla",
                columns: table => new
                {
                    IdTabla = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Posicion = table.Column<int>(type: "int", nullable: false),
                    IdLiga = table.Column<int>(type: "int", nullable: false),
                    IdEquipo = table.Column<int>(type: "int", nullable: false),
                    Puntos = table.Column<int>(type: "int", nullable: false),
                    PartidosJugados = table.Column<int>(type: "int", nullable: false),
                    PartidosGanados = table.Column<int>(type: "int", nullable: false),
                    PartidosEmpatados = table.Column<int>(type: "int", nullable: false),
                    PartidosPerdidos = table.Column<int>(type: "int", nullable: false),
                    GolesFavor = table.Column<int>(type: "int", nullable: false),
                    GolesContra = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistroTabla", x => x.IdTabla);
                    table.ForeignKey(
                        name: "FK_RegistroTabla_Equipos_IdEquipo",
                        column: x => x.IdEquipo,
                        principalTable: "Equipos",
                        principalColumn: "IdEquipo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RegistroTabla_Ligas_IdLiga",
                        column: x => x.IdLiga,
                        principalTable: "Ligas",
                        principalColumn: "IdActividad",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Entrenamientos",
                columns: table => new
                {
                    IdActividad = table.Column<int>(type: "int", nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DniEntrenador = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entrenamientos", x => x.IdActividad);
                    table.ForeignKey(
                        name: "FK_Entrenamientos_Actividades_IdActividad",
                        column: x => x.IdActividad,
                        principalTable: "Actividades",
                        principalColumn: "IdActividad",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Entrenamientos_Entrenadores_DniEntrenador",
                        column: x => x.DniEntrenador,
                        principalTable: "Entrenadores",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Clases",
                columns: table => new
                {
                    IdActividad = table.Column<int>(type: "int", nullable: false),
                    CupoMaximo = table.Column<int>(type: "int", nullable: false),
                    Dias = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Horario = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DniProfesor = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clases", x => x.IdActividad);
                    table.ForeignKey(
                        name: "FK_Clases_Actividades_IdActividad",
                        column: x => x.IdActividad,
                        principalTable: "Actividades",
                        principalColumn: "IdActividad",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Clases_Profesores_DniProfesor",
                        column: x => x.DniProfesor,
                        principalTable: "Profesores",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Partidos",
                columns: table => new
                {
                    IdPartido = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IdEquipoLocal = table.Column<int>(type: "int", nullable: false),
                    IdEquipoVisitante = table.Column<int>(type: "int", nullable: false),
                    IdCancha = table.Column<int>(type: "int", nullable: true),
                    IdCaching = table.Column<int>(type: "int", nullable: true),
                    IdFecha = table.Column<int>(type: "int", nullable: true),
                    IdTorneo = table.Column<int>(type: "int", nullable: true),
                    GolesLocal = table.Column<int>(type: "int", nullable: true),
                    GolesVisitante = table.Column<int>(type: "int", nullable: true),
                    Estado = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ronda = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partidos", x => x.IdPartido);
                    table.ForeignKey(
                        name: "FK_Partidos_Canchas_IdCaching",
                        column: x => x.IdCaching,
                        principalTable: "Canchas",
                        principalColumn: "IdCancha");
                    table.ForeignKey(
                        name: "FK_Partidos_Equipos_IdEquipoLocal",
                        column: x => x.IdEquipoLocal,
                        principalTable: "Equipos",
                        principalColumn: "IdEquipo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Partidos_Equipos_IdEquipoVisitante",
                        column: x => x.IdEquipoVisitante,
                        principalTable: "Equipos",
                        principalColumn: "IdEquipo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Partidos_Fecha_IdFecha",
                        column: x => x.IdFecha,
                        principalTable: "Fecha",
                        principalColumn: "IdFecha");
                    table.ForeignKey(
                        name: "FK_Partidos_Torneos_IdTorneo",
                        column: x => x.IdTorneo,
                        principalTable: "Torneos",
                        principalColumn: "IdActividad");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Clientes",
                columns: table => new
                {
                    Dni = table.Column<int>(type: "int", nullable: false),
                    EsSocio = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ClaseIdActividad = table.Column<int>(type: "int", nullable: true),
                    EntrenamientoIdActividad = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clientes", x => x.Dni);
                    table.ForeignKey(
                        name: "FK_Clientes_Clases_ClaseIdActividad",
                        column: x => x.ClaseIdActividad,
                        principalTable: "Clases",
                        principalColumn: "IdActividad");
                    table.ForeignKey(
                        name: "FK_Clientes_Entrenamientos_EntrenamientoIdActividad",
                        column: x => x.EntrenamientoIdActividad,
                        principalTable: "Entrenamientos",
                        principalColumn: "IdActividad");
                    table.ForeignKey(
                        name: "FK_Clientes_Usuarios_Dni",
                        column: x => x.Dni,
                        principalTable: "Usuarios",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Canchas_IdTipoCancha",
                table: "Canchas",
                column: "IdTipoCancha");

            migrationBuilder.CreateIndex(
                name: "IX_Clases_DniProfesor",
                table: "Clases",
                column: "DniProfesor");

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_ClaseIdActividad",
                table: "Clientes",
                column: "ClaseIdActividad");

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_EntrenamientoIdActividad",
                table: "Clientes",
                column: "EntrenamientoIdActividad");

            migrationBuilder.CreateIndex(
                name: "IX_Cobros_IdDescuento",
                table: "Cobros",
                column: "IdDescuento");

            migrationBuilder.CreateIndex(
                name: "IX_Cobros_IdRecibo",
                table: "Cobros",
                column: "IdRecibo");

            migrationBuilder.CreateIndex(
                name: "IX_CompeticionEquipo_EquiposIdEquipo",
                table: "CompeticionEquipo",
                column: "EquiposIdEquipo");

            migrationBuilder.CreateIndex(
                name: "IX_Competiciones_IdReglamento",
                table: "Competiciones",
                column: "IdReglamento");

            migrationBuilder.CreateIndex(
                name: "IX_Direcciones_DniUsuario",
                table: "Direcciones",
                column: "DniUsuario",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Entrenamientos_DniEntrenador",
                table: "Entrenamientos",
                column: "DniEntrenador");

            migrationBuilder.CreateIndex(
                name: "IX_Fecha_IdLiga",
                table: "Fecha",
                column: "IdLiga");

            migrationBuilder.CreateIndex(
                name: "IX_Instructores_IdCertificado",
                table: "Instructores",
                column: "IdCertificado");

            migrationBuilder.CreateIndex(
                name: "IX_Jugadores_DniUsuario",
                table: "Jugadores",
                column: "DniUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Jugadores_IdEquipo",
                table: "Jugadores",
                column: "IdEquipo");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_IdCaching",
                table: "Partidos",
                column: "IdCaching");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_IdEquipoLocal",
                table: "Partidos",
                column: "IdEquipoLocal");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_IdEquipoVisitante",
                table: "Partidos",
                column: "IdEquipoVisitante");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_IdFecha",
                table: "Partidos",
                column: "IdFecha");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_IdTorneo",
                table: "Partidos",
                column: "IdTorneo");

            migrationBuilder.CreateIndex(
                name: "IX_RegistroTabla_IdEquipo",
                table: "RegistroTabla",
                column: "IdEquipo");

            migrationBuilder.CreateIndex(
                name: "IX_RegistroTabla_IdLiga",
                table: "RegistroTabla",
                column: "IdLiga");

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_DniCliente",
                table: "Reservas",
                column: "DniCliente");

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_IdCancha",
                table: "Reservas",
                column: "IdCancha");

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_IdCobro",
                table: "Reservas",
                column: "IdCobro");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Administradores");

            migrationBuilder.DropTable(
                name: "Clientes");

            migrationBuilder.DropTable(
                name: "CompeticionEquipo");

            migrationBuilder.DropTable(
                name: "Direcciones");

            migrationBuilder.DropTable(
                name: "Jugadores");

            migrationBuilder.DropTable(
                name: "Partidos");

            migrationBuilder.DropTable(
                name: "RegistroTabla");

            migrationBuilder.DropTable(
                name: "Reservas");

            migrationBuilder.DropTable(
                name: "Clases");

            migrationBuilder.DropTable(
                name: "Entrenamientos");

            migrationBuilder.DropTable(
                name: "Fecha");

            migrationBuilder.DropTable(
                name: "Torneos");

            migrationBuilder.DropTable(
                name: "Equipos");

            migrationBuilder.DropTable(
                name: "Canchas");

            migrationBuilder.DropTable(
                name: "Cobros");

            migrationBuilder.DropTable(
                name: "Profesores");

            migrationBuilder.DropTable(
                name: "Entrenadores");

            migrationBuilder.DropTable(
                name: "Ligas");

            migrationBuilder.DropTable(
                name: "TipoCanchas");

            migrationBuilder.DropTable(
                name: "Descuentos");

            migrationBuilder.DropTable(
                name: "Recibos");

            migrationBuilder.DropTable(
                name: "Instructores");

            migrationBuilder.DropTable(
                name: "Competiciones");

            migrationBuilder.DropTable(
                name: "Certificados");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Actividades");

            migrationBuilder.DropTable(
                name: "Reglamentos");
        }
    }
}
