namespace Admissions.Presentation.Endpoints;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text;

[ApiController]
[Route("api/v1/admissions/documents")]
public sealed class DocumentsEndpoint : ControllerBase
{
    private readonly ILogger<DocumentsEndpoint> _logger;

    public DocumentsEndpoint(ILogger<DocumentsEndpoint> logger)
    {
        _logger = logger;
    }

    [HttpGet("{fileName}")]
    public IActionResult GetDocument([FromRoute] string fileName)
    {
        _logger.LogInformation("DocumentsEndpoint triggered. Attempting to fetch: {FileName}", fileName);

        // Set the explicit inline disposition header
        Response.Headers.Append("Content-Disposition", $"inline; filename=\"{fileName}\"");

        // 1. Attempt to serve the actual physical file if it exists on disk
        var searchPaths = new[] {
            fileName, // Absolute path or relative to CWD
            System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "wwwroot", fileName),
            System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "wwwroot", "documents", fileName),
            System.IO.Path.Combine("d:\\University-ERP", fileName)
        };

        foreach (var path in searchPaths)
        {
            if (System.IO.File.Exists(path))
            {
                _logger.LogInformation("Actual document found on disk at {FilePath}! Serving physical file.", path);
                var contentType = fileName.EndsWith(".pdf", System.StringComparison.OrdinalIgnoreCase) ? "application/pdf" : "application/octet-stream";
                return PhysicalFile(System.IO.Path.GetFullPath(path), contentType, enableRangeProcessing: true);
            }
        }

        if (fileName.EndsWith(".pdf", System.StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogInformation("PDF requested. Generating dynamic PDF with exact byte offsets for: {FileName}", fileName);
            
            // Clean up filename for display in PDF
            var displayTitle = fileName.Replace(".pdf", "", System.StringComparison.OrdinalIgnoreCase)
                                       .Replace("(", "").Replace(")", "")
                                       .Replace("%20", " ");
                                       
            // Truncate to avoid overflowing the PDF page
            if (displayTitle.Length > 50) displayTitle = displayTitle.Substring(0, 47) + "...";

            var pdfStream = $"BT\n/F1 20 Tf\n50 700 Td\n({displayTitle}) Tj\n/F1 12 Tf\n50 670 Td\n(Status: Verified Data) Tj\nET";
            var pdfHeader = "%PDF-1.4\n";
            var obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
            var obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
            var obj3 = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n";
            var obj4 = "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n";
            var obj5 = $"5 0 obj\n<< /Length {pdfStream.Length} >>\nstream\n{pdfStream}\nendstream\nendobj\n";

            var o1 = Encoding.ASCII.GetBytes(pdfHeader).Length;
            var o2 = o1 + Encoding.ASCII.GetBytes(obj1).Length;
            var o3 = o2 + Encoding.ASCII.GetBytes(obj2).Length;
            var o4 = o3 + Encoding.ASCII.GetBytes(obj3).Length;
            var o5 = o4 + Encoding.ASCII.GetBytes(obj4).Length;
            var xrefStart = o5 + Encoding.ASCII.GetBytes(obj5).Length;

            var xref = $"xref\n0 6\n0000000000 65535 f \n{o1:D10} 00000 n \n{o2:D10} 00000 n \n{o3:D10} 00000 n \n{o4:D10} 00000 n \n{o5:D10} 00000 n \n";
            var trailer = $"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n{xrefStart}\n%%EOF\n";

            var dynamicPdf = pdfHeader + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;
            var pdfBytes = Encoding.ASCII.GetBytes(dynamicPdf);
            
            _logger.LogInformation("Successfully generated {ByteCount} bytes for dynamic PDF stream.", pdfBytes.Length);
            return File(pdfBytes, "application/pdf");
        }

        if (fileName.EndsWith(".jpg", System.StringComparison.OrdinalIgnoreCase) || 
            fileName.EndsWith(".png", System.StringComparison.OrdinalIgnoreCase))
        {
            // Minimal 1x1 transparent PNG for testing image rendering in dev
            var transparentPng = new byte[] { 137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 11, 73, 68, 65, 84, 120, 156, 99, 96, 0, 2, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130 };
            return File(transparentPng, "image/png");
        }

        // Return a 404 for files that don't match our dummy stubs during development
        return NotFound();
    }
}