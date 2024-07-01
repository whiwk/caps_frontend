import React from 'react';
import { Chart, ChartAxis, ChartGroup, ChartLine, ChartThemeColor } from '@patternfly/react-charts';
import { getResizeObserver, Button } from '@patternfly/react-core';
import { VictoryZoomContainer } from 'victory-zoom-container';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.observer = () => {};
    this.state = {
      width: 0,
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      data5: [],
      data6: [],
      data7: []
    };
    this.handleResize = () => {
      if (this.containerRef.current && this.containerRef.current.clientWidth) {
        this.setState({ width: this.containerRef.current.clientWidth });
      }
    };
  }

  componentDidMount() {
    this.observer = getResizeObserver(this.containerRef.current, this.handleResize);
    this.handleResize();

    this.timer = setInterval(this.updateData, 1000);
  }

  componentWillUnmount() {
    this.observer();
    clearInterval(this.timer);
  }

  updateData = () => {
    const now = new Date();
    const newDataPoint1 = { name: 'L1 RX Processing', x: now, y: Math.floor(Math.random() * 14000) };
    const newDataPoint2 = { name: 'L1 TX Processing', x: now, y: Math.floor(Math.random() * 14000) };
    const newDataPoint3 = { name: 'PDSCH Decoding', x: now, y: Math.floor(Math.random() * 6000) };
    const newDataPoint4 = { name: 'PDSCH Receiver', x: now, y: Math.floor(Math.random() * 6000) };
    const newDataPoint5 = { name: 'PDCCH Handling', x: now, y: Math.floor(Math.random() * 6000) };
    const newDataPoint6 = { name: 'ULSCH Encoding', x: now, y: Math.floor(Math.random() * 4500) };
    const newDataPoint7 = { name: 'UL Indication', x: now, y: Math.floor(Math.random() * 4500) };

    this.setState(prevState => ({
      data1: [...prevState.data1.filter(point => now - point.x <= 60000), newDataPoint1],
      data2: [...prevState.data2.filter(point => now - point.x <= 60000), newDataPoint2],
      data3: [...prevState.data3.filter(point => now - point.x <= 60000), newDataPoint3],
      data4: [...prevState.data4.filter(point => now - point.x <= 60000), newDataPoint4],
      data5: [...prevState.data5.filter(point => now - point.x <= 60000), newDataPoint5],
      data6: [...prevState.data6.filter(point => now - point.x <= 60000), newDataPoint6],
      data7: [...prevState.data7.filter(point => now - point.x <= 60000), newDataPoint7]
    }));
  }

  render() {
    const { width, data1, data2, data3, data4, data5, data6, data7 } = this.state;

    const legendData = [
      { name: 'PDSCH Decoding', symbol: { fill: '#FF4500' } },
      { name: 'PDSCH Receiver', symbol: { fill: '#FF8C00' } },
      { name: 'PDCCH Handling', symbol: { fill: '#FFA07A' } },
    ];
    
    return (
      <div ref={this.containerRef}>
        <Button variant="primary" size="sm">
          Live Graph
        </Button>{' '}
        <Button variant="warning" size="sm">
          Stream L1
        </Button>{' '}
        <Button variant="danger" size="sm">
          Stop Stream
        </Button>{' '}
        <div style={{ height: '210px', marginBottom: '0px'}}>
          <Chart
            ariaDesc="Average number of pets"
            ariaTitle="Line chart example"
            containerComponent={<VictoryZoomContainer zoomDimension="x" />}
            legendData={[{ name: 'L1 RX Processing' }, { name: 'L1 TX Processing' }]}
            legendPosition="bottom-left"
            height={210}
            maxDomain={{y: 14000}}
            minDomain={{y: 0}}
            name="chart1"
            padding={{
              bottom: 75, // Adjusted to accommodate legend
              left: 75,
              right: 50,
              top: 20
            }}
            themeColor={ChartThemeColor.blue}
            width={width}
           >
            <ChartAxis tickFormat={(x) => new Date(x).toLocaleTimeString()} />
            <ChartAxis dependentAxis showGrid tickValues={[4000, 8000, 12000]} />
            <ChartGroup>
              <ChartLine data={data1} />
              <ChartLine data={data2} />
            </ChartGroup>
          </Chart>
        </div>
        <div style={{ height: '210px', marginBottom:'0px'}}>
          <Chart
            ariaDesc="Average number of pets"
            ariaTitle="Line chart example"
            containerComponent={<VictoryZoomContainer zoomDimension="x" />}
            legendData={legendData.slice(0, 3)}
            legendPosition="bottom-left"
            height={210}
            maxDomain={{y: 6000}}
            minDomain={{y: 0}}
            name="chart2"
            padding={{
              bottom: 75, // Adjusted to accommodate legend
              left: 75,
              right: 50,
              top: 10
            }}
            themeColor={ChartThemeColor.multi}
            width={width}
           >
            <ChartAxis tickFormat={(x) => new Date(x).toLocaleTimeString()} />
            <ChartAxis dependentAxis showGrid tickValues={[1000, 2000, 3000, 4000]} />
            <ChartGroup>
              <ChartLine data={data3} style={{ data: { stroke: '#FF4500' } }} />
              <ChartLine data={data4} style={{ data: { stroke: '#FF8C00' } }} />
              <ChartLine data={data5} style={{ data: { stroke: '#FFA07A' } }} />
            </ChartGroup>
          </Chart>
        </div>
        <div style={{ height: '210px', marginBottom:'0px' }}>
          <Chart
            ariaDesc="Average number of pets"
            ariaTitle="Line chart example"
            containerComponent={<VictoryZoomContainer zoomDimension="x" />}
            legendData={[{ name: 'ULSCH Encoding' }, { name: 'UL Indication' }]}
            legendPosition="bottom-left"
            height={210}
            maxDomain={{y: 4500}}
            minDomain={{y: 0}}
            name="chart3"
            padding={{
              bottom: 75, // Adjusted to accommodate legend
              left: 75,
              right: 50,
              top: 10
            }}
            themeColor={ChartThemeColor.green}
            width={width}
           >
            <ChartAxis tickFormat={(x) => new Date(x).toLocaleTimeString()} />
            <ChartAxis dependentAxis showGrid tickValues={[500, 1000, 1500, 2000, 2500]} />
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
  }
}

export default Graph;