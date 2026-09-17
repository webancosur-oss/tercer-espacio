import styles from './PodcastCTA.module.css';

export default function PodcastCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.pattern} />

      <div className={styles.container}>

        <span className={styles.eyebrow}>
          NUEVAS CONVERSACIONES
        </span>

        <h2>
          Sigamos
          <br />
          <span>construyendo.</span>
        </h2>

        <p>
          Escucha nuevos episodios y descubre las historias
          detrás de las propiedades, las ciudades y las
          decisiones que las transforman.
        </p>

        <a
          href="#escuchar"
          className={styles.button}
        >
          Escuchar el podcast
        </a>

      </div>
    </section>
  );
}