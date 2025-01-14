import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FC,
  ReactNode,
} from 'react'
import styled, { css } from 'styled-components'

import { opacity } from '../designparams'

type BaseElement = HTMLAnchorElement
type BaseProps = AnchorHTMLAttributes<BaseElement>
type BaseButtonElement = HTMLButtonElement
type BaseButtonProps = ButtonHTMLAttributes<BaseButtonElement>

const LinkNative = styled.a`
  padding: 0;
  border-color: transparent;
  cursor: pointer;
  height: auto;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.color.textLink()};

  &:hover {
    color: ${({ theme }) => theme.color.textLinkHover()};
  }

  &:focus {
    outline: none;
  }

  &:active {
    color: ${({ theme }) => theme.color.textLinkHover()};
  }
`

const LinkButton = styled.button<{
  readonly disabled?: boolean
}>`
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
  height: auto;
  font-size: inherit;
  font-weight: 600;
  color: ${({ theme }) => theme.color.textLink()};

  &:hover {
    color: ${({ theme }) => theme.color.textLinkHover()};
  }

  &:focus {
    outline: none;
  }

  &:active {
    color: ${({ theme }) => theme.color.textLinkHover()};
  }

  ${({ disabled }) =>
    disabled === true
      ? css`
          opacity: ${opacity[48]};
          pointer-events: none;
        `
      : undefined}
`

export interface ButtonLinkProps extends BaseButtonProps {
  readonly children?: ReactNode
  /**
   * `class` to be passed to the component.
   */
  readonly className?: BaseButtonProps['className']
  /**
   * If `button` it use <button> tag.
   * <button> tag is better than <span> tag for accessibility.
   */
  readonly variant: 'button'
}

export interface ALinkProps extends BaseProps {
  readonly children?: ReactNode
  /**
   * `class` to be passed to the component.
   */
  readonly className?: BaseProps['className']
  /**
   * If `a` it use <a> tag and href is required.
   */
  readonly variant: 'a'
}

export const Link: FC<ButtonLinkProps | ALinkProps> = ({
  children,
  ...props
}) => {
  if (props.variant === 'a') {
    return <LinkNative {...props}>{children}</LinkNative>
  }

  return (
    <LinkButton {...props} type="button">
      {children}
    </LinkButton>
  )
}
