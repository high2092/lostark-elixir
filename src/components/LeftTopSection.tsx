import { useEffect, useRef, useState } from 'react';
import * as S from './LeftTopSection.style';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { PauseIcon } from './PauseIcon';
import { PlayIcon } from './PlayIcon';
import { ResetIcon } from './ResetIcon';
import { useAppDispatch } from '../store';
import { resetUI } from '../features/uiSlice';
import { resetElixir } from '../features/elixirSlice';

const DEFAULT_BGM_VOLUME = 5;

interface BGMPlayerProps {
  outline: boolean;
}

export const LeftTopSection = ({ outline }) => {
  const [playing, setPlaying] = useState(false);
  const youtubePlayerRef = useRef<YouTubePlayer>();
  const [volume, setVolume] = useState(DEFAULT_BGM_VOLUME);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!youtubePlayerRef.current) return;
    if (playing) {
      youtubePlayerRef.current.setVolume(volume);
      youtubePlayerRef.current.playVideo();
    } else youtubePlayerRef.current.pauseVideo();
  }, [playing]);

  const handlePlayButtonClick = () => {
    setPlaying(!playing);
  };

  const handleResetButtonClick = () => {
    if (!confirm('현재 연성 상태를 초기화할까요?')) return;

    dispatch(resetUI());
    dispatch(resetElixir());
  };

  return (
    <>
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
      <S.LeftTopSection outline={outline}>
        <S.BGMPlayer onClick={handlePlayButtonClick}>
          <S.PlayButton>
            <div>{playing ? <PauseIcon /> : <PlayIcon />}</div>
          </S.PlayButton>
        </S.BGMPlayer>
        <S.ResetButton onClick={handleResetButtonClick}>
          <ResetIcon />
        </S.ResetButton>
      </S.LeftTopSection>
    </>
  );
};
