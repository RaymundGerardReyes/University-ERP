using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Admissions.Infrastructure.Persistence.Migrations
{
    public partial class AddAdmissionsApprovalFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FacultyRemarks",
                schema: "admissions",
                table: "AdmissionApplications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OfficialStudentId",
                schema: "admissions",
                table: "AdmissionApplications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacultyRemarks",
                schema: "admissions",
                table: "AdmissionApplications");

            migrationBuilder.DropColumn(
                name: "OfficialStudentId",
                schema: "admissions",
                table: "AdmissionApplications");
        }
    }
}