using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class RelacionEquipoJugador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClienteEquipo");

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

            migrationBuilder.CreateIndex(
                name: "IX_Jugadores_DniUsuario",
                table: "Jugadores",
                column: "DniUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Jugadores_IdEquipo",
                table: "Jugadores",
                column: "IdEquipo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Jugadores");

            migrationBuilder.CreateTable(
                name: "ClienteEquipo",
                columns: table => new
                {
                    EquipoIdEquipo = table.Column<int>(type: "int", nullable: false),
                    JugadoresDni = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClienteEquipo", x => new { x.EquipoIdEquipo, x.JugadoresDni });
                    table.ForeignKey(
                        name: "FK_ClienteEquipo_Clientes_JugadoresDni",
                        column: x => x.JugadoresDni,
                        principalTable: "Clientes",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClienteEquipo_Equipos_EquipoIdEquipo",
                        column: x => x.EquipoIdEquipo,
                        principalTable: "Equipos",
                        principalColumn: "IdEquipo",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ClienteEquipo_JugadoresDni",
                table: "ClienteEquipo",
                column: "JugadoresDni");
        }
    }
}
