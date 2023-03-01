import { motion } from "framer-motion";
import styles, { animationDuration } from "../styles/introduction.module.scss";

const beginningDelay = 1;
const introDelay = 2;

export default function _() {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <motion.div
          className={styles.intro}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: parseFloat(animationDuration.replace("s", "")),
            delay: beginningDelay,
            ease: "easeOut",
          }}
        >
          <h4>Introducing</h4>
        </motion.div>
        <motion.div
          className={styles.name}
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: "0%" }}
          transition={{
            duration: parseFloat(animationDuration.replace("s", "")),
            delay: introDelay,
            ease: "easeOut",
          }}
        >
          <h1>Jeve Stobs</h1>
        </motion.div>
      </div>
    </div>
  );
}
