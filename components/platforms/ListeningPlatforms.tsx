import { FiArrowUpRight } from 'react-icons/fi';
import { SiSpotify } from 'react-icons/si';

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

        {/* =================================================
            INTRO
        ================================================= */}

        <div className={styles.heading}>

          <span className={styles.eyebrow}>
            ESCUCHA TERCER ESPACIO
          </span>

          <h2>
            Las conversaciones
            <br />
            <span>
              continúan en Spotify.
            </span>
          </h2>

          <p>
            Encuentra todos los episodios de Tercer Espacio
            y escucha nuestras conversaciones sobre
            inmobiliaria, inversión, arquitectura y ciudad.
          </p>

        </div>


        {/* =================================================
            SPOTIFY
        ================================================= */}

        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.spotifyCard}
          aria-label="Escuchar Tercer Espacio en Spotify"
        >

          {/* Spotify icon */}

          <div
            className={styles.spotifyIcon}
            aria-hidden="true"
          >
            <SiSpotify />
          </div>


          {/* Information */}

          <div className={styles.spotifyInfo}>

            <span className={styles.spotifyLabel}>
              DISPONIBLE EN
            </span>

            <strong>
              Spotify
            </strong>

            <span
              className={
                styles.spotifyDescription
              }
            >
              Escucha todos los episodios
              de Tercer Espacio
            </span>

          </div>


          {/* Action */}

          <div className={styles.spotifyAction}>

            <span>
              Escuchar podcast
            </span>

            {/* Real SVG arrow */}

            <FiArrowUpRight
              className={styles.arrow}
              aria-hidden="true"
            />

          </div>

        </a>

      </div>
    </section>
  );
}