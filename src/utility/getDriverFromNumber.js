import drivers from "../drivers.json";

const getDriverFromNumber = (driverNumber) => {
  for (let i = 0; i < drivers.length; i++) {
    const driver = drivers[i]
    if (driver.driver_number == driverNumber) {
      return driver
    }
  }

  return {}
} 

export default getDriverFromNumber