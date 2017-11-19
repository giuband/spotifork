// @flow
import React from 'react';
import styled from 'styled-components';
import {
  palette,
  NAVBAR_HEIGHT,
  CONTENT_WIDTH,
  SERIF_FONT,
  SANS_SERIF_FONT,
  ACTIVE_ELEMENT,
} from './constants';

const NavBarContainer = styled.header`
  background-color: ${palette.gray0};
  height: ${NAVBAR_HEIGHT};
  color: ${palette.gray2};
  position: relative;
`;

NavBarContainer.displayName = 'NavBarContainer';

const NavBarContent = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  justify-content: space-between;
  align-items: middle;
  ${CONTENT_WIDTH};
`;

const PageTitle = styled.h1`
  ${SERIF_FONT} font-weight: 700;
  font-size: 3.75em;
  color: ${palette.white};
  margin: 0 0 0.1em;
`;

PageTitle.displayName = 'PageTitle';

const PageSubtitle = styled.h3`
  font-size: 0.8em;
  color: ${palette.gray2};
  margin: 0;

  ${SANS_SERIF_FONT};
`;

const RightContentContainer = styled.nav`align-self: center;`;

const RightContentContainerList = styled.ul`
  list-style: none;
  padding-left: 0;
  display: flex;
`;
const RightContentContainerListItem = styled.li`
  &:not(:last-of-type) {
    margin-right: 40px;
  }
`;

const RightContentContainerListItemLink = styled.a`
  color: inherit;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: -0.06em;
  font-size: 0.9em;

  ${SANS_SERIF_FONT};

  ${ACTIVE_ELEMENT} {
    color: white;
  }

  transform: color 0.2s ease-in;
`;

export default function Navbar() {
  return (
    <NavBarContainer>
      <NavBarContent>
        <div>
          <PageTitle>Spotifork</PageTitle>
          <PageSubtitle>
            Your easy way to listen to the latest albums reviewed by Pitchfork
          </PageSubtitle>
        </div>
        <RightContentContainer>
          <RightContentContainerList>
            <RightContentContainerListItem>
              <RightContentContainerListItemLink href="#">
                View on github
              </RightContentContainerListItemLink>
            </RightContentContainerListItem>
            <RightContentContainerListItem>
              <RightContentContainerListItemLink href="#">
                Report an issue
              </RightContentContainerListItemLink>
            </RightContentContainerListItem>
          </RightContentContainerList>
        </RightContentContainer>
      </NavBarContent>
    </NavBarContainer>
  );
}
