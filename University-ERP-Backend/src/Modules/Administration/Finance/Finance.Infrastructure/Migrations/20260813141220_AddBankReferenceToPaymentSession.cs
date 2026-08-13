using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finance.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBankReferenceToPaymentSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BankReference",
                schema: "finance",
                table: "PaymentSessions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GatewayTransactionId",
                schema: "finance",
                table: "PaymentSessions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdempotencyKey",
                schema: "finance",
                table: "PaymentSessions",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankReference",
                schema: "finance",
                table: "PaymentSessions");

            migrationBuilder.DropColumn(
                name: "GatewayTransactionId",
                schema: "finance",
                table: "PaymentSessions");

            migrationBuilder.DropColumn(
                name: "IdempotencyKey",
                schema: "finance",
                table: "PaymentSessions");
        }
    }
}
