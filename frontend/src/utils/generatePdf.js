import jsPDF from "jspdf";

// Build a clean, real PDF from a personality report / result object.
// Accepts fields from either the Report API or the test Results object.
export function generateReportPdf(data) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 60;

  const type = data.personalityType || data.type || "";
  const name = data.personalityName || data.name || "";
  const dateStr = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

  function heading(text) {
    if (y > 760) { doc.addPage(); y = 60; }
    doc.setTextColor(124, 58, 237);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(text, margin, y);
    y += 20;
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
  }

  function paragraph(text) {
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    lines.forEach((line) => {
      if (y > 780) { doc.addPage(); y = 60; }
      doc.text(line, margin, y);
      y += 16;
    });
    y += 8;
  }

  function bullets(items) {
    (items || []).forEach((item) => {
      if (y > 780) { doc.addPage(); y = 60; }
      doc.text("•  " + item, margin + 6, y);
      y += 16;
    });
    y += 8;
  }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(124, 58, 237);
  doc.text("PersonLens Report", margin, y);
  y += 26;
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text("Generated on " + dateStr, margin, y);
  y += 30;

  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text(type + " - " + name, margin, y);
  y += 28;

  heading("Personality Overview");
  paragraph(data.description || "Not available");

  heading("Communication Style");
  paragraph(data.communicationStyle || "Not available");

  heading("Strengths");
  bullets(data.strengths);

  heading("Weaknesses");
  bullets(data.weaknesses);

  heading("Improvement Areas");
  bullets(data.improvementAreas);

  heading("Voice Analysis");
  paragraph("Not analyzed yet.");

  doc.save("PersonLens-Report-" + type + "-" + Date.now() + ".pdf");
}
