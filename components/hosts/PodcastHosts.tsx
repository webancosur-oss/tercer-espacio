import styles from './PodcastHosts.module.css';

export default function PodcastHosts() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <div className={styles.header}>
          <span>
            QUIENES ESTÁN DETRÁS
          </span>

          <h2>
            Las personas
            <br />
            detrás de las
            <br />
            conversaciones.
          </h2>
        </div>

        <div className={styles.hosts}>

          <article className={styles.host}>
            <div className={styles.photo}>
              <div className={styles.photoPlaceholder}>
                <span>HOST</span>
              </div>
            </div>

            <div className={styles.info}>
              <h3>Nombre del Host</h3>

              <span>
                CONDUCTOR · INMOBILIARIA
              </span>

              <p>
                Conversaciones desde la experiencia
                de quienes conocen el sector desde dentro.
              </p>
            </div>
          </article>

          <article className={styles.host}>
            <div className={styles.photo}>
              <div className={styles.photoPlaceholder}>
                <span>HOST</span>
              </div>
            </div>

            <div className={styles.info}>
              <h3>Nombre del Host</h3>

              <span>
                CONDUCTOR · ARQUITECTURA
              </span>

              <p>
                Una mirada diferente sobre las ciudades,
                los espacios y las decisiones que las transforman.
              </p>
            </div>
          </article>

        </div>

      </div>
    </section>
  );
}