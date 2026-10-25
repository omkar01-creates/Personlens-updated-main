import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import API from "../services/api";

const STEPS = ["Processing Responses", "Analyzing Answers", "Generating Insights", "Preparing Report"];

function Processing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!location.state || !location.state.answers) {
      navigate("/personality-test");
      return;
    }
    if (started.current) return; // prevent double submit (React StrictMode)
    started.current = true;
    runAnalysis();
    // eslint-disable-next-line
  }, []);

  async function runAnalysis() {
    // Animate through the steps while the request is sent.
    const timer = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 700);

    try {
      const res = await API.post("/personality/submit", { answers: location.state.answers });
      setTimeout(() => {
        clearInterval(timer);
        navigate("/results", { state: { result: res.data } });
      }, 2800);
    } catch (error) {
      clearInterval(timer);
      console.log(error);
      navigate("/personality-test");
    }
  }

  const percent = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="processing fade-in">
      <h2>Analyzing Your Data</h2>
      <p className="muted">Please wait while we analyze your responses.</p>
      <div className="ring">{percent}%</div>

      <div style={{ maxWidth: 360, margin: "0 auto" }}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={"step-item" + (i < step ? " done" : i === step ? " active" : "")}
          >
            <div className="step-dot">{i <= step && <Check size={16} />}</div>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Processing;
