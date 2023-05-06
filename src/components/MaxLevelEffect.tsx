import styled from '@emotion/styled';
import { CenteredModal, Modal } from './Modal';
import Vivus from 'vivus';
import { useEffect, useRef } from 'react';

const COLOR = '#C9A7EB';

const SIZE = '4vw';
export const DURATION_MS = 1200;
export const MaxLevelEffect = () => {
  const svgRef = useRef<any>();
  useEffect(() => {
    new Vivus(svgRef.current, {
      duration: DURATION_MS / 10,
      type: 'delayed',
    });
  }, []);

  return (
    <Modal
      top="60%"
      left="50.1%"
      transform="translate(-50%, -50%)"
      content={
        <>
          <Shadow />
          <svg ref={svgRef} stroke={COLOR} strokeWidth={2} fill="none" width={SIZE} height={SIZE} viewBox="0 0 200 200" enableBackground="new 0 0 200 200">
            <path d="M10,100A90,90 0,1,1 190,100A90,90 0,1,1 10,100"></path>
            <path d="M14.260000000000005,100A85.74,85.74 0,1,1 185.74,100A85.74,85.74 0,1,1 14.260000000000005,100"></path>
            <path d="M27.052999999999997,100A72.947,72.947 0,1,1 172.947,100A72.947,72.947 0,1,1 27.052999999999997,100"></path>
            <path d="M60.26,100A39.74,39.74 0,1,1 139.74,100A39.74,39.74 0,1,1 60.26,100"></path>
            <path d="M34.042,131.189L67.047,77.781"></path>
            <path d="M31.306,75.416L92.41,60.987"></path>
            <path d="M68.81,34.042L122.219,67.046"></path>
            <path d="M124.584,31.305L139.013,92.409"></path>
            <path d="M165.957,68.809L132.953,122.219"></path>
            <path d="M168.693,124.584L107.59,139.012"></path>
            <path d="M131.19,165.957L77.781,132.953"></path>
            <path d="M75.417,168.693L60.987,107.59"></path>
          </svg>
        </>
      }
      dimmedOpacity={0.7}
      zIndex={1200}
    />
  );
};

const Shadow = styled.div`
  position: absolute;
  border-radius: 50%;
  height: ${SIZE};
  width: ${SIZE};
  background: rgba(201, 167, 235, 0.5);
  box-shadow: 0 0 10px #c9a7eb, 0 0 60px #c9a7eb, 0 0 200px #c9a7eb;
  opacity: 1;
`;
