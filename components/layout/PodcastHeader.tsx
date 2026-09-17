'use client';

import Image from 'next/image';
import { useState } from 'react';

import styles from './PodcastHeader.module.css';

const spotifyUrl =
  'https://open.spotify.com/show/4MlsSTgEjZAUKhd9SsQ5tp';

export default function PodcastHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        {/* =================================================
            LOGO
        ================================================= */}

        <a
          href="#inicio"
          className={styles.logo}
          onClick={closeMenu}
          aria-label="Tercer Espacio - Inicio"
        >
          <Image
            src="/images/podcast/logo.svg"
            alt="Tercer Espacio Podcast"
            width={180}
            height={52}
            priority
            className={styles.logoImage}
          />
        </a>

        {/* =================================================
            DESKTOP NAV
        ================================================= */}

        <nav
          className={styles.desktopNav}
          aria-label="Navegación principal"
        >
          <a href="#episodios">
            Episodios
          </a>

          <a href="#podcast">
            Sobre el podcast
          </a>

          <a href="#temas">
            Temas
          </a>
        </nav>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className={`${styles.menuButton} ${
            menuOpen ? styles.menuOpen : ''
          }`}
          onClick={() =>
            setMenuOpen((value) => !value)
          }
          aria-label={
            menuOpen
              ? 'Cerrar menú'
              : 'Abrir menú'
          }
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>

      </div>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <div
        className={`${styles.mobileMenu} ${
          menuOpen
            ? styles.mobileMenuOpen
            : ''
        }`}
      >

        <a
          href="#episodios"
          onClick={closeMenu}
        >
          Episodios
        </a>

        <a
          href="#podcast"
          onClick={closeMenu}
        >
          Sobre el podcast
        </a>

        <a
          href="#temas"
          onClick={closeMenu}
        >
          Temas
        </a>

        <a
          href="#escuchar"
          onClick={closeMenu}
        >
          Escuchar
        </a>

      </div>
    </header>
  );
}