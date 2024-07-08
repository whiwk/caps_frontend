import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { Chart, ChartAxis, ChartGroup, ChartLine, ChartThemeColor } from '@patternfly/react-charts';
import { getResizeObserver, Button } from '@patternfly/react-core';
import { VictoryZoomContainer } from 'victory-zoom-container';
import DataContext from '../contexts/DataContext';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

const MonitoringGraph = ({ data, ueStopped }) => {
  const containerRef = useRef(null);
  const graph1Ref = useRef(null);
  const graph2Ref = useRef(null);
  const graph3Ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [data6, setData6] = useState([]);
  const [data7, setData7] = useState([]);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleDateString('en-GB').split('/').join('/'));
  const [isStreaming, setIsStreaming] = useState(true);
  const maxDomain1 = 4000;
  const tickValues1 = [0, 1000, 2000, 3000, 4000];
  const maxDomain2 = 2500;
  const tickValues2 = [0, 500, 1000, 1500, 2000, 2500];
  const maxDomain = 2000;
  const tickValues = [0, 500, 1000, 1500, 2000];

  const handleResize = useCallback(() => {
    if (containerRef.current && containerRef.current.clientWidth) {
      setWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    const observer = getResizeObserver(containerRef.current, handleResize);
    handleResize();
    return () => {
      observer();
    };
  }, [handleResize]);

  const updateData = useCallback(() => {
    if (!isStreaming) return;

    const now = new Date();
    setTimestamp(now.toLocaleDateString('en-GB'));
    const findValueByName = (name) => {
      const entry = data.find(item => item.name === name);
      return entry && entry.value !== null ? parseFloat(entry.value) : 0;
    };

    const newDataPoint1 = { name: 'L1 RX Processing', x: now, y: ueStopped ? 0 : findValueByName('L1 RX processing') };
    const newDataPoint2 = { name: 'L1 TX Processing', x: now, y: ueStopped ? 0 : findValueByName('L1 TX processing') };
    const newDataPoint3 = { name: 'PDSCH Decoding', x: now, y: ueStopped ? 0 : findValueByName('PDSCH decoding') };
    const newDataPoint4 = { name: 'PDSCH Receiver', x: now, y: ueStopped ? 0 : findValueByName('PDSCH receiver') };
    const newDataPoint5 = { name: 'PDCCH Handling', x: now, y: ueStopped ? 0 : findValueByName('PDCCH handling') };
    const newDataPoint6 = { name: 'ULSCH Encoding', x: now, y: ueStopped ? 0 : findValueByName('ULSCH encoding') };
    const newDataPoint7 = { name: 'UL Indication', x: now, y: ueStopped ? 0 : findValueByName('UL Indication') };

    setData1(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint1]);
    setData2(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint2]);
    setData3(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint3]);
    setData4(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint4]);
    setData5(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint5]);
    setData6(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint6]);
    setData7(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint7]);
  }, [data, ueStopped, isStreaming]);

  useEffect(() => {
    updateData();
    const timer = setInterval(updateData, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [data, updateData, ueStopped]);

  useEffect(() => {
    const adjustLabelPosition = () => {
      const labelIds = [
        'chart1-ChartAxis-1-ChartLabel',
        'chart2-ChartAxis-1-ChartLabel',
        'chart3-ChartAxis-1-ChartLabel'
      ];
      labelIds.forEach(id => {
        const labelElement = document.getElementById(id);
        if (labelElement) {
          labelElement.setAttribute('y', '55'); // Adjust this value as needed
        }
      });
    };
    adjustLabelPosition();
  }, []);

  const legendData = [
    { name: 'PDSCH Decoding', symbol: { fill: '#FF4500' } },
    { name: 'PDSCH Receiver', symbol: { fill: '#FF8C00' } },
    { name: 'PDCCH Handling', symbol: { fill: '#FFA07A' } },
  ];

  const handleDownloadScreenshot = (ref, filename) => {
    toPng(ref.current)
      .then((dataUrl) => {
        saveAs(dataUrl, `${filename}.png`);
      })
      .catch((error) => {
        console.error('Error taking screenshot:', error);
      });
  };

  const handleToggleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  return (
    <div ref={containerRef}>
      <Button 
        variant={isStreaming ? "danger" : "primary"} 
        size="sm" 
        onClick={handleToggleStreaming}
        style={{ backgroundColor: isStreaming ? '' : '#0066cc' }} // Set blue color for Start Stream
      >
        {isStreaming ? 'Stop Stream' : 'Start Stream'}
      </Button>{' '}
      <div ref={graph1Ref} style={{ height: '210px', marginBottom: '0px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: 0, right: '50px', fontSize: '12px', backgroundColor: 'white' }}>
          {timestamp}
        </span>
        <Chart
          ariaDesc="Average number of pets"
          ariaTitle="Line chart example"
          containerComponent={<VictoryZoomContainer zoomDimension="x" />}
          legendData={[{ name: 'L1 RX Processing' }, { name: 'L1 TX Processing' }]}
          legendPosition="bottom-left"
          height={210}
          maxDomain={{ y: maxDomain1 }}
          minDomain={{ y: 0 }}
          name="chart1"
          padding={{
            bottom: 75, // Adjusted to accommodate legend
            left: 75,
            right: 50,
            top: 20,
          }}
          themeColor={ChartThemeColor.blue}
          width={width}
        >
          <ChartAxis tickFormat={(x) => new Date(x).toLocaleTimeString()} />
          <ChartAxis dependentAxis showGrid tickValues={tickValues1} label="Time (us)" />
          <ChartGroup>
            <ChartLine data={data1} />
            <ChartLine data={data2} />
          </ChartGroup>
        </Chart>
      </div>
      <Button variant="primary" size="sm" onClick={() => handleDownloadScreenshot(graph1Ref, 'graph1')} style={{ marginBottom: '20px' }}>
        Download Screenshot Graph 1
      </Button>

      <div ref={graph2Ref} style={{ height: '210px', marginBottom: '0px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: -10, right: '50px', fontSize: '12px', backgroundColor: 'white' }}>
          {timestamp}
        </span>
        <Chart
          ariaDesc="Average number of pets"
          ariaTitle="Line chart example"
          containerComponent={<VictoryZoomContainer zoomDimension="x" />}
          legendData={legendData.slice(0, 3)}
          legendPosition="bottom-left"
          height={210}
          maxDomain={{ y: maxDomain2 }}
          minDomain={{ y: 0 }}
          name="chart2"
          padding={{
            bottom: 75, // Adjusted to accommodate legend
            left: 75,
            right: 50,
            top: 10,
          }}
          themeColor={ChartThemeColor.multi}
          width={width}
        >
          <ChartAxis tickFormat={(x) => new Date(x).toLocaleTimeString()} />
          <ChartAxis dependentAxis showGrid tickValues={tickValues2} label="Time (us)" />
          <ChartGroup>
            <ChartLine data={data3} style={{ data: { stroke: '#FF4500' } }} />
            <ChartLine data={data4} style={{ data: { stroke: '#FF8C00' } }} />
            <ChartLine data={data5} style={{ data: { stroke: '#FFA07A' } }} />
          </ChartGroup>
        </Chart>
      </div>
      <Button variant="primary" size="sm" onClick={() => handleDownloadScreenshot(graph2Ref, 'graph2')} style={{ marginBottom: '20px' }}>
        Download Screenshot Graph 2
      </Button>

      <div ref={graph3Ref} style={{ height: '210px', marginBottom: '0px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: -10, right: '50px', fontSize: '12px', backgroundColor: 'white' }}>
          {timestamp}
        </span>
        <Chart
          ariaDesc="Average number of pets"
          ariaTitle="Line chart example"
          containerComponent={<VictoryZoomContainer zoomDimension="x" />}
          legendData={[{ name: 'ULSCH Encoding' }, { name: 'UL Indication' }]}
          legendPosition="bottom-left"
          height={210}
          maxDomain={{ y: maxDomain }}
          minDomain={{ y: 0 }}
          name="chart3"
          padding={{
            bottom: 75, // Adjusted to accommodate legend
            left: 75,
            right: 50,
            top: 10,
          }}
          themeColor={ChartThemeColor.green}
          width={width}
        >
          <ChartAxis tickFormat={(x) => new Date(x).toLocaleTimeString()} />
          <ChartAxis dependentAxis showGrid tickValues={tickValues} label="Time (us)" />
          <ChartGroup>
            <ChartLine data={data6} />
            <ChartLine data={data7} />
          </ChartGroup>
        </Chart>
      </div>
      <Button variant="primary" size="sm" onClick={() => handleDownloadScreenshot(graph3Ref, 'graph3')} style={{ marginBottom: '20px' }}>
        Download Screenshot Graph 3
      </Button>
    </div>
  );
};

const MonitoringGraphWithContext = () => {
  const { data, ueStopped } = useContext(DataContext);
  return <MonitoringGraph data={data} ueStopped={ueStopped} />;
};

export default MonitoringGraphWithContext;
