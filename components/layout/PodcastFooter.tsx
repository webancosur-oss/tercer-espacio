import styles from './PodcastFooter.module.css';

export default function PodcastFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.brand}>
          <strong>
            CONSTRUIR
          </strong>

          <span>
            PODCAST INMOBILIARIO
          </span>
        </div>

        <div className={styles.links}>
          <a href="#inicio">Inicio</a>
          <a href="#episodios">Episodios</a>
          <a href="#podcast">Podcast</a>
          <a href="#escuchar">Escuchar</a>
        </div>

        <div className={styles.copy}>
          © 2026 Construir Podcast
        </div>

      </div>
    </footer>
  );
}