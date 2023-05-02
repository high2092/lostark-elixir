import { useEffect, useRef, useState } from 'react';
import * as S from './LeftTopSection.style';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { PauseIcon } from './PauseIcon';
import { PlayIcon } from './PlayIcon';
import { ResetIcon } from './ResetIcon';
import { useAppDispatch, useAppSelector } from '../store';
import { resetUI } from '../features/uiSlice';
import { resetElixir } from '../features/elixirSlice';
import { TUTORIALS, TutorialStatus } from '../constants';

const DEFAULT_BGM_VOLUME = 5;

export const LeftTopSection = () => {
  const dispatch = useAppDispatch();
  const { tutorialIndex } = useAppSelector((state) => state.ui);

  const [playing, setPlaying] = useState(false);
  const youtubePlayerRef = useRef<YouTubePlayer>();
  const [volume, setVolume] = useState(DEFAULT_BGM_VOLUME);

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
      <S.LeftTopSection>
        <S.BGMPlayer onClick={handlePlayButtonClick} outline={TUTORIALS[tutorialIndex] === TutorialStatus.PLAY_BGM}>
          <S.PlayButton>
            <div>{playing ? <PauseIcon /> : <PlayIcon />}</div>
          </S.PlayButton>
        </S.BGMPlayer>
        <S.ResetButton onClick={handleResetButtonClick} outline={TUTORIALS[tutorialIndex] === TutorialStatus.RESET}>
          <ResetIcon />
        </S.ResetButton>
      </S.LeftTopSection>
    </>
  );
};
