import { createContext, useState, ReactNode, useContext } from 'react'; //Context serve para quando uma ação seja executada em x página, outra coisa aconteça em outra página

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffLing: boolean;
    play: (episode: Episode) => void;
    playList: (List: Episode[], index: number) => void;
    setIsPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData); //typeScript

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffLing, setIsShuffLing] = useState(false);

  function play (episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList (List: Episode[], index: number) {
    setEpisodeList(List);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffLing(!isShuffLing)
  }

  function setIsPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffLing || (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {
    if (isShuffLing) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);

    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider 
    value={{ 
      episodeList, 
      currentEpisodeIndex, 
      play, 
      playList,
      playNext,
      playPrevious,
      isPlaying, 
      isLooping,
      isShuffLing,
      togglePlay, 
      setIsPlayingState,
      hasNext,
      hasPrevious,
      toggleLoop,
      toggleShuffle,
      clearPlayState
       }}> 
    
        {children}
    
    </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}