import { useNavigate } from "react-router-dom";
import {
  Eye,
  Mic,
  Brain,
  TrendingUp,
  Check,
  ShieldCheck,
  Sparkles,
  BarChart3,
} from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-logo">
          <Eye size={24} />
          PersonLens
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#how">How it Works</a>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/register")}
            data-testid="nav-get-started"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">

        <div>
          <span className="tag">
            <Sparkles
              size={12}
              style={{
                marginRight: 4,
                display: "inline",
              }}
            />
            AI Powered
          </span>

          <h1>
            Discover the <span>Real You</span>
          </h1>

          <p className="lead">
            AI Personality & Voice Clarity Analyzer
          </p>

          <p>
            Analyze your personality, communication style and voice clarity
            with advanced AI. Understand yourself better and grow every day.
          </p>

          <div className="hero-btns">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/register")}
              data-testid="hero-get-started"
            >
              Get Started
            </button>

            <a href="#features" className="btn btn-outline">
              Learn More
            </a>
          </div>

          <div className="stats-row">

            <div className="stat-mini">
              <div
                className="feature-icon"
                style={{
                  margin: 0,
                  width: 42,
                  height: 42,
                }}
              >
                <Brain size={20} />
              </div>

              <div>
                <div className="num">16</div>
                <div className="lbl">MBTI Types</div>
              </div>
            </div>

            <div className="stat-mini">
              <div
                className="feature-icon"
                style={{
                  margin: 0,
                  width: 42,
                  height: 42,
                }}
              >
                <Sparkles size={20} />
              </div>

              <div>
                <div className="num">AI</div>
                <div className="lbl">Powered</div>
              </div>
            </div>

            <div className="stat-mini">
              <div
                className="feature-icon"
                style={{
                  margin: 0,
                  width: 42,
                  height: 42,
                }}
              >
                <ShieldCheck size={20} />
              </div>

              <div>
                <div className="num">100%</div>
                <div className="lbl">Private</div>
              </div>
            </div>

          </div>
        </div>

        {/* Hero Image */}
        <div
          className="hero-art"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            background: "transparent",
          }}
        >

          <img
            src="/personlens-hero.png"
            alt="PersonLens Personality Analysis"
            style={{
              width: "380px",
              height: "380px",
              objectFit: "contain",
              display: "block",
              maxWidth: "100%",
              background: "transparent",
            }}
          />

          {/* Microphone Floating Icon */}
          <div
            className="float-badge"
            style={{
              position: "absolute",
              top: "30px",
              right: "30px",
            }}
          >
            <Mic size={22} />
          </div>

          {/* Growth Floating Icon */}
          <div
            className="float-badge"
            style={{
              position: "absolute",
              bottom: "30px",
              left: "30px",
            }}
          >
            <TrendingUp size={22} />
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">

        <h2 className="section-title">
          Powerful Features
        </h2>

        <p className="section-sub">
          Everything you need to understand and improve yourself
        </p>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <Brain size={26} />
            </div>

            <h3>
              Personality Analysis
            </h3>

            <p>
              Take an MBTI-style test and discover your personality type
              along with your strengths and weaknesses.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Mic size={26} />
            </div>

            <h3>
              Voice Clarity Analyzer
            </h3>

            <p>
              Record your voice and get insights on your speaking clarity
              and communication skills.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={26} />
            </div>

            <h3>
              Self Development
            </h3>

            <p>
              Track your growth over time and get personalised improvement
              areas to become your best self.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section
        className="section"
        id="how"
        style={{
          background: "#faf9ff",
        }}
      >

        <h2 className="section-title">
          How It Works
        </h2>

        <p className="section-sub">
          Get started in four simple steps
        </p>

        <div className="steps-grid">

          {[
            {
              n: 1,
              t: "Create Account",
              d: "Sign up for free in seconds.",
            },
            {
              n: 2,
              t: "Take the Test",
              d: "Answer simple personality questions.",
            },
            {
              n: 3,
              t: "Get Your Report",
              d: "See your detailed personality report.",
            },
            {
              n: 4,
              t: "Grow",
              d: "Track progress and improve over time.",
            },
          ].map((s) => (

            <div
              className="feature-card center"
              key={s.n}
            >
              <div className="step-num">
                {s.n}
              </div>

              <h3>
                {s.t}
              </h3>

              <p>
                {s.d}
              </p>
            </div>

          ))}

        </div>
      </section>

      {/* Personality Analysis */}
      <section
        className="section split"
        id="about"
      >

        <div>

          <span className="tag">
            Personality Analysis
          </span>

          <h2
            className="section-title"
            style={{
              textAlign: "left",
              marginTop: 12,
            }}
          >
            Understand Your True Self
          </h2>

          <p className="muted">
            Our MBTI-based test reveals how you think, decide and interact
            with the world.
          </p>

          <ul className="check-list">

            <li>
              <Check size={18} />
              Discover your 4-letter personality type
            </li>

            <li>
              <Check size={18} />
              Learn your key strengths and weaknesses
            </li>

            <li>
              <Check size={18} />
              Understand your communication style
            </li>

            <li>
              <Check size={18} />
              Get personalised improvement areas
            </li>

          </ul>

        </div>

        <div
          className="hero-art"
          style={{
            minHeight: 280,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <img
            src="/personlens-hero.png"
            alt="Personality Analysis"
            style={{
              width: "280px",
              height: "280px",
              objectFit: "contain",
              display: "block",
            }}
          />

        </div>

      </section>

      {/* Voice Analysis */}
      <section
        className="section split"
        style={{
          background: "#faf9ff",
        }}
      >

        <div
          className="hero-art"
          style={{
            minHeight: 280,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <img
            src="/personlens-hero.png"
            alt="Voice Analysis"
            style={{
              width: "280px",
              height: "280px",
              objectFit: "contain",
              display: "block",
            }}
          />

        </div>

        <div>

          <span className="tag">
            Voice Analysis
          </span>

          <h2
            className="section-title"
            style={{
              textAlign: "left",
              marginTop: 12,
            }}
          >
            Improve Your Communication
          </h2>

          <p className="muted">
            Record your voice and receive feedback about your clarity
            and confidence.
          </p>

          <ul className="check-list">

            <li>
              <Check size={18} />
              Measure your speaking clarity
            </li>

            <li>
              <Check size={18} />
              Track your communication score
            </li>

            <li>
              <Check size={18} />
              Practise with guided topics
            </li>

            <li>
              <Check size={18} />
              Build confidence over time
            </li>

          </ul>

        </div>

      </section>

      {/* Self Development */}
      <section className="section">

        <h2 className="section-title">
          Grow Every Day
        </h2>

        <p className="section-sub">
          PersonLens learns from your results to help you improve
        </p>

        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              <BarChart3 size={26} />
            </div>

            <h3>
              Track Progress
            </h3>

            <p>
              See how your personality and voice scores change over time.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              <TrendingUp size={26} />
            </div>

            <h3>
              Personalised Insights
            </h3>

            <p>
              Receive improvement areas based on your own analysis history.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              <ShieldCheck size={26} />
            </div>

            <h3>
              Private & Secure
            </h3>

            <p>
              Your data stays yours. Only you can see your personal reports.
            </p>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta">

        <h2>
          Ready to Discover the Real You?
        </h2>

        <p>
          Join PersonLens today and start your journey of self-discovery.
        </p>

        <button
          className="btn"
          style={{
            background: "#fff",
            color: "var(--purple)",
          }}
          onClick={() => navigate("/register")}
          data-testid="cta-get-started"
        >
          Get Started Free
        </button>

      </section>

      {/* Footer */}
      <footer className="footer">

        <div className="nav-logo">
          <Eye size={22} />
          PersonLens
        </div>

        <p
          className="muted"
          style={{
            color: "#9aa0b5",
          }}
        >
          AI Personality & Voice Clarity Analyzer
        </p>

        <p
          className="muted"
          style={{
            color: "#9aa0b5",
          }}
        >
          &copy; {new Date().getFullYear()} PersonLens.
          All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Landing;