import { useEffect, useRef, useState } from 'react';
import * as S from './BGMPlayer.style';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { PauseIcon } from './PauseIcon';
import { PlayIcon } from './PlayIcon';

const DEFAULT_BGM_VOLUME = 5;

export const BGMPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const youtubePlayerRef = useRef<YouTubePlayer>();
  const [volume, setVolume] = useState(DEFAULT_BGM_VOLUME);

  const handlePlayButtonClick = () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    if (!youtubePlayerRef.current) return;
    if (playing) {
      youtubePlayerRef.current.setVolume(volume);
      youtubePlayerRef.current.playVideo();
    } else youtubePlayerRef.current.pauseVideo();
  }, [playing]);
  return (
    <S.BGMPlayer>
      <S.YouTube>
        <YouTube
          videoId="Qz99BEtXOtk"
          opts={{
            autoplay: 1,
          }}
          onReady={(e) => (youtubePlayerRef.current = e.target)}
          onEnd={(e) => e.target.playVideo()}
        />
      </S.YouTube>
      <span>BGM</span>
      <S.PlayButton onClick={handlePlayButtonClick}>
        <div>{playing ? <PauseIcon /> : <PlayIcon />}</div>
      </S.PlayButton>
    </S.BGMPlayer>
  );
};
