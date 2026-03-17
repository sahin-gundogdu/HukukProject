using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HukukGorev.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class AltGorevGrupAtama : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ATAMATIPI",
                table: "ALT_GOREVLER",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ATANANGRUPID",
                table: "ALT_GOREVLER",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ALT_GOREVLER_ATANANGRUPID",
                table: "ALT_GOREVLER",
                column: "ATANANGRUPID");

            migrationBuilder.AddForeignKey(
                name: "FK_ALT_GOREVLER_GRUPLAR_ATANANGRUPID",
                table: "ALT_GOREVLER",
                column: "ATANANGRUPID",
                principalTable: "GRUPLAR",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ALT_GOREVLER_GRUPLAR_ATANANGRUPID",
                table: "ALT_GOREVLER");

            migrationBuilder.DropIndex(
                name: "IX_ALT_GOREVLER_ATANANGRUPID",
                table: "ALT_GOREVLER");

            migrationBuilder.DropColumn(
                name: "ATAMATIPI",
                table: "ALT_GOREVLER");

            migrationBuilder.DropColumn(
                name: "ATANANGRUPID",
                table: "ALT_GOREVLER");
        }
    }
}
