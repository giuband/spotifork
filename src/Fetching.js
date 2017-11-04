import React from 'react';
import styled, { keyframes } from 'styled-components';

const SIZE = '50px';

const spin = keyframes`
  from {
    transform: rotate(0deg)
  } to {
    transform: rotate(360deg)
  }
`;

const StyledFetching = styled.div`
  position: relative;
  height: ${SIZE};
  margin: 10px 0 100px;

  &:before {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -${parseInt(SIZE, 10) / 2}px;
    content: '';
    width: ${SIZE};
    height: ${SIZE};
    border: 3px solid #ddd;
    border-top-color: #444;
    border-left-color: #444;
    border-radius: 50%;
    animation: 0.6s ${spin} infinite linear;
  }
`;

const Fetching = () => {
  return <StyledFetching />;
};

export default Fetching;
