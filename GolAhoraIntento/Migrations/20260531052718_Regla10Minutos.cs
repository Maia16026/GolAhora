using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class Regla10Minutos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Reservas",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaCreacion",
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
        }
    }
}
