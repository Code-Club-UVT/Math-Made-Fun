import { Link } from "react-router-dom";
import styles from "./SimCard.module.css";

// Single gallery card: thumbnail + title, links out to the sim's own page
export default function SimCard({ id, title, thumbnail }) {
  return (
    <Link to={`/sims/${id}`} className={styles.card}>
      <img src={thumbnail} alt={title} className={styles.thumb} />
      <h3 className={styles.title}>{title}</h3>
    </Link>
  );
}
