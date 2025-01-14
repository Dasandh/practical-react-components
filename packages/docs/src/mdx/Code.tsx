import { useCallback, ReactNode, useMemo, createElement } from 'react'
import styled, { css } from 'styled-components'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
/* eslint-disable-next-line import/no-extraneous-dependencies */
import lightTheme from 'prism-react-renderer/themes/nightOwlLight'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import * as practicalcore from 'practical-react-components-core'
import * as practicalicons from 'practical-react-components-icons'
import * as practicalformik from 'practical-react-components-formik'

import { FormikDemo } from './Formik'

const CodeCard = styled(practicalcore.Card)<{
  readonly size: 'small' | 'large'
}>`
  display: grid;
  ${({ theme, size }) =>
    size === 'small'
      ? css`
          grid-template-areas: 'editor preview';
          grid-template-columns: 3fr 2fr;
          ${EditorContainer} {
            border-right: 1px solid ${theme.color.element12()};
          }
        `
      : css`
          grid-template-areas: 'preview' 'editor';
          grid-template-rows: auto auto;
          ${EditorContainer} {
            border-top: 1px solid ${theme.color.element12()};
          }
        `}
`

const Preview = styled(LivePreview)`
  grid-area: preview;
  padding: ${practicalcore.spacing.large};
`

const EditorContainer = styled.div`
  grid-area: editor;
  overflow: hidden;
`

const Error = styled(LiveError)`
  background-color: ${({ theme }) => theme.color.elementError(0.3)};
  font-size: 12px;
  padding: ${practicalcore.spacing.large};
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`

const Editor = styled.div`
  padding: ${practicalcore.spacing.large};
`

interface CodeProps {
  readonly className?: string
  readonly type?: 'demo' | 'live' | 'code'
  readonly size?: 'small' | 'large'
  readonly children?: ReactNode
}

export const Code = ({
  children,
  className: cls,
  type = 'code',
  size = 'small',
}: CodeProps) => {
  const language = (cls?.replace(/language-/, '') ?? '') as Language

  const transformCode = useCallback(
    (code: string) => `/** @jsx mdx */\n${code}`,
    []
  )

  // Prettier currently inserts a leading ';' when formatting a code block
  // with a single arrow function in it.
  const code = useMemo(() => {
    if (typeof children !== 'string') {
      return ''
    }

    const fixedCode = children.trim()
    if (fixedCode.startsWith(';(')) {
      return fixedCode.substr(1)
    }
    return fixedCode
  }, [children])

  if (type === 'demo' || type === 'live') {
    return (
      <CodeCard size={type === 'demo' ? 'large' : size}>
        <LiveProvider
          code={code}
          transformCode={transformCode}
          scope={{
            mdx: createElement,
            ...practicalcore,
            ...practicalicons,
            ...practicalformik,
            FormikDemo,
          }}
        >
          {type === 'live' ? (
            <EditorContainer>
              <Editor>
                <LiveEditor theme={lightTheme} />
              </Editor>
              <Error />
            </EditorContainer>
          ) : null}
          <Preview />
        </LiveProvider>
      </CodeCard>
    )
  }

  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={language}
      theme={lightTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            padding: `${practicalcore.spacing.extraLarge}`,
            fontSize: '13px',
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
