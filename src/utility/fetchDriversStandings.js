const fetchStandings = async () => {
  const response = await fetch(
    "https://api.openf1.org/v1/championship_drivers?meeting_key=latest&session_key=latest",
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch driver standings (${response.status})`);
  }
  const data = await response.json();
  if (data.length === 0) {
    throw new Error("No driver standings data available");
  }
  return data;
};

const getDriverPosition = (driverNumber, standings) => {
  if (!Array.isArray(standings)) return null;
  for (let standing of standings) {
    if (standing["driver_number"] == driverNumber) return standing;
  }
  return null;
};

export { fetchStandings, getDriverPosition };
