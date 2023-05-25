import styled, { css, keyframes } from 'styled-components';
import * as RadixNavMenu from '@radix-ui/react-navigation-menu';

import { Theme } from '../../../types/theming';
import { font } from '../../../theme/global/font';
import { border } from '../../../theme/global/border';

export const NavMenuBaseItemStyles = css`
  padding: 8px 12px;
  cursor: pointer;
  outline: none;
  user-select: none;
  font-weight: ${font.weight.reg};
  line-height: ${font.lineHeight};
  letter-spacing: ${font.letterSpacing};
  font-size: ${font.size.lg};
  border-radius: 4px;
  color: ${(props) => props.theme.secondary.step9};

  &:hover {
    color: ${(props) => props.theme.secondary.step10};
  }

  &:focus {
    color: ${(props) => props.theme.secondary.step11};
  }
`;

export const Root = styled(RadixNavMenu.Root)`
  background-color: ${(props) => props.theme.secondary.step2};
  padding: 2.8rem;
`;

export const List = styled(RadixNavMenu.List)`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
`;

export const Trigger = styled(RadixNavMenu.Trigger)`
  all: unset;
  ${NavMenuBaseItemStyles}
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Item = styled(RadixNavMenu.Item)``;

export const Link = styled(RadixNavMenu.Link)`
  ${NavMenuBaseItemStyles}
  display: block;
  text-decoration: none;

  &[data-active] {
    color: ${({ theme }: { theme: Theme }) => theme.secondary.step12};
    border-bottom: 2px ${({ theme }: { theme: Theme }) => theme.secondary.step9}
      solid;
  }
`;

export const Content = styled(RadixNavMenu.Content)`
  position: absolute;
  top: 100%;
  background-color: ${({ theme }: { theme: Theme }) => theme.secondary.step4};
  border: 1px solid ${({ theme }: { theme: Theme }) => theme.secondary.step3};
  border-radius: 4px;
  font-weight: ${font.weight.reg};
  line-height: ${font.lineHeight};
  letter-spacing: ${font.letterSpacing};
  font-size: ${font.size.md};
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: fit-content;
`;

export const Indicator = styled(RadixNavMenu.Indicator)`
  bottom: 0;
  height: 2px;
  background-color: ${({ theme }: { theme: Theme }) => theme.secondary.step11};
  transition: all 0.5s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
`;

export const Sub = styled(RadixNavMenu.Sub)``;

const scaleIn = keyframes({
  from: { transform: 'rotateX(-30deg) scale(0.9)', opacity: 0 },
  to: { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
});

const scaleOut = keyframes({
  from: { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
  to: { transform: 'rotateX(-10deg) scale(0.95)', opacity: 0 },
});

export const Viewport = styled(RadixNavMenu.Viewport)`
  position: relative;
  transform-origin: top center;
  /* width: var(--radix-navigation-menu-viewport-width); */
  transition: width, height, 300ms ease;
  &[data-state='open'] {
    animation: ${scaleIn} 200ms ease;
  }
  &[data-state='closed'] {
    animation: ${scaleOut} 200ms ease;
  }
`;

export const Dropdown = styled.ul`
  padding: 22px;
  margin: 0;
  list-style: none;
`;
