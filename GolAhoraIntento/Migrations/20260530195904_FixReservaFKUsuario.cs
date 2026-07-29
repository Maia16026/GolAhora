using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class FixReservaFKUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservas_Clientes_DniCliente",
                table: "Reservas");

            migrationBuilder.AlterColumn<string>(
                name: "ComprobantePath",
                table: "Reservas",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservas_Usuarios_DniCliente",
                table: "Reservas",
                column: "DniCliente",
                principalTable: "Usuarios",
                principalColumn: "Dni",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservas_Usuarios_DniCliente",
                table: "Reservas");

            migrationBuilder.UpdateData(
                table: "Reservas",
                keyColumn: "ComprobantePath",
                keyValue: null,
                column: "ComprobantePath",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "ComprobantePath",
                table: "Reservas",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservas_Clientes_DniCliente",
                table: "Reservas",
                column: "DniCliente",
                principalTable: "Clientes",
                principalColumn: "Dni",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
