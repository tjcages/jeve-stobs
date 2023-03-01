import "../styles/globals.css";
import styles from "../styles/_main.module.scss";

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.main}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
