import { GetStaticProps } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link'; //Faz não carregar tudo dnv

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
// SPA SSR ...SSG...

import styles from '../pages/home.module.scss';
import { PlayerContext, usePlayer } from '../contexts/playerContext';

//Typagem
type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    // description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer()

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head> <title> Home | Podcastr </title> </Head>
      <section className={styles.latestEpisodes}>
        <h2> Último lançamentos </h2>

        <ul> 
          {latestEpisodes.map((episode, index) => { //map serve pra percorrer algo e retorna algo
            return(//Key tem que ir em primeiro lugar quando se coloca um map()
              <li key={episode.id}> 
                <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} objectFit="cover" />

                <div className={styles.episodeDetails}> masa
                  <Link href={`/episodes/${episode.id}`}>  
                    <a> {episode.title} </a> 
                  </Link>
                  <p> {episode.members} </p>
                  <span> {episode.publishedAt} </span>
                  <span> {episode.durationAsString} </span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2> Todos os episodios </h2>

          <table cellSpacing={0}>
              <thead>
                <tr>
                  <th></th>
                  <th> Podcast </th>
                  <th> Integrantes </th>
                  <th> Data </th>
                  <th> Duração </th>
                  <th></th>
                </tr>
              </thead>
          </table>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id} className={styles.trTwo}>
                  <td style={{ width: 72 }} className={styles.imgTwo}>
                    <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                  </td>
                  <td> 
                    {/* <div className={styles.titleTwo}> <Link href={`/episodes/${episode.id}`}>  <a>{episode.title}</a> </Link> </div>  */}
                    <Link href={`/episodes/${episode.id}`}>
                    <div className={styles.titleTwo}> <a>{episode.title}</a> </div>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
                )
            })}
          </tbody>
      </section>
    </div>
  ) 
}

export const getStaticProps: GetStaticProps = async () => { //SSG
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })//buscando os episodios do podcast
   //_limit=12&_sort=published_at&_order=desc

   const episodes = data.map(episode => {//dados que são puxados de server.json
     return { 
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),//formatação da data
        duration: Number(episode.file.duration),
        durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
        // description: episode.description,
        url: episode.file.url,
     };
   })

   const latestEpisodes = episodes.slice(0, 2); //Pegando os dois ultimos episodios lançados
   const allEpisodes = episodes.slice(2, episodes.length); //Pegando os demias episodios

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, 
  }
  
}
