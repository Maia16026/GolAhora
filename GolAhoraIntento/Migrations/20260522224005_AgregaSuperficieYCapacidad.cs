using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class AgregaSuperficieYCapacidad : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Capacidad",
                table: "Canchas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Superficie",
                table: "Canchas",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Capacidad",
                table: "Canchas");

            migrationBuilder.DropColumn(
                name: "Superficie",
                table: "Canchas");
        }
    }
}
