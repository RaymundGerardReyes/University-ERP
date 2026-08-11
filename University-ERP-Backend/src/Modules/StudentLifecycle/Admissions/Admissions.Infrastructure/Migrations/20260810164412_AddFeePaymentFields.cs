using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Admissions.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFeePaymentFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "admissions");

            migrationBuilder.CreateTable(
                name: "AdmissionApplications",
                schema: "admissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    ApplicantId = table.Column<string>(type: "text", nullable: false),
                    ProgramId = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    FacultyRemarks = table.Column<string>(type: "text", nullable: false, defaultValue: ""),
                    OfficialStudentId = table.Column<string>(type: "text", nullable: false, defaultValue: ""),
                    SubmittedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    InterviewDate = table.Column<string>(type: "text", nullable: false, defaultValue: ""),
                    InterviewTime = table.Column<string>(type: "text", nullable: false, defaultValue: ""),
                    ApplicationFeeStatus = table.Column<string>(type: "text", nullable: false, defaultValue: "Pending"),
                    ApplicationFeeTransactionId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdmissionApplications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProgramOfferings",
                schema: "admissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    College = table.Column<string>(type: "text", nullable: false),
                    Degree = table.Column<string>(type: "text", nullable: false),
                    Major = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<string>(type: "text", nullable: false),
                    Intake = table.Column<string>(type: "text", nullable: false),
                    TuitionEstimate = table.Column<string>(type: "text", nullable: false),
                    Tags = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgramOfferings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AdmissionDocuments",
                schema: "admissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AdmissionApplicationId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdmissionDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdmissionDocuments_AdmissionApplications_AdmissionApplicati~",
                        column: x => x.AdmissionApplicationId,
                        principalSchema: "admissions",
                        principalTable: "AdmissionApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationTimelineEvents",
                schema: "admissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    DateCompleted = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AdmissionApplicationId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationTimelineEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicationTimelineEvents_AdmissionApplications_AdmissionAp~",
                        column: x => x.AdmissionApplicationId,
                        principalSchema: "admissions",
                        principalTable: "AdmissionApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdmissionDocuments_AdmissionApplicationId",
                schema: "admissions",
                table: "AdmissionDocuments",
                column: "AdmissionApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationTimelineEvents_AdmissionApplicationId",
                schema: "admissions",
                table: "ApplicationTimelineEvents",
                column: "AdmissionApplicationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdmissionDocuments",
                schema: "admissions");

            migrationBuilder.DropTable(
                name: "ApplicationTimelineEvents",
                schema: "admissions");

            migrationBuilder.DropTable(
                name: "ProgramOfferings",
                schema: "admissions");

            migrationBuilder.DropTable(
                name: "AdmissionApplications",
                schema: "admissions");
        }
    }
}
