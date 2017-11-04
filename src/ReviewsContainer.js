import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.main`
  display: flex;
  flex-wrap: wrap;
  max-width: 880px;
  margin-left: auto;
  margin-right: auto;
`;

const ReviewsContainer = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};

export default ReviewsContainer;
