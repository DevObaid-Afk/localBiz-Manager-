import { useEffect, useMemo, useState } from "react";
import PageTransition from "../components/PageTransition";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";

const ranges = ["daily", "weekly", "all-time"];

function LeaderboardPage() {
  const [range, setRange] = useState("daily");
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/leaderboard?range=${range}`)
      .then((response) => setData(response.entries))
      .catch((error) => toast.push(error.message, "error"))
      .finally(() => setLoading(false));
  }, [range, toast]);

  const filtered = useMemo(
    () => data.filter((entry) => entry.username.toLowerCase().includes(query.toLowerCase())),
    [data, query]
  );

  return (
    <PageTransition>
      <section className="glass-card leaderboard-shell">
        <div className="leaderboard-header">
          <div>
            <p className="eyebrow">Competitive Standings</p>
            <h1>Leaderboard</h1>
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search player" />
        </div>

        <div className="pill-row">
          {ranges.map((item) => (
            <button key={item} className={`pill-button ${range === item ? "active" : ""}`} onClick={() => setRange(item)}>
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="center-inline">
            <div className="loader-ring" />
          </div>
        ) : (
          <div className="leaderboard-list">
            {filtered.map((entry, index) => (
              <article key={entry.userId} className={`leader-card leader-card--${index < 3 ? index + 1 : "default"}`}>
                <div>
                  <span className="leader-rank">#{index + 1}</span>
                  <strong>{entry.username}</strong>
                </div>
                <div className="leader-metrics">
                  <span>{entry.avgAttempts.toFixed(1)} avg tries</span>
                  <span>{entry.bestTime}s best time</span>
                  <span>{entry.wins} wins</span>
                  <span>{entry.currentStreak} streak</span>
                </div>
              </article>
            ))}
            {!filtered.length && (
              <div className="empty-state">
                <h3>No players match that search</h3>
                <p>Try a different username fragment or switch leaderboard ranges.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </PageTransition>
  );
}

export default LeaderboardPage;
