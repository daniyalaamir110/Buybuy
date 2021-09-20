import styles from "./Loading.module.css";
import loading from "../images/loading.svg"

const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingIcon}>
        <img src={loading} alt="loading" />
      </div>
    </div>
  );
}

export default Loading;
