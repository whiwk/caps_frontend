import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Chart, ChartAxis, ChartGroup, ChartLine, ChartThemeColor } from '@patternfly/react-charts';
import { getResizeObserver, Button } from '@patternfly/react-core';
import { VictoryZoomContainer } from 'victory-zoom-container';
import DataContext from '../contexts/DataContext';

const Graph = ({ data }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [data6, setData6] = useState([]);
  const [data7, setData7] = useState([]);
  const maxDomain1 = 4000;
  const tickValues1 = [1000, 2000, 3000, 4000];
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
    const now = new Date();
    const findValueByName = (name) => {
      const entry = data.find(item => item.name === name);
      return entry ? entry.value : 0;
    };

    const newDataPoint1 = { name: 'L1 RX Processing', x: now, y: findValueByName('L1 RX processing') };
    const newDataPoint2 = { name: 'L1 TX Processing', x: now, y: findValueByName('L1 TX processing') };
    const newDataPoint3 = { name: 'PDSCH Decoding', x: now, y: findValueByName('PDSCH decoding') };
    const newDataPoint4 = { name: 'PDSCH Receiver', x: now, y: findValueByName('PDSCH receiver') };
    const newDataPoint5 = { name: 'PDCCH Handling', x: now, y: findValueByName('PDCCH handling') };
    const newDataPoint6 = { name: 'ULSCH Encoding', x: now, y: findValueByName('ULSCH encoding') };
    const newDataPoint7 = { name: 'UL Indication', x: now, y: findValueByName('UL Indication') };

    setData1(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint1]);
    setData2(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint2]);
    setData3(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint3]);
    setData4(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint4]);
    setData5(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint5]);
    setData6(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint6]);
    setData7(prevData => [...prevData.filter(point => now - point.x <= 60000), newDataPoint7]);
  }, [data]);

  useEffect(() => {
    // console.log('Data context passed to Graph:', data); // Log the data context here
    updateData();
    const timer = setInterval(updateData, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [data, updateData]);

  const legendData = [
    { name: 'PDSCH Decoding', symbol: { fill: '#FF4500' } },
    { name: 'PDSCH Receiver', symbol: { fill: '#FF8C00' } },
    { name: 'PDCCH Handling', symbol: { fill: '#FFA07A' } },
  ];

  return (
    <div ref={containerRef}>
      <Button variant="primary" size="sm">
        Live Graph
      </Button>{' '}
      <Button variant="warning" size="sm">
        Stream L1
      </Button>{' '}
      <Button variant="danger" size="sm">
        Stop Stream
      </Button>{' '}
      <div style={{ height: '210px', marginBottom: '0px' }}>
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
          <ChartAxis dependentAxis showGrid tickValues={tickValues1} />
          <ChartGroup>
            <ChartLine data={data1} />
            <ChartLine data={data2} />
          </ChartGroup>
        </Chart>
      </div>
      <div style={{ height: '210px', marginBottom: '0px' }}>
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
          <ChartAxis dependentAxis showGrid tickValues={tickValues2} />
          <ChartGroup>
            <ChartLine data={data3} style={{ data: { stroke: '#FF4500' } }} />
            <ChartLine data={data4} style={{ data: { stroke: '#FF8C00' } }} />
            <ChartLine data={data5} style={{ data: { stroke: '#FFA07A' } }} />
          </ChartGroup>
        </Chart>
      </div>
      <div style={{ height: '210px', marginBottom: '0px' }}>
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
          <ChartAxis dependentAxis showGrid tickValues={tickValues} />
          <ChartGroup>
            <ChartLine data={data6} />
            <ChartLine data={data7} />
          </ChartGroup>
        </Chart>
      </div>
      <Button variant="primary" size="sm">
        Download Screenshot
      </Button>
    </div>
  );
};

const GraphWithContext = () => {
  const { data } = useContext(DataContext);
  // console.log('Data context passed to Graph:', data); // Log the data context here
  return <Graph data={data} />;
};

export default GraphWithContext;