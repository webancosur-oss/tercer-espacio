import Image from 'next/image';

import styles from './PodcastFooter.module.css';

export default function PodcastFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* =================================================
            BRAND
        ================================================= */}

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


        {/* =================================================
            LINKS
        ================================================= */}

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

          <a href="#escuchar">
            Escuchar
          </a>
        </nav>


        {/* =================================================
            COPYRIGHT
        ================================================= */}

        <div className={styles.copy}>
          © 2026 Tercer Espacio Podcast
        </div>

      </div>
    </footer>
  );
}