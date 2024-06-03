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
      width: 0
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
  }

  componentWillUnmount() {
    this.observer();
  }

  render() {
    const { width } = this.state;

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
            name="chart3"
            padding={{
              bottom: 75, // Adjusted to accommodate legend
              left: 75,
              right: 50,
              top: 20
            }}
            themeColor={ChartThemeColor.blue}
            width={width}
           >
            <ChartAxis tickValues={[2, 3, 4]} />
            <ChartAxis dependentAxis showGrid tickValues={[4000, 8000, 12000]} />
            <ChartGroup>
              <ChartLine
                data={[
                  { name: 'L1 RX Processing', x: '2015', y: 1000 },
                  { name: 'L1 RX Processing', x: '2016', y: 2000 },
                  { name: 'L1 RX Processing', x: '2017', y: 5000 },
                  { name: 'L1 RX Processing', x: '2018', y: 3000 }
                ]}
              />
              <ChartLine
                data={[
                  { name: 'L1 TX Processing', x: '2015', y: 3000 },
                  { name: 'L1 TX Processing', x: '2016', y: 4000 },
                  { name: 'L1 TX Processing', x: '2017', y: 9000 },
                  { name: 'L1 TX Processing', x: '2018', y: 5000 }
                ]}
              />
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
            name="chart3"
            padding={{
              bottom: 75, // Adjusted to accommodate legend
              left: 75,
              right: 50,
              top: 10
            }}
            themeColor={ChartThemeColor.multi}
            width={width}
           >
            <ChartAxis tickValues={[2, 3, 4]} />
            <ChartAxis dependentAxis showGrid tickValues={[1000, 2000, 3000, 4000]} />
            <ChartGroup>
              <ChartLine
                data={[
                  { name: 'PDSCH Decoding', x: '2015', y: 1000 },
                  { name: 'PDSCH Decoding', x: '2016', y: 2000 },
                  { name: 'PDSCH Decoding', x: '2017', y: 1500 },
                  { name: 'PDSCH Decoding', x: '2018', y: 3800 }
                ]}
                style={{ data: { stroke: '#FF4500' } }}
              />
              
              <ChartLine
                data={[
                  { name: 'PDSCH Receiver', x: '2015', y: 3000 },
                  { name: 'PDSCH Receiver', x: '2016', y: 4000 },
                  { name: 'PDSCH Receiver', x: '2017', y: 2500 },
                  { name: 'PDSCH Receiver', x: '2018', y: 1000 }
                ]}
                style={{ data: { stroke: '#FF8C00' } }}
              />
              <ChartLine
                data={[
                  { name: 'PDCCH Handling', x: '2015', y: 2000 },
                  { name: 'PDCCH Handling', x: '2016', y: 1000 },
                  { name: 'PDCCH Handlingg', x: '2017', y: 1500 },
                  { name: 'PDCCH Handling', x: '2018', y: 3000 }
                ]}
                style={{ data: { stroke: '#FFA07A' } }}
              />
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
            <ChartAxis tickValues={[2, 3, 4]} />
            <ChartAxis dependentAxis showGrid tickValues={[500, 1000, 1500, 2000, 2500]} />
            <ChartGroup>
              <ChartLine
                data={[
                  { name: 'ULSCH Encoding', x: '2015', y: 500 },
                  { name: 'ULSCH Encoding', x: '2016', y: 2500 },
                  { name: 'ULSCH Encoding', x: '2017', y: 1000 },
                  { name: 'ULSCH Encoding', x: '2018', y: 800 }
                ]}
              />
              <ChartLine
                data={[
                  { name: 'UL Indication', x: '2015', y: 2000 },
                  { name: 'UL Indication', x: '2016', y: 1000 },
                  { name: 'UL Indication', x: '2017', y: 700 },
                  { name: 'UL Indication', x: '2018', y: 1500 }
                ]}
              />
            </ChartGroup>
          </Chart>
        </div>
        <Button variant="primary" size="sm">
          Download Screenshoot
        </Button>
      </div>
    );
  }
}

export default Graph;