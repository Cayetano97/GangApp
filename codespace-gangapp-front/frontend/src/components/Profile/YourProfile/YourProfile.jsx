import classes from "./YourProfile.module.css";
import Balance from "./Balance/Balance";

const YourProfile = () => {
  return (
    <>
      <div className={classes.yourProfile}>
        <Balance />
      </div>
    </>
  );
};

export default YourProfile;
