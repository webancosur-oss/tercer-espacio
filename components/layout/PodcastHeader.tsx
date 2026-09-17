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

  const toggleMenu = () => {
    setMenuOpen((value) => !value);
  };

  return (
    <header
      className={`${styles.header} ${
        menuOpen ? styles.headerOpen : ''
      }`}
    >
      <div className={styles.container}>

        {/* LOGO */}

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

        {/* NAVEGACIÓN DESKTOP */}

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

        {/* PLATAFORMA */}

        <div className={styles.platforms}>
          <span className={styles.listenLabel}>
            Escúchanos
          </span>

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.platform}
            aria-label="Escuchar Tercer Espacio en Spotify"
          >
            <span>SP</span>
          </a>
        </div>

        {/* MENU MOBILE */}

        <button
          type="button"
          className={`${styles.menuButton} ${
            menuOpen
              ? styles.menuOpen
              : ''
          }`}
          onClick={toggleMenu}
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

      {/* MENU MOBILE */}

      <div
        className={`${styles.mobileMenu} ${
          menuOpen
            ? styles.mobileMenuOpen
            : ''
        }`}
      >
        <nav
          className={styles.mobileNav}
          aria-label="Navegación móvil"
        >
          <a
            href="#inicio"
            onClick={closeMenu}
          >
            Inicio
          </a>

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

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className={styles.mobileSpotify}
          >
            Escuchar en Spotify
          </a>
        </nav>
      </div>
    </header>
  );
}