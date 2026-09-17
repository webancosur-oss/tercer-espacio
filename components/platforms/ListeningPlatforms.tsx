import styles from './ListeningPlatforms.module.css';

const spotifyUrl =
  'https://open.spotify.com/show/4MlsSTgEjZAUKhd9SsQ5tp';

export default function ListeningPlatforms() {
  return (
    <section
      id="escuchar"
      className={styles.section}
    >
      <div className={styles.container}>

        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            ESCUCHA TERCER ESPACIO
          </span>

          <h2>
            Una conversación
            <br />
            <span>para cada momento.</span>
          </h2>

          <p>
            Encuentra nuestros episodios y acompáñanos a
            conversar sobre inmobiliaria, inversión, ciudad,
            arquitectura y todo lo que ocurre entre ellas.
          </p>
        </div>

        <div className={styles.platformGrid}>

          {/* SPOTIFY — DISPONIBLE */}
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.platform} ${styles.spotify}`}
          >
            <div className={styles.platformTop}>
              <span className={styles.platformIcon}>
                SP
              </span>

              <span className={styles.external}>
                ↗
              </span>
            </div>

            <div className={styles.platformInfo}>
              <strong>
                Spotify
              </strong>

              <span>
                Escuchar el podcast
              </span>
            </div>
          </a>

          {/* APPLE PODCASTS — PRÓXIMAMENTE */}
          <div
            className={`${styles.platform} ${styles.disabled}`}
            aria-disabled="true"
          >
            <div className={styles.platformTop}>
              <span className={styles.platformIcon}>
                AP
              </span>

              <span className={styles.external}>
                ↗
              </span>
            </div>

            <div className={styles.platformInfo}>
              <strong>
                Apple Podcasts
              </strong>

              <span>
                Próximamente
              </span>
            </div>
          </div>

          {/* YOUTUBE — PRÓXIMAMENTE */}
          <div
            className={`${styles.platform} ${styles.disabled}`}
            aria-disabled="true"
          >
            <div className={styles.platformTop}>
              <span className={styles.platformIcon}>
                YT
              </span>

              <span className={styles.external}>
                ↗
              </span>
            </div>

            <div className={styles.platformInfo}>
              <strong>
                YouTube
              </strong>

              <span>
                Próximamente
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}