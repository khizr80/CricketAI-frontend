import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

function WinnerPrediction() {
  const [options, setOptions] = useState(null);
  const [selected, setSelected] = useState({
    team1: "",
    team2: "",
    toss_winner: "",
    toss_decision: "",
    venue: "",
    tournament_match: "No",
    test_match: "No",
  });
  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const files = [
          { key: "teams", path: "/match_prediction/teams.txt" },
          { key: "venues", path: "/match_prediction/venues.txt" },
          {
            key: "toss_decisions",
            path: "/match_prediction/toss_decisions.txt",
          },
        ];

        const opts = {};
        for (let { key, path } of files) {
          const res = await fetch(path);
          if (!res.ok)
            throw new Error(`Could not load ${path}: HTTP ${res.status}`);
          const text = await res.text();
          try {
            opts[key] = JSON.parse(text);
          } catch {
            // Fallback for plain text (e.g., one item per line)
            opts[key] = text
              .trim()
              .split("\n")
              .filter((line) => line.length > 0);
            if (opts[key].length === 0)
              throw new Error(`No valid data in ${path}`);
          }
        }

        opts.tournament = ["Yes", "No"];
        opts.test = ["Yes", "No"];

        setOptions(opts);
        setSelected({
          team1: opts.teams[0] || "",
          team2: opts.teams[1] || opts.teams[0] || "",
          toss_winner: opts.teams[0] || "",
          toss_decision: opts.toss_decisions[0] || "",
          venue: opts.venues[0] || "",
          tournament_match: "No",
          test_match: "No",
        });
      } catch (err) {
        console.error("Error loading options:", err);
        setLoadError(err.message);
      }
    }

    loadOptions();
  }, []);

  const handlePredict = async () => {
    const input_data = {
      team: selected.team1,
      opponent: selected.team2,
      venue: selected.venue,
      is_test_match: selected.test_match === "Yes" ? 1 : 0,
      toss_winner: selected.toss_winner === selected.team1 ? 1 : 2,
      toss_decision_field: selected.toss_decision === "field" ? 1 : 0,
      is_tournament_match: selected.tournament_match === "Yes" ? 1 : 0,
    };

    console.log("Sending payload:", JSON.stringify(input_data, null, 2));

    setLoading(true);
    setPrediction(null);
    setProbability(null);
    setLoadError("");

    try {
      const res = await fetch(
        "https://match-predict-backend.onrender.com/predict-match-winner",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input_data),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Fetch error: ${res.status} - ${errorText}`);
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }
      const result = await res.json();
      console.log("Response received:", result);
      setPrediction(result.predicted_winner);
      setProbability((result.win_probability * 100).toFixed(1));
    } catch (error) {
      console.error("Prediction error:", error.message);
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadError) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-black text-red-500">
        <p className="mb-4">Error:</p>
        <pre className="text-sm">{loadError}</pre>
      </div>
    );
  }

  if (!options) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-black text-white">
        <div className="text-2xl font-bold">Loading options…</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 text-white">
      {/* Left: Form */}
      <div>
        <h2 className="text-3xl font-bold mb-8">MATCH PARAMETERS</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm uppercase mb-2">Team 1</label>
              <select
                value={selected.team1}
                onChange={(e) =>
                  setSelected({ ...selected, team1: e.target.value })
                }
                className="w-full bg-black/50 border border-gray-700 py-3 px-4 rounded-md"
              >
                {options.teams.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm uppercase mb-2">Team 2</label>
              <select
                value={selected.team2}
                onChange={(e) =>
                  setSelected({ ...selected, team2: e.target.value })
                }
                className="w-full bg-black/50 border border-gray-700 py-3 px-4 rounded-md"
              >
                {options.teams.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm uppercase mb-2">
                Toss Winner
              </label>
              <select
                value={selected.toss_winner}
                onChange={(e) =>
                  setSelected({ ...selected, toss_winner: e.target.value })
                }
                className="w-full bg-black/50 border border-gray-700 py-3 px-4 rounded-md"
              >
                {[selected.team1, selected.team2].filter(Boolean).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm uppercase mb-2">
                Toss Decision
              </label>
              <select
                value={selected.toss_decision}
                onChange={(e) =>
                  setSelected({ ...selected, toss_decision: e.target.value })
                }
                className="w-full bg-black/50 border border-gray-700 py-3 px-4 rounded-md"
              >
                {options.toss_decisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm uppercase mb-2">Venue</label>
            <select
              value={selected.venue}
              onChange={(e) =>
                setSelected({ ...selected, venue: e.target.value })
              }
              className="w-full bg-black/50 border border-gray-700 py-3 px-4 rounded-md"
            >
              {options.venues.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm uppercase mb-2">
                Tournament Match
              </label>
              <select
                value={selected.tournament_match}
                onChange={(e) =>
                  setSelected({ ...selected, tournament_match: e.target.value })
                }
                className="w-full bg-black/50 border border-gray-700 py-3 px-4 rounded-md"
              >
                {options.tournament.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm uppercase mb-2">Test Match</label>
              <select
                value={selected.test_match}
                onChange={(e) =>
                  setSelected({ ...selected, test_match: e.target.value })
                }
                className="w-full bg-black/50 border border-gray-700 py-3 px-4 rounded-md"
              >
                {options.test.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handlePredict}
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-md flex items-center justify-center"
          >
            {loading ? (
              "PROCESSING..."
            ) : (
              <>
                PREDICT WINNER
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>

          {loading && <p className="text-yellow-400 mt-2">Predicting...</p>}
        </div>
      </div>

      {/* Right: Results */}
      <div>
        {prediction ? (
          <div className="space-y-6">
            <div className="border border-gray-700 bg-black/50 p-8 rounded-md">
              <h2 className="text-3xl font-bold mb-4">PREDICTION RESULT</h2>
              <p className="text-xl">
                <strong>Winner:</strong>{" "}
                <span className="text-yellow-400">{prediction}</span>
              </p>
            </div>

            {probability && (
              <div className="border border-gray-700 bg-black/50 p-8 rounded-md">
                <h2 className="text-3xl font-bold mb-4">CONFIDENCE</h2>
                <p className="text-xl">
                  {probability}% chance that <strong>{prediction}</strong> wins.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">WINNER INSIGHT</h2>
            <p className="text-xl text-gray-300">
              Our AI predicts the winning team based on match context.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WinnerPrediction;
