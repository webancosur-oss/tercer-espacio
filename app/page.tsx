import PodcastHeader from '@/components/layout/PodcastHeader';
import PodcastHero from '@/components/hero/PodcastHero';
import FeaturedEpisode from '@/components/episodes/FeaturedEpisode';
import PodcastAbout from '@/components/about/PodcastAbout';
import EpisodeList from '@/components/episodes/EpisodeList';
import PodcastTopics from '@/components/topics/PodcastTopics';
import PodcastCTA from '@/components/newsletter/PodcastCTA';
import PodcastFooter from '@/components/layout/PodcastFooter';

import styles from './page.module.css';
import ListeningPlatforms from '@/components/platforms/ListeningPlatforms';

export default function Home() {
  return (
    <div className={styles.page}>
      <PodcastHeader />

      <main>
        <PodcastHero />

        <FeaturedEpisode />

        <PodcastAbout />

        <EpisodeList />

        <PodcastTopics />

        {/* <PodcastHosts /> */}

        <ListeningPlatforms />

        <PodcastCTA />
      </main>

      <PodcastFooter />
    </div>
  );
}