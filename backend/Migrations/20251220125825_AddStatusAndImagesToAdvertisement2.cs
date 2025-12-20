using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusAndImagesToAdvertisement2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Image",
                table: "AdvertisementImages",
                newName: "FileName");

            // Создаём новый столбец Status как integer
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Advertisements",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
               name: "FileName",
               table: "AdvertisementImages",
               newName: "Image");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Advertisements");
        }
    }
}
