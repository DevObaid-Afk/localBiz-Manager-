import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    api
      .get("/api/profile/me")
      .then((data) => setProfile(data))
      .catch((error) => toast.push(error.message, "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) {
    return (
      <div className="center-screen">
        <div className="loader-ring" />
      </div>
    );
  }

  return (
    <PageTransition>
      <section className="profile-grid">
        <div className="glass-card profile-card">
          <div className="avatar-ring">GI</div>
          <h1>{profile.user.username}</h1>
          <p>{profile.user.email}</p>
          <div className="stats-strip">
            <div>
              <span>Games</span>
              <strong>{profile.user.stats.gamesPlayed}</strong>
            </div>
            <div>
              <span>Wins</span>
              <strong>{profile.user.stats.wins}</strong>
            </div>
            <div>
              <span>Best Rank</span>
              <strong>{profile.user.stats.bestRank || "--"}</strong>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h2>Achievement Badges</h2>
          <div className="badge-grid">
            {profile.badges.map((badge) => (
              <div key={badge.title} className="badge-card">
                <strong>{badge.title}</strong>
                <p>{badge.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h2>Recent Daily Runs</h2>
          <div className="history-list">
            {profile.history.map((entry) => (
              <div key={entry.id} className="history-item">
                <div>
                  <strong>{entry.dateLabel}</strong>
                  <p>{entry.status.toUpperCase()}</p>
                </div>
                <div>
                  <span>{entry.wordLength} letters</span>
                  <span>{entry.attemptsUsed} tries</span>
                  <span>{entry.elapsedSeconds}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default ProfilePage;
