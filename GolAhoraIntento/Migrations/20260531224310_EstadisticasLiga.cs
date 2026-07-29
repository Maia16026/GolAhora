using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class EstadisticasLiga : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PartidosEmpatados",
                table: "RegistroTabla",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PartidosGanados",
                table: "RegistroTabla",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PartidosJugados",
                table: "RegistroTabla",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PartidosPerdidos",
                table: "RegistroTabla",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PartidosEmpatados",
                table: "RegistroTabla");

            migrationBuilder.DropColumn(
                name: "PartidosGanados",
                table: "RegistroTabla");

            migrationBuilder.DropColumn(
                name: "PartidosJugados",
                table: "RegistroTabla");

            migrationBuilder.DropColumn(
                name: "PartidosPerdidos",
                table: "RegistroTabla");
        }
    }
}
