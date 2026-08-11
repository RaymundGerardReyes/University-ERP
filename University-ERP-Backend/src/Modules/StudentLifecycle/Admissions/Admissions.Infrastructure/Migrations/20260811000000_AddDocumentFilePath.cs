using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Admissions.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentFilePath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                schema: "admissions",
                table: "AdmissionDocuments",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilePath",
                schema: "admissions",
                table: "AdmissionDocuments");
        }
    }
}