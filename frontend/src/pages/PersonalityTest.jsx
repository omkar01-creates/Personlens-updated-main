import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const OPTIONS = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"];

function PersonalityTest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuestions();
  }, []);

  async function getQuestions() {
    try {
      const res = await API.get("/personality/questions");
      setQuestions(res.data.questions);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  function selectOption(option) {
    const q = questions[current];
    setAnswers({ ...answers, [q.id]: option });
  }

  function next() {
    if (current < questions.length - 1) setCurrent(current + 1);
  }

  function prev() {
    if (current > 0) setCurrent(current - 1);
  }

  function submit() {
    // Build the answers array the API expects.
    const answerList = questions.map((q) => ({ id: q.id, answer: answers[q.id] }));
    navigate("/processing", { state: { answers: answerList } });
  }

  if (loading) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  const question = questions[current];
  const progress = Math.round(((current + 1) / questions.length) * 100);
  const selected = answers[question.id];
  const isLast = current === questions.length - 1;
  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <div className="test-wrap fade-in">
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>Personality Test</h2>
        <div className="q-meta">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: progress + "%" }}></div>
        </div>

        <div className="q-text" data-testid="question-text">{question.text}</div>

        {OPTIONS.map((option) => (
          <div
            key={option}
            className={"option" + (selected === option ? " selected" : "")}
            onClick={() => selectOption(option)}
            data-testid={"option-" + option.toLowerCase().replace(/ /g, "-")}
          >
            <div className="radio"></div>
            {option}
          </div>
        ))}

        <div className="test-actions">
          <button className="btn btn-outline" onClick={prev} disabled={current === 0} data-testid="prev-btn">
            Previous
          </button>
          {isLast ? (
            <button className="btn btn-primary" onClick={submit} disabled={!allAnswered} data-testid="submit-btn">
              Submit
            </button>
          ) : (
            <button className="btn btn-primary" onClick={next} disabled={!selected} data-testid="next-btn">
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalityTest;
