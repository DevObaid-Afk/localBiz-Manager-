import { useEffect, useMemo, useState } from "react";
import Confetti from "react-confetti";
import PageTransition from "../components/PageTransition";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";
import { sound } from "../utils/sound";

function GameplayPage() {
  const [session, setSession] = useState(null);
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api
      .get("/api/game/active")
      .then((data) => setSession(data.session))
      .catch((error) => toast.push(error.message, "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const isComplete = session?.status === "won" || session?.status === "lost";
  const wordLength = session?.wordLength || 0;

  const latestGuess = useMemo(() => {
    if (!session?.guesses?.length) {
      return null;
    }

    return session.guesses[session.guesses.length - 1];
  }, [session]);

  async function submitGuess(event) {
    event.preventDefault();
    if (!guess.trim()) {
      toast.push("Enter a guess first.", "error");
      return;
    }

    setSubmitting(true);

    try {
      const data = await api.post("/game/guess", {
        sessionId: session._id,
        guess
      });

      setSession(data.session);
      setGuess("");

      if (data.session.status === "won") {
        sound.success();
        toast.push("Perfect. Daily challenge cleared.", "success");
      } else if (data.session.status === "lost") {
        sound.error();
        toast.push("Attempts exhausted. Try again tomorrow.", "error");
      } else {
        sound.click();
        toast.push("Guess submitted.", "info");
      }
    } catch (error) {
      sound.error();
      toast.push(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function requestHint() {
    setHintLoading(true);
    try {
      const data = await api.post("/game/hint", { sessionId: session._id });
      setSession(data.session);
      toast.push(`Hint unlocked: ${data.latestHint.label}`, "success");
    } catch (error) {
      toast.push(error.message, "error");
    } finally {
      setHintLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="center-screen">
        <div className="loader-ring" />
      </div>
    );
  }

  if (!session) {
    return (
      <PageTransition>
        <div className="glass-card empty-state">
          <h2>No active session found</h2>
          <p>Launch today’s challenge from the dashboard to start playing.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {session.status === "won" && <Confetti recycle={false} numberOfPieces={180} />}
      <section className="gameplay-shell">
        <div className="glass-card gameplay-header">
          <div>
            <p className="eyebrow">Live Challenge</p>
            <h1>{session.challengeDateLabel}</h1>
          </div>
          <div className="stats-strip compact">
            <div>
              <span>Attempts Left</span>
              <strong>{session.attemptsAllowed - session.guesses.length}</strong>
            </div>
            <div>
              <span>Hints Used</span>
              <strong>{session.hintsUsed.length}/2</strong>
            </div>
            <div>
              <span>Word Size</span>
              <strong>{session.wordLength}</strong>
            </div>
          </div>
        </div>

        <div className="glass-card gameplay-panel">
          <div className="slot-row">
            {Array.from({ length: wordLength }).map((_, index) => (
              <div key={index} className={`slot ${latestGuess?.feedback?.[index]?.state || ""}`}>
                {isComplete && session.status === "won" ? session.answer[index] : latestGuess?.guess?.[index] || "?"}
              </div>
            ))}
          </div>

          <form className="guess-form" onSubmit={submitGuess}>
            <input
              value={guess}
              onChange={(event) => setGuess(event.target.value.toUpperCase())}
              placeholder={`Enter a ${wordLength}-letter guess`}
              maxLength={wordLength}
              disabled={isComplete}
            />
            <button type="submit" className="button-primary" disabled={submitting || isComplete}>
              {submitting ? "Checking..." : "Submit Guess"}
            </button>
          </form>

          <div className="hint-bar">
            <div>
              <strong>Minimal Hints</strong>
              <p>Only two hint drops are available to keep the board competitive.</p>
            </div>
            <button className="button-secondary" onClick={requestHint} disabled={hintLoading || isComplete || session.hintsUsed.length >= 2}>
              {hintLoading ? "Unlocking..." : "Use Hint"}
            </button>
          </div>

          {!!session.hintsUsed.length && (
            <div className="hint-list">
              {session.hintsUsed.map((hint) => (
                <div key={hint.key} className="hint-chip">
                  <span>{hint.label}</span>
                  <strong>{hint.value}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="guess-history">
            {session.guesses.map((entry, index) => (
              <div key={`${entry.guess}-${index}`} className={`guess-row ${index === session.guesses.length - 1 ? "active" : ""}`}>
                <div className="guess-row__word">{entry.guess}</div>
                <div className="guess-row__feedback">
                  {entry.feedback.map((item, feedbackIndex) => (
                    <span key={`${item.letter}-${feedbackIndex}`} className={`slot slot--mini ${item.state}`}>
                      {item.letter}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isComplete && (
          <div className={`result-overlay ${session.status === "won" ? "win" : "lose"}`}>
            <div className="glass-card result-card">
              <h2>{session.status === "won" ? "Victory Locked In" : "Challenge Lost"}</h2>
              <p>
                {session.status === "won"
                  ? `You solved ${session.answer} in ${session.guesses.length} attempts.`
                  : `The answer was ${session.answer}. New challenge arrives tomorrow.`}
              </p>
              <div className="result-meta">
                <span>Time: {session.elapsedSeconds}s</span>
                <span>Hints: {session.hintsUsed.length}</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageTransition>
  );
}

export default GameplayPage;
