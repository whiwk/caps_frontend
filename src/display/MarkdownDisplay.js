import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';


const MarkdownDisplay = ({ filePath }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(filePath)
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((error) => console.error('Error fetching the Markdown file:', error));
  }, [filePath]);

  return (
    <div className="markdown-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;
