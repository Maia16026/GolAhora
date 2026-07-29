using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class canchaNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Partidos_Canchas_IdCaching",
                table: "Partidos");

            migrationBuilder.AlterColumn<int>(
                name: "IdCaching",
                table: "Partidos",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Partidos_Canchas_IdCaching",
                table: "Partidos",
                column: "IdCaching",
                principalTable: "Canchas",
                principalColumn: "IdCancha");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Partidos_Canchas_IdCaching",
                table: "Partidos");

            migrationBuilder.AlterColumn<int>(
                name: "IdCaching",
                table: "Partidos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Partidos_Canchas_IdCaching",
                table: "Partidos",
                column: "IdCaching",
                principalTable: "Canchas",
                principalColumn: "IdCancha",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
