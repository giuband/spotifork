// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import { palette } from '../../constants';

const StyledContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  background-color: ${palette.white1};
  padding-left: 0;
  justify-content: center;
  ${props => props.hasContent && 'padding-top: 30px'};
`;

type Props = {
  children: Node,
  hasContent: boolean,
};

const ReviewsWrapper = (props: Props) => {
  const { children, hasContent } = props;
  return <StyledContainer hasContent={hasContent}>{children}</StyledContainer>;
};

export default ReviewsWrapper;
