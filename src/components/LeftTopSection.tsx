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
import { InventoryIcon } from './InventoryIcon';
import { openModal } from '../features/modalSlice';
import { ModalTypes } from '../type/common';
import { IconButton } from './common/IconButton';
import { SettingIcon } from './SettingIcon';

const DEFAULT_BGM_VOLUME = 10;

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

  const handleInventoryButtonClick = () => {
    dispatch(openModal({ type: ModalTypes.INVENTORY }));
  };

  const handleSettingIconClick = () => {
    dispatch(openModal({ type: ModalTypes.SETTING }));
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
        <IconButton onClick={handleResetButtonClick} outline={TUTORIALS[tutorialIndex] === TutorialStatus.RESET}>
          <ResetIcon />
        </IconButton>
        <S.PlayButton onClick={handlePlayButtonClick} outline={TUTORIALS[tutorialIndex] === TutorialStatus.PLAY_BGM}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </S.PlayButton>
        <IconButton onClick={handleInventoryButtonClick} outline={TUTORIALS[tutorialIndex] === TutorialStatus.OPEN_INVENTORY}>
          <InventoryIcon />
        </IconButton>
        <IconButton onClick={handleSettingIconClick}>
          <SettingIcon />
        </IconButton>
      </S.LeftTopSection>
    </>
  );
};
