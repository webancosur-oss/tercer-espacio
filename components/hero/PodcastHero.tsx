import Image from 'next/image';

import styles from './PodcastHero.module.css';

export default function PodcastHero() {
  return (
    <section
      id="inicio"
      className={styles.hero}
    >
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className={styles.pattern} />

      <div className={styles.glow} />

      {/* =================================================
          HERO CONTENT
      ================================================= */}

      <div className={styles.content}>

        <h1>
          Conversaciones que
          <br />
          <span>construyen.</span>
        </h1>

      </div>

      {/* =================================================
          SKYLINE
          Queda detrás del teléfono
      ================================================= */}

      <div className={styles.skyline}>

        <div className={`${styles.building} ${styles.b1}`} />
        <div className={`${styles.building} ${styles.b2}`} />
        <div className={`${styles.building} ${styles.b3}`} />
        <div className={`${styles.building} ${styles.b4}`} />
        <div className={`${styles.building} ${styles.b5}`} />
        <div className={`${styles.building} ${styles.b6}`} />
        <div className={`${styles.building} ${styles.b7}`} />
        <div className={`${styles.building} ${styles.b8}`} />
        <div className={`${styles.building} ${styles.b9}`} />
        <div className={`${styles.building} ${styles.b10}`} />
        <div className={`${styles.building} ${styles.b11}`} />
        <div className={`${styles.building} ${styles.b12}`} />
        <div className={`${styles.building} ${styles.b13}`} />
        <div className={`${styles.building} ${styles.b14}`} />
        <div className={`${styles.building} ${styles.b15}`} />
        <div className={`${styles.building} ${styles.b16}`} />

      </div>

      {/* =================================================
          WHITE BOTTOM AREA
      ================================================= */}

      <div className={styles.lightArea} />

      {/* =================================================
          IPHONE
          Queda por encima del skyline y de la zona blanca
      ================================================= */}

      <div className={styles.phoneStage}>

        <div className={styles.phone}>

          {/* Physical buttons */}

          <span className={styles.volumeOne} />
          <span className={styles.volumeTwo} />
          <span className={styles.volumeThree} />

          <span className={styles.powerButton} />

          {/* Phone display */}

          <div className={styles.phoneScreen}>

            <Image
              src="/images/podcast/hero/podcast-mobile.png"
              alt="Tercer Espacio Podcast"
              width={260}
              height={560}
              priority
              className={styles.screenImage}
              sizes="
                (max-width: 340px) 145px,
                (max-width: 400px) 165px,
                (max-width: 700px) 185px,
                (max-width: 950px) 215px,
                260px
              "
            />

          </div>

        </div>

      </div>

      {/* =================================================
          SCROLL
      ================================================= */}

      <div className={styles.scroll}>

        <span>SCROLL</span>

        <i />

      </div>

    </section>
  );
}