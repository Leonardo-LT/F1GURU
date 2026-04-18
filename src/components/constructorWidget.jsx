import { ConstructorsStandingsWidget } from "./driversWidget";

/**
 * Thin wrapper that pre-configures ConstructorsStandingsWidget.
 * Accepts an optional `gridClass` override prop.
 */
const ConstructorWidget = (props) => (
  <ConstructorsStandingsWidget gridClass={props.gridClass} />
);

export default ConstructorWidget;
