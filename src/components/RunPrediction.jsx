import { useState, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { batting_options } from "../assets/options";

function RunPrediction() {
  // Memoize the batting_options to load only once
  const options = useMemo(() => batting_options, []);
  const [selected, setSelected] = useState({
    player_name: "",
    venue: "",
    against_team: "",
    match_format: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/predict-player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    })
      .then((response) => response.json())
      .then((data) => {
        setPrediction(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error during prediction:", error);
        setLoading(false);
      });
  };

  if (!options) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-black text-white">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
      <div>
        <h2 className="text-3xl font-bold mb-8">MATCH PARAMETERS</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              Player
            </label>
            <select
              value={selected.player_name}
              onChange={(e) =>
                setSelected({ ...selected, player_name: e.target.value })
              }
              className="w-full bg-black/50 border border-gray-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {options.players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              Venue
            </label>
            <select
              value={selected.venue}
              onChange={(e) =>
                setSelected({ ...selected, venue: e.target.value })
              }
              className="w-full bg-black/50 border border-gray-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {options.venues.map((venue) => (
                <option key={venue} value={venue}>
                  {venue}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              Opposition
            </label>
            <select
              value={selected.against_team}
              onChange={(e) =>
                setSelected({ ...selected, against_team: e.target.value })
              }
              className="w-full bg-black/50 border border-gray-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {options.against_teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              Match Format
            </label>
            <select
              value={selected.match_format}
              onChange={(e) =>
                setSelected({ ...selected, match_format: e.target.value })
              }
              className="w-full bg-black/50 border border-gray-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {options.match_formats.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-md transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              "PROCESSING..."
            ) : (
              <>
                PREDICT PERFORMANCE
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div>
        {prediction ? (
          <div className="border border-gray-700 bg-black/50 p-8 rounded-md">
            <h2 className="text-3xl font-bold mb-6">PREDICTION RESULT</h2>

            <div className="mb-8">
              <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                Player
              </div>
              <div className="text-2xl font-bold">{selected.player_name}</div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                  Venue
                </div>
                <div className="font-medium">{selected.venue}</div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                  Opposition
                </div>
                <div className="font-medium">{selected.against_team}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-yellow-500/10 p-6 rounded-md border border-yellow-500/30">
                <div className="text-sm uppercase tracking-wider text-gray-300 mb-2">
                  Predicted Score
                </div>
                <div className="text-4xl font-bold">
                  {prediction.predicted_score}
                </div>
              </div>

              <div className="bg-yellow-500/10 p-6 rounded-md border border-yellow-500/30">
                <div className="text-sm uppercase tracking-wider text-gray-300 mb-2">
                  Dismissal
                </div>
                <div className="text-xl font-bold">
                  {prediction.predicted_dismissal}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">PERFORMANCE INSIGHTS</h2>
            <p className="text-xl text-gray-300 mb-8">
              Our AI analyzes historical data to predict how a player will
              perform in specific match conditions.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-700 p-4 rounded-md">
                <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                  Accuracy
                </div>
                <div className="text-2xl font-bold">92%</div>
              </div>
              <div className="border border-gray-700 p-4 rounded-md">
                <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                  Data Points
                </div>
                <div className="text-2xl font-bold">10M+</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RunPrediction;
