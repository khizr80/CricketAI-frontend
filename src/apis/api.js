import axios from "axios";

export const predictBowlingPerformance = async (
  bowlerName,
  againstTeam,
  matchFormat
) => {
  try {
    const response = await axios.post(
      "https://cricket-ai-backend.onrender.com/predict-bowling-performance",
      {
        bowler: bowlerName,
        opponent: againstTeam,
        matchType: matchFormat,
      }
    );
    console.log("res: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error predicting bowling performance:", error);
  }
};
