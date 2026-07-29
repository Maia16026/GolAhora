using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class SegundaFusionMica : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Entrenamientos_EntrenamientoIdActividad",
                table: "Clientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Partidos_Canchas_IdCaching",
                table: "Partidos");

            migrationBuilder.DropIndex(
                name: "IX_Partidos_IdCaching",
                table: "Partidos");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_EntrenamientoIdActividad",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "CupoMaximo",
                table: "Torneos");

            migrationBuilder.DropColumn(
                name: "IdCaching",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Ronda",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "EntrenamientoIdActividad",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Dias",
                table: "Clases");

            migrationBuilder.DropColumn(
                name: "Horario",
                table: "Clases");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_IdCancha",
                table: "Partidos",
                column: "IdCancha");

            migrationBuilder.AddForeignKey(
                name: "FK_Partidos_Canchas_IdCancha",
                table: "Partidos",
                column: "IdCancha",
                principalTable: "Canchas",
                principalColumn: "IdCancha");
        }
    }
}
