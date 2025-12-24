using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AdvertisementId",
                table: "Reviews",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "Reviews",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "Reviews",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_AdvertisementId",
                table: "Reviews",
                column: "AdvertisementId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_AuthorId_AdvertisementId",
                table: "Reviews",
                columns: new[] { "AuthorId", "AdvertisementId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Advertisements_AdvertisementId",
                table: "Reviews",
                column: "AdvertisementId",
                principalTable: "Advertisements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Advertisements_AdvertisementId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_AdvertisementId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_AuthorId_AdvertisementId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "AdvertisementId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Reviews");
        }
    }
}
