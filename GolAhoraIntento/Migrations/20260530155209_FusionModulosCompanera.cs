using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class FusionModulosCompanera : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ComprobantePath",
                table: "Reservas",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddColumn<int>(
                name: "CupoMaximo",
                table: "Ligas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ClaseIdActividad",
                table: "Clientes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_ClaseIdActividad",
                table: "Clientes",
                column: "ClaseIdActividad");

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Clases_ClaseIdActividad",
                table: "Clientes",
                column: "ClaseIdActividad",
                principalTable: "Clases",
                principalColumn: "IdActividad");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Clases_ClaseIdActividad",
                table: "Clientes");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_ClaseIdActividad",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "ComprobantePath",
                table: "Reservas");

            migrationBuilder.DropColumn(
                name: "CupoMaximo",
                table: "Ligas");

            migrationBuilder.DropColumn(
                name: "ClaseIdActividad",
                table: "Clientes");
        }
    }
}
