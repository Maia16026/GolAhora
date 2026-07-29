using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gol_ahora.Migrations
{
    /// <inheritdoc />
    public partial class AddDniInvitadoJugador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DniInvitado",
                table: "Jugadores",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DniInvitado",
                table: "Jugadores");
        }
    }
}
