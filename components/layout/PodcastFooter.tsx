import Image from 'next/image';

import styles from './PodcastFooter.module.css';

const spotifyUrl =
  'https://open.spotify.com/show/4MlsSTgEjZAUKhd9SsQ5tp';

export default function PodcastFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* TOP */}

        <div className={styles.top}>

          {/* BRAND */}

          <a
            href="#inicio"
            className={styles.brand}
            aria-label="Tercer Espacio - Inicio"
          >
            <Image
              src="/images/podcast/logo.svg"
              alt="Tercer Espacio Podcast"
              width={180}
              height={52}
              className={styles.logo}
            />
          </a>

          {/* DESCRIPTION */}

          <p className={styles.description}>
            Conversaciones sobre inmobiliaria,
            inversión, arquitectura y las
            ciudades que estamos construyendo.
          </p>

          {/* NAV */}

          <nav
            className={styles.links}
            aria-label="Navegación del footer"
          >
            <a href="#inicio">
              Inicio
            </a>

            <a href="#episodios">
              Episodios
            </a>

            <a href="#podcast">
              Podcast
            </a>

            <a href="#temas">
              Temas
            </a>

            <a href="#escuchar">
              Escuchar
            </a>
          </nav>

        </div>

        {/* BOTTOM */}

        <div className={styles.bottom}>

          <span className={styles.copy}>
            © 2026 Tercer Espacio Podcast
          </span>

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.spotify}
          >
            Escuchar en Spotify
          </a>

          <a
            href="#inicio"
            className={styles.backTop}
            aria-label="Volver al inicio"
          >
            <span>↑</span>
            Volver arriba
          </a>

        </div>

      </div>
    </footer>
  );
}