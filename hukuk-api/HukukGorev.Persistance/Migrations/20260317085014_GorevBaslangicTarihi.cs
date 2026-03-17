using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HukukGorev.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class GorevBaslangicTarihi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "BASLANGICTARIHI",
                table: "GOREVLER",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BASLANGICTARIHI",
                table: "GOREVLER");
        }
    }
}
