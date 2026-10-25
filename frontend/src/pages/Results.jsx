import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Download } from "lucide-react";
import { generateReportPdf } from "../utils/generatePdf";

function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state && location.state.result;

  useEffect(() => {
    if (!result) navigate("/dashboard");
    // eslint-disable-next-line
  }, []);

  if (!result) return null;

  return (
    <div className="test-wrap fade-in">
      <div className="card center">
        <h2>Your Analysis Summary</h2>
        <p className="muted">Here is your personality result.</p>

        <div className="result-circle" data-testid="result-type">
          <div className="type">{result.type}</div>
          <div>{result.name}</div>
        </div>

        <p style={{ maxWidth: 480, margin: "0 auto 16px", color: "#465065" }}>{result.description}</p>

        <div className="section-head" style={{ justifyContent: "center" }}>
          <h3>Top Strengths</h3>
        </div>
        <div className="trait-chips mb-20">
          {result.strengths.map((s) => (
            <span className="tag" key={s}>{s}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => navigate("/reports/" + result.reportId)} data-testid="view-full-report">
            <FileText size={18} /> View Full Report
          </button>
          <button className="btn btn-outline" onClick={() => generateReportPdf(result)} data-testid="download-pdf">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
