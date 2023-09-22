import classes from "./Balance.module.css";
import HistoryBalance from "./HistoryBalance/HistoryBalance";
import InfoBalance from "./InfoBalance/InfoBalance";
import WelcomeBalance from "./WelcomeBalance/WelcomeBalance";
import StatisticsBalance from "./StatisticsBalance/StatisticsBalance";

const Balance = () => {
  return (
    <div className={classes.Balance}>
      <WelcomeBalance />
      <InfoBalance />
      <StatisticsBalance />
      <HistoryBalance />
    </div>
  );
};

export default Balance;
