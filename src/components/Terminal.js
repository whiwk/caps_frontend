import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/apiService';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [podName, setPodName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [websocketUrl, setWebsocketUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const terminalBodyRef = useRef(null);
  const websocketRef = useRef(null);
  const outputBuffer = useRef('');

  useEffect(() => {
    // Fetch the pod name and namespace
    const fetchPodAndNamespace = async () => {
      try {
        const podResponse = await api.get('kube/pods/');
        const userResponse = await api.get('user/information/');

        const pod = podResponse.data.pods.find(pod => pod.name.includes('ue'));
        const userNamespace = userResponse.data.username;

        setPodName(pod.name);
        setNamespace(userNamespace);

        // Define the WebSocket URL based on your server address
        setWebsocketUrl('ws://10.30.1.221:8002/ws/shell/');
      } catch (error) {
        console.error('Error fetching pod name or namespace:', error);
      }
    };

    fetchPodAndNamespace();
  }, []);

  useEffect(() => {
    if (websocketUrl) {
      // Initialize WebSocket connection
      websocketRef.current = new WebSocket(websocketUrl);

      websocketRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnecting(false);
      };

      websocketRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);

        // Buffer the output
        if (data.command_output) {
          outputBuffer.current += data.command_output;
        } else if (data.error) {
          outputBuffer.current += `Error: ${data.error}`;
        } else if (data.message) {
          outputBuffer.current += `Message: ${data.message}`;
        }

        // Assuming a newline character indicates the end of a command output part
        if (outputBuffer.current.includes('\n')) {
          setOutput((prevOutput) => {
            const newOutput = [...prevOutput];
            const lines = outputBuffer.current.split('\n');
            lines.forEach((line) => {
              if (line.trim()) {
                newOutput[newOutput.length - 1].output.push(line.trim());
              }
            });
            outputBuffer.current = '';
            return newOutput;
          });
          // Check if the command has ended based on specific conditions
          if (data.command_output && data.command_output.includes('ping statistics')) {
            setIsProcessing(false);
          }
        }
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsProcessing(false);
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsProcessing(false);
      };

      // Cleanup on component unmount
      return () => {
        if (websocketRef.current) {
          websocketRef.current.close();
        }
      };
    }
  }, [websocketUrl]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand(input);
      setInput('');
    }
  };

  const handleCtrlC = useCallback((e) => {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setOutput((prevOutput) => [...prevOutput, { command: '^C', output: [] }]);
      if (websocketRef.current) {
        websocketRef.current.close();
        setIsProcessing(false);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleCtrlC);
    return () => {
      document.removeEventListener('keydown', handleCtrlC);
    };
  }, [handleCtrlC]);

  const processCommand = (command) => {
    if (command.toLowerCase() === 'clear') {
      setOutput([]);
      return;
    }

    setIsProcessing(true);

    if (websocketRef.current) {
      websocketRef.current.send(
        JSON.stringify({
          pod_name: podName,
          namespace: namespace,
          command: command,
        })
      );
    }

    setOutput((prevOutput) => [
      ...prevOutput,
      { command: command, output: [] }
    ]);
  };

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [output]);

  const artwork = `                                              &                                 
                                           &&&&&&&&&&&&&&&&                       
                                            &&&&&&&&&&&&&&&&&%                    
     &&&&&&&&&&&&&     &&&&&&&&&&&&&&     &&&&&&&&&&&&&&&&&&&&&      &&&&&&&&     
   &&&&&&&&&&&&&&&&&   &&&&&/  #&&&&&&  &&&&&&&&&&&&&&&&&&&&&&&&    &&&&&&&&&&    
   &&&&&*      &&&&&&  &&&&&&//&&&&&&% (&&&&&,#&&&& &&&%   &&&&&   &&&&&&&&&&&&   
   &&&&&       &&&&&&  &&&&&&&&&&&&&   &&&&/ &&&& *&&&&&&&&&&%    &&&&&&  &&&&&&  
   &&&&&&&,  &&&&&&&   &&&&&.&&&&&&    &&&&       &              &&&&&&&&&&&&&&&& 
     &&&&&&&&&&&&&(    &&&&&. &&&&&&&   &&       &&&            &&&&&&&&&&&&&&&&&&
        /&&&&&%        %%%%%    %%%%%    &      &&&&&&&&&&&&&  &&&&&&       ,&&&&&
                                              &&&&&&&&&&&(                        `;
  
  return (
    <div className="terminal-container">
      {isConnecting ? (
        <div className="loading-container">
          One moment please...
        </div>
      ) : (
        <>
          <div className="terminal-header">
            <div className="terminal-buttons">
              <div className="terminal-button close"></div>
              <div className="terminal-button minimize"></div>
              <div className="terminal-button maximize"></div>
            </div>
            <div className="terminal-title">Shell</div>
          </div>
          <div className="artwork-container">
            <pre>{artwork}</pre>
          </div>
          <div className="terminal-body">
            <div className="terminal-output" ref={terminalBodyRef}>
              {output.map((entry, index) => (
                <div key={index}>
                  <div className="prompt-container">
                    <div className="prompt">{`orca\\ue\\shell#`}</div>
                    <div className="command">{entry.command}</div>
                  </div>
                  <div className="output">
                    {entry.output.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                  <div className="spacer"></div> {/* Spacer line */}
                </div>
              ))}
              {!isProcessing && (
                <div className="input-container">
                  <div className="prompt">orca\ue\shell#</div>
                  <textarea
                    className="terminal-input"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    rows="1"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Terminal;
