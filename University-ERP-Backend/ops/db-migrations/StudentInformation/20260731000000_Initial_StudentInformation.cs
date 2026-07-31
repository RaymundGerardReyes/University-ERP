using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentInformation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial_StudentInformation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "academic");

            migrationBuilder.CreateTable(
                name: "Students",
                schema: "academic",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    IdentityUserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    EnrollmentNumber = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    EnrolledOnUtc = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Students_EnrollmentNumber",
                schema: "academic",
                table: "Students",
                column: "EnrollmentNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Students",
                schema: "academic");
        }
    }
}
