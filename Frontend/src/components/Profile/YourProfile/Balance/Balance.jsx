import HistoryBalance from "./HistoryBalance/HistoryBalance";
import InfoBalance from "./InfoBalance/InfoBalance";
import WelcomeBalance from "./WelcomeBalance/WelcomeBalance";
import StatisticsBalance from "./StatisticsBalance/StatisticsBalance";

const Balance = () => {
  return (
    <div style={{ margin: "3.5em 0" }}>
      <WelcomeBalance />
      <InfoBalance />
      <StatisticsBalance />
      <HistoryBalance />
    </div>
  );
};

export default Balance;
