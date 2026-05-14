const fetchStandings = async () => {
  try {
    const response = await fetch("https://api.openf1.org/v1/position?meeting_key=latest&session_key=latest");
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch(err) {
    return [];
  }
}

const getDriverPosition = (driverNumber, standings) => {
  if (!Array.isArray(standings)) return null 
  for (let standing of standings) {
    if (standing["driver_number"] == driverNumber) return standing
  }
  return null
}

export {fetchStandings, getDriverPosition}

