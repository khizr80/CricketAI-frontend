import { useState, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { predictBowlingPerformance } from "../apis/api";

function BowlingPrediction() {
  const [bowlerName, setBowlerName] = useState("");
  const [againstTeam, setAgainstTeam] = useState("");
  const [matchFormat, setMatchFormat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [bowlerList, setBowlerList] = useState([]);
  const [teamList, setTeamList] = useState([]);

  // Fetch unique bowlers and teams from the data.json file
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("bowlersData/data.json");
        const data = await response.json();
        setBowlerList(data[0]); // First index: bowlers
        setTeamList(data[1]); // Second index: opponents
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Memoize bowlerList and teamList
  const memoizedBowlerList = useMemo(() => bowlerList, [bowlerList]);
  const memoizedTeamList = useMemo(() => teamList, [teamList]);
  const matchFormats = useMemo(() => ["T20", "ODI", "Test"], []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bowlerName || !againstTeam || !matchFormat) return;

    setIsLoading(true);
    try {
      const response = await predictBowlingPerformance(
        bowlerName,
        againstTeam,
        matchFormat
      );
      if (response) {
        setResults(response); // Update state with actual API response
      } else {
        alert("Error occurred while fetching prediction data.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setBowlerName("");
    setAgainstTeam("");
    setMatchFormat("");
    setResults(null);
  };

  if (!memoizedBowlerList || !memoizedTeamList) {
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
              Bowler
            </label>
            <select
              value={bowlerName}
              onChange={(e) => setBowlerName(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            >
              <option value="" disabled>
                Select Bowler
              </option>
              {memoizedBowlerList.map((bowler, index) => (
                <option key={index} value={bowler}>
                  {bowler}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              Opposition
            </label>
            <select
              value={againstTeam}
              onChange={(e) => setAgainstTeam(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            >
              <option value="" disabled>
                Select Opposition
              </option>
              {memoizedTeamList.map((team, index) => (
                <option key={index} value={team}>
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
              value={matchFormat}
              onChange={(e) => setMatchFormat(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            >
              <option value="" disabled>
                Select Match Format
              </option>
              {matchFormats.map((format, index) => (
                <option key={index} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !bowlerName || !againstTeam || !matchFormat}
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-md transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
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
        {results ? (
          <div className="border border-gray-700 bg-black/50 p-8 rounded-md">
            <h2 className="text-3xl font-bold mb-6">PREDICTION RESULT</h2>

            <div className="mb-8">
              <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                Bowler
              </div>
              <div className="text-2xl font-bold">{results.bowler}</div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                  Opponent
                </div>
                <div className="font-medium">{results.opponent}</div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">
                  Match Type
                </div>
                <div className="font-medium">{results.matchType}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-yellow-500/10 p-6 rounded-md border border-yellow-500/30">
                <div className="text-sm uppercase tracking-wider text-gray-300 mb-2">
                  Overs Bowled
                </div>
                <div className="text-4xl font-bold">{results.oversBowled}</div>
              </div>

              <div className="bg-yellow-500/10 p-6 rounded-md border border-yellow-500/30">
                <div className="text-sm uppercase tracking-wider text-gray-300 mb-2">
                  Runs Conceded
                </div>
                <div className="text-4xl font-bold">{results.runsConceded}</div>
              </div>

              <div className="bg-yellow-500/10 p-6 rounded-md border border-yellow-500/30">
                <div className="text-sm uppercase tracking-wider text-gray-300 mb-2">
                  Economy Rate
                </div>
                <div className="text-4xl font-bold">{results.economyRate}</div>
              </div>

              <div className="bg-yellow-500/10 p-6 rounded-md border border-yellow-500/30">
                <div className="text-sm uppercase tracking-wider text-gray-300 mb-2">
                  Wickets Taken
                </div>
                <div className="text-4xl font-bold">{results.wicketsTaken}</div>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 px-6 rounded-md transition duration-200"
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">PERFORMANCE INSIGHTS</h2>
            <p className="text-xl text-gray-300 mb-8">
              Our AI analyzes historical data to predict how a bowler will
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

export default BowlingPrediction;
