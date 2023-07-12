import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const renderers = {
  code: ({ language, value }) => {
    return (
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {value}
      </SyntaxHighlighter>
    );
  },
};

const MessageComponent = ({ message }) => {
  return <ReactMarkdown renderers={renderers}>{message}</ReactMarkdown>;
};

export default MessageComponent;