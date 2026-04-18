import drivers from "../drivers.json";

const getDriversFromTeamName = (teamName) => {
  let driversList = [];
  let teamColour = null;

  for (let driver of drivers) {
    if (driver.team_name == teamName) {
      driversList.push(driver.full_name);
      teamColour = driver.team_colour;
    }
  }

  return { driversList, teamColour };
};

const getDriverObjectsFromTeamName = (teamName) => {
  let driversList = [];
  let teamColour = null;

  for (let driver of drivers) {
    if (driver.team_name == teamName) {
      driversList.push(driver);
      teamColour = driver.team_colour;
    }
  }

  return { driversList, teamColour };
};

const getDriverFromFullName = (fullName) => {
  for (let driver of drivers) {
    if (driver.full_name == fullName) return driver
  }
}

export {getDriversFromTeamName, getDriverObjectsFromTeamName, getDriverFromFullName};
