import * as React from 'react';
import '@patternfly/patternfly/patternfly.css';
import './TopologyGraph.css';
import api from '../services/apiService';
import {
  action,
  ContextMenuItem,
  ContextMenuSeparator,
  CREATE_CONNECTOR_DROP_TYPE,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeAnimationSpeed,
  EdgeStyle,
  EdgeTerminalType,
  GraphComponent,
  GridLayout,
  LabelPosition,
  ModelKind,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  NodeShape,
  NodeStatus,
  SELECTION_EVENT,
  TopologyControlBar,
  TopologySideBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withContextMenu,
  withDndDrop,
  withDragNode,
  withPanZoom,
  withSelection,
} from '@patternfly/react-topology';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const BadgeColors = [{
  name: 'End Users',
  badgeColor: '#35748C',
  badgeTextColor: '#fff',
  badgeBorderColor: '#A6A6A6'
}, {
  name: 'RAN',
  badgeColor: '#D9D9D9',
  badgeTextColor: '#049BAC',
  badgeBorderColor: '#8C8C8C'
}, {
  name: 'Core',
  badgeColor: '#049BAC',
  badgeTextColor: '#fff',
  badgeBorderColor: '#083E4A'
}];

const setSuccessStyle = () => {
  document.documentElement.style.setProperty('--connector-circle-success-color', '#3e8635');
  document.documentElement.style.setProperty('--edge-success-color', '#3e8635');
};

const setFailedStyle = () => {
  document.documentElement.style.setProperty('--connector-circle-failed-color', '#c9190b');
  document.documentElement.style.setProperty('--edge-failed-color', '#c9190b');
};

const CONNECTOR_SOURCE_DROP = 'connector-src-drop';
const CONNECTOR_TARGET_DROP = 'connector-src-drop';

const DataEdge = React.memo(({ element, onEdgeClick, ...rest }) => {
  React.useEffect(() => {
    console.log('DataEdge element:', element);
  }, [element]);

  const handleEdgeClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    console.log('Edge clicked:', element.getId());
    onEdgeClick(element);
  };

  return (
    <DefaultEdge
      element={element}
      startTerminalType={EdgeTerminalType.circle}
      endTerminalType={EdgeTerminalType.circle}
      onClick={handleEdgeClick}
      {...rest}
    />
  );
});

const CustomNode = React.memo(({
  element,
  selected,
  onSelect,
  onContextMenu,
  contextMenuOpen,
  setShowSideBar,
  onStatusDecoratorClick,
  ...rest
}) => {
  React.useEffect(() => {
    console.log('CustomNode element:', element);
  }, [element]);

  const nodeId = element && element.getId ? element.getId() : null;

  let iconSrc = '';
  if (nodeId === 'UE') {
    iconSrc = '/UE.png';
  } else if (nodeId === 'RRU') {
    iconSrc = '/RRU.png';
  } else if (nodeId === 'DU') {
    iconSrc = '/DU.png';
  } else if (nodeId === 'CU') {
    iconSrc = '/CU.png';
  } else if (['AMF', 'UPF'].includes(nodeId)) {
    iconSrc = '/5GC.png';
  }
  const data = element ? element.getData() : {};
  const badgeColors = BadgeColors.find(badgeColor => badgeColor.name === data.badge);
  const shouldShowContextMenu = nodeId !== 'AMF' && nodeId !== 'UPF' && nodeId !== 'RRU';

  const handleContextMenu = (event) => {
    event.stopPropagation(); // Ensure the event doesn't propagate
    if (onSelect) {
      onSelect(event); // Ensure the event object is passed to onSelect
    }
    if (onContextMenu) {
      onContextMenu(event);
    }
    setShowSideBar(false); // Hide the sidebar when context menu is triggered
  };

  return (
    <DefaultNode
      element={element}
      showStatusDecorator
      selected={selected}
      onSelect={onSelect}
      {...rest}
      badge={data.badge}
      badgeColor={badgeColors?.badgeColor}
      badgeTextColor={badgeColors?.badgeTextColor}
      badgeBorderColor={badgeColors?.badgeBorderColor}
      onContextMenu={shouldShowContextMenu ? handleContextMenu : undefined}
      contextMenuOpen={contextMenuOpen}
      onStatusDecoratorClick={() => onStatusDecoratorClick && onStatusDecoratorClick(nodeId)}
      className={data.status === 'success' ? 'pf-topology__connector-circle pf-m-source' : 'pf-topology__connector-circle'}
    >
      <g transform={`translate(15, 15)`}>
        <image href={iconSrc} width={70} height={70} />
      </g>
    </DefaultNode>
  );
});

const customLayoutFactory = (type, graph) => new GridLayout(graph, {
});

export const TopologyCustomEdgeDemo = () => {
    const [selectedIds, setSelectedIds] = React.useState([]);
    const [deployments, setDeployments] = React.useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalAction, setModalAction] = React.useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [showSideBar, setShowSideBar] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [actionLoading, setActionLoading] = React.useState(false);
    const [logs, setLogs] = React.useState('');
    const [pods, setPods] = React.useState([]);
    const [sidebarContent, setSidebarContent] = React.useState('protocolStack');
    const [sidebarLoading, setSidebarLoading] = React.useState(false);
    const [currentLogIndex, setCurrentLogIndex] = React.useState(0);
    const [statusModalOpen, setStatusModalOpen] = React.useState(false);
    const [statusModalContent, setStatusModalContent] = React.useState({ deploymentName: '', state: '' });
    const [protocolStackData, setProtocolStackData] = React.useState({});
    const [edgeModalOpen, setEdgeModalOpen] = React.useState(false);
    const [selectedEdge, setSelectedEdge] = React.useState(null);

    const handleEdgeClick = React.useCallback((element) => {
      if (element && element.id) {
        console.log('Edge clicked:', element.id);
        setSelectedEdge(element);
        setEdgeModalOpen(true);
      } else {
        console.error('Element does not have id property:', element);
      }
    }, []);

    const fetchDeployments = React.useCallback(async () => {
      try {
        setLoading(true);
        const response = await api.get('kube/deployments/');
        const deploymentsData = response.data.map((deployment) => ({
          deployment_name: deployment.deployment_name,
          replicas: deployment.replicas,
        }));
        setDeployments((prevDeployments) => {
          if (JSON.stringify(prevDeployments) !== JSON.stringify(deploymentsData)) {
            return deploymentsData;
          }
          return prevDeployments;
        });
      } catch (error) {
        console.error('Failed to fetch deployments:', error);
      } finally {
        setLoading(false);
      }
    }, []);

    const fetchPods = React.useCallback(async () => {
      try {
        const response = await api.get('kube/pods/');
        // console.log('fetchPods response:', response.data);
        const podsData = response.data.pods.map((pod) => ({
          name: pod.name,
        }));
        setPods(podsData);
        // console.log('pod name:', podsData )
      } catch (error) {
        console.error('Failed to fetch pods:', error);
      }
    }, []);

    const fetchProtocolStackData = React.useCallback(async (nodeId) => {
      const authToken = localStorage.getItem('authToken');
      try {
        setSidebarLoading(true);
        const searchNodeId = nodeId.toLowerCase();
        const pod = pods.find(pod => pod.name.toLowerCase().includes(searchNodeId));
        if (pod) {
          const response = await api.get(`shark/protocolstack/${pod.name}/`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          
          // Check if the response data has the expected structure
          if (response.data && response.data.packets && Array.isArray(response.data.packets)) {
            const parsedData = response.data.packets.map((item) => ({
              ipAddress: item._source?.layers?.ip?.["ip.src"] || null,
              sctpSrcPort: item._source?.layers?.sctp?.["sctp.srcport"] || null,
              sctpDstPort: item._source?.layers?.sctp?.["sctp.dstport"] || null,
              sctpVerificationTag: item._source?.layers?.sctp?.["sctp.verification_tag"] || null,
              sctpAssocIndex: item._source?.layers?.sctp?.["sctp.assoc_index"] || null,
              sctpPort: item._source?.layers?.sctp?.["sctp.port"] || null,
              sctpChecksum: item._source?.layers?.sctp?.["sctp.checksum"] || null,
              sctpChecksumStatus: item._source?.layers?.sctp?.["sctp.checksum.status"] || null,
            }));
    
            console.log('Parsed Protocol Stack Data:', parsedData);
            setProtocolStackData(parsedData[0] || {}); // Display the first packet data for simplicity
          } else {
            setProtocolStackData({});
          }
        } else {
          setProtocolStackData({});
        }
      } catch (error) {
        console.error('Failed to fetch protocol stack data:', error);
        setProtocolStackData({});
      } finally {
        setSidebarLoading(false);
      }
    }, [pods]);

    React.useEffect(() => {
      fetchDeployments();
      fetchPods();
    }, [fetchDeployments, fetchPods]);

    React.useEffect(() => {
      if (selectedIds.length > 0) {
        fetchProtocolStackData(selectedIds[0]);
      }
    }, [selectedIds, fetchProtocolStackData]);

    const fetchLogs = React.useCallback(async (nodeId) => {
      try {
        setSidebarLoading(true);
        // console.log('Fetching logs for nodeId:', nodeId);
        // console.log('Current pods:', pods);
        let response;
        if (nodeId === 'AMF') {
          response = await api.get('kube/get_amf_logs/');
        } else if (nodeId === 'UPF') {
          response = await api.get('kube/get_upf_logs/');
        } else {
          const searchNodeId = nodeId.toLowerCase();
          const pod = pods.find(pod => pod.name.toLowerCase().includes(searchNodeId));
          // console.log('Found pod:', pod);
          if (pod) {
            response = await api.get(`kube/pods/${pod.name}/logs/`);
          } else {
            // console.log(`No matching pod found for nodeId: ${nodeId}`);
            setLogs([]);
            setSidebarLoading(false);
            return;
          }
        }
        // console.log('fetchLogs response:', response.data);
        if (Array.isArray(response.data)) {
          setLogs(response.data);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
        setLogs([]);
      } finally {
        setSidebarLoading(false);
      }
    }, [pods]);

    const pingGoogle = React.useCallback(async () => {
      try {
        setSidebarLoading(true);
        const response = await api.post('kube/ping_google/');
        if (response.data && response.data.output) {
          const lines = response.data.output.split('\n').map(line => ({ log: line }));
          setLogs(lines);
          setCurrentLogIndex(0);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error('Failed to ping Google:', error);
        setLogs([]);
      } finally {
        setSidebarLoading(false);
      }
    }, []);

    const curlGoogle = React.useCallback(async () => {
      try {
        setSidebarLoading(true);
        const response = await api.post('kube/curl_google/');
        if (response.data && response.data.output) {
          setLogs([{ timestamp: new Date().toISOString(), log: response.data.output }]);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error('Failed to curl Google:', error);
        setLogs([]);
      } finally {
        setSidebarLoading(false);
      }
    }, []);

    React.useEffect(() => {
      if (selectedIds.length > 0) {
        if (sidebarContent === 'protocolStack') {
          fetchProtocolStackData(selectedIds[0]);
        } else if (sidebarContent === 'logs') {
          fetchLogs(selectedIds[0]);
        } else if (sidebarContent === 'pingGoogle') {
          pingGoogle();
        } else if (sidebarContent === 'curlGoogle') {
          curlGoogle();
        }
      }
    }, [selectedIds, sidebarContent, fetchLogs, pingGoogle, curlGoogle, fetchProtocolStackData]);

    React.useEffect(() => {
      if (sidebarContent === 'pingGoogle' && logs.length > 0 && currentLogIndex < logs.length) {
        const timer = setTimeout(() => {
          setCurrentLogIndex(currentLogIndex + 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [currentLogIndex, logs, sidebarContent]);

    const determineNodeStatus = React.useCallback((nodeName) => {
      const searchNodeName = nodeName.toLowerCase() === 'rru' ? 'du' : nodeName.toLowerCase();
      const deployment = deployments.find(d => d.deployment_name.toLowerCase().includes(searchNodeName));
      return deployment && deployment.replicas > 0 ? NodeStatus.success : NodeStatus.danger;
    }, [deployments]);

    const handleStatusDecoratorClick = React.useCallback(async (nodeId) => {
      try {
        setSidebarLoading(true);
        // console.log('Fetching status for nodeId:', nodeId);
        let response;
        if (nodeId === 'AMF') {
          response = await api.get('kube/get_amf_deployments/');
        } else if (nodeId === 'UPF') {
          response = await api.get('kube/get_upf_deployments/');
        } else {
          const searchNodeId = nodeId.toLowerCase() === 'rru' ? 'du' : nodeId.toLowerCase();
          const deployment = deployments.find(d => d.deployment_name.toLowerCase().includes(searchNodeId));
          if (deployment) {
            const state = deployment.replicas > 0 ? 'Running' : 'Stopped';
            setStatusModalContent({ deploymentName: deployment.deployment_name, state });
            setStatusModalOpen(true);
          }
          return;
        }
        // console.log('fetchStatus response:', response.data);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const state = response.data[0].replicas > 0 ? 'Running' : 'Stopped';
          setStatusModalContent({ deploymentName: response.data[0].name, state });
          setStatusModalOpen(true);
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setSidebarLoading(false);
      }
    }, [deployments]);

    const nodes = React.useMemo(() => {
        const NODE_DIAMETER = 100;
        return [
            {
                id: 'UE',
                type: 'node',
                label: 'UE',
                labelPosition: LabelPosition.bottom,
                width: NODE_DIAMETER,
                height: NODE_DIAMETER,
                shape: NodeShape.rect,
                status: determineNodeStatus('UE'),
                x: 70,
                y: 150,
                data: {
                    badge: 'End Users',
                    isAlternate: false,
                },
                onStatusDecoratorClick: () => handleStatusDecoratorClick('UE'),
            },
            {
                id: 'RRU',
                type: 'node',
                label: 'RRU',
                labelPosition: LabelPosition.bottom,
                width: NODE_DIAMETER,
                height: NODE_DIAMETER,
                shape: NodeShape.rect,
                status: determineNodeStatus('DU'),
                x: 350,
                y: 150,
                data: {
                    badge: 'RAN',
                    isAlternate: false,
                },
                onStatusDecoratorClick: () => handleStatusDecoratorClick('DU'),
            },
            {
                id: 'DU',
                type: 'node',
                label: 'DU',
                labelPosition: LabelPosition.bottom,
                width: NODE_DIAMETER,
                height: NODE_DIAMETER,
                shape: NodeShape.rect,
                status: determineNodeStatus('DU'),
                x: 550,
                y: 150,
                data: {
                    badge: 'RAN',
                    isAlternate: false,
                },
                onStatusDecoratorClick: () => handleStatusDecoratorClick('DU'),
            },
            {
                id: 'CU',
                type: 'node',
                label: 'CU',
                labelPosition: LabelPosition.bottom,
                width: NODE_DIAMETER,
                height: NODE_DIAMETER,
                shape: NodeShape.rect,
                status: determineNodeStatus('CU'),
                x: 750,
                y: 150,
                data: {
                    badge: 'RAN',
                    isAlternate: false,
                },
                onStatusDecoratorClick: () => handleStatusDecoratorClick('CU'),
            },
            {
                id: 'AMF',
                type: 'node',
                label: 'AMF',
                labelPosition: LabelPosition.bottom,
                width: NODE_DIAMETER,
                height: NODE_DIAMETER,
                shape: NodeShape.rect,
                status: NodeStatus.success,
                x: 1090,
                y: 50,
                data: {
                    badge: 'Core',
                    isAlternate: false,
                },
                onStatusDecoratorClick: () => handleStatusDecoratorClick('AMF'),
            },
            {
                id: 'UPF',
                type: 'node',
                label: 'UPF',
                labelPosition: LabelPosition.bottom,
                width: NODE_DIAMETER,
                height: NODE_DIAMETER,
                shape: NodeShape.rect,
                status: NodeStatus.success,
                x: 1090,
                y: 250,
                data: {
                    badge: 'Core',
                    isAlternate: false,
                },
                onStatusDecoratorClick: () => handleStatusDecoratorClick('UPF'),
            },
            {
                id: 'Group-1',
                children: ['UE'],
                type: 'group',
                group: true,
                label: '',
                style: {
                    padding: 40,
                },
            },
            {
                id: 'Group-2',
                children: ['RRU', 'DU', 'CU'],
                type: 'group',
                group: true,
                label: '',
                style: {
                    padding: 40,
                },
            },
            {
                id: 'Group-3',
                children: ['AMF', 'UPF'],
                type: 'group',
                group: true,
                label: '',
                style: {
                    padding: 40,
                },
            },
        ];
    }, [determineNodeStatus, handleStatusDecoratorClick]);

    const edges = React.useMemo(() => [
        {
          id: `edge-1`,
          type: 'data-edge',
          source: 'UE',
          target: 'RRU',
          edgeStyle: EdgeStyle.dashedMd,
          animationSpeed: EdgeAnimationSpeed.medium,
        },
        {
          id: `edge-2`,
          type: 'data-edge',
          source: 'RRU',
          target: 'DU',
          edgeStyle: EdgeStyle.dashedMd,
          animationSpeed: EdgeAnimationSpeed.medium,
        },
        {
          id: `edge-3`,
          type: 'data-edge',
          source: 'DU',
          target: 'CU',
          edgeStyle: EdgeStyle.dashedMd,
          animationSpeed: EdgeAnimationSpeed.medium,
        },
        {
          id: `edge-4`,
          type: 'data-edge',
          source: 'CU',
          target: 'AMF',
          edgeStyle: EdgeStyle.dashedMd,
          animationSpeed: EdgeAnimationSpeed.medium,
        },
        {
          id: `edge-5`,
          type: 'data-edge',
          source: 'CU',
          target: 'UPF',
          edgeStyle: EdgeStyle.dashedMd,
          animationSpeed: EdgeAnimationSpeed.medium,
        },
    ], []);

    React.useEffect(() => {
      if (!loading) {
        // console.log('Nodes:', nodes);
        // console.log('Edges:', edges);
      }
    }, [loading, nodes, edges]);

    const controller = React.useMemo(() => {
      const customComponentFactory = (kind, type) => {
        const contextMenuItem = (label, i) => {
          if (label === '-') {
            return <ContextMenuSeparator component="li" key={`separator:${i.toString()}`} />;
          }
          return (
            <ContextMenuItem key={label} onClick={() => handleContextMenuAction(label)}>
              {label}
            </ContextMenuItem>
          );
        };
        const createContextMenuItems = (...labels) => labels.map(contextMenuItem);
        const contextMenu = createContextMenuItems('Start', 'Stop', 'Restart');
  
        switch (type) {
          case 'group':
            return DefaultGroup;
          default:
            switch (kind) {
              case ModelKind.graph:
                return withPanZoom()(GraphComponent);
              case ModelKind.node:
                return withDndDrop(nodeDropTargetSpec([CONNECTOR_SOURCE_DROP, CONNECTOR_TARGET_DROP, CREATE_CONNECTOR_DROP_TYPE]))(
                  withDragNode(nodeDragSourceSpec('node', true, true))(
                    withSelection()(
                      withContextMenu(() => contextMenu)((props) => <CustomNode {...props} setShowSideBar={setShowSideBar} onStatusDecoratorClick={handleStatusDecoratorClick} />)
                    )
                  )
                );
              case ModelKind.edge:
                return withSelection()(
                  withContextMenu(() => contextMenu)((props) => (
                    <DataEdge {...props} onSelect={() => handleEdgeClick(props.element)} />
                  ))
                );
              default:
                return undefined;
            }
        }
      };
      
        const newController = new Visualization();
          newController.registerLayoutFactory(customLayoutFactory);
          newController.registerComponentFactory(customComponentFactory);
          newController.addEventListener(SELECTION_EVENT, ids => {
              setSelectedIds(ids);
              setShowSideBar(true);
            });
          newController.fromModel({
            graph: {
              id: 'g1',
              type: 'graph',
              layout: 'Grid',
            },
            nodes,
            edges,
          });
          return newController;
      }, [nodes, edges, handleStatusDecoratorClick, handleEdgeClick]);

      React.useEffect(() => {
        if (controller) {
          // console.log('Updating Controller with new Nodes and Edges');
          controller.fromModel({
            graph: {
              id: 'g1',
              type: 'graph',
              layout: 'Grid',
            },
            nodes,
            edges,
          });
        }
      }, [controller, nodes, edges]);

    const handleContextMenuAction = (action) => {
      setModalAction(action);
      setModalOpen(true);
      setShowSideBar(false);
    };
    
    const getApiValueForNode = (nodeLabel) => {
        const mapping = {
            'CU': 'single_cu',
            'DU': 'single_du',
            'UE': 'single_ue',
            'RRU': 'single_du',
            // Add other mappings as necessary
        };
        return mapping[nodeLabel] || nodeLabel.toLowerCase();
    };

    const handleModalConfirm = async () => {
      setActionLoading(true);
      try {
        if (selectedIds.length === 0) {
          throw new Error('No node selected');
        }
    
        const nodeId = selectedIds[0];
        const selectedNode = nodes.find(node => node.id === nodeId);
    
        if (!selectedNode) {
          throw new Error('Node not found');
        }
    
        const nodeLabel = selectedNode.label;
        const apiValue = getApiValueForNode(nodeLabel);
    
        let response;
        switch (modalAction.toLowerCase()) {
          case 'start':
            response = await api.post(`/oai/start_${apiValue}/`);
            break;
          case 'stop':
            response = await api.post(`/oai/stop_${apiValue}/`);
            break;
          case 'restart':
            response = await api.post(`/kube/restart_${apiValue}/`);
            break;
          default:
            throw new Error('Unknown action');
        }
    
        if (response.status === 200) {
          setSnackbarMessage(`${modalAction} ${nodeId} executed successfully!`);
        } else {
          setSnackbarMessage(`${modalAction} ${nodeId} failed.`);
        }
    
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error executing action:', error);
        // eslint-disable-next-line no-undef
        setSnackbarMessage(`${modalAction} ${nodeId} failed : ${error.message}`);
        setSnackbarOpen(true);
      } finally {
        setModalOpen(false);
        setActionLoading(false);
      }
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleSnackbarClose = async (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
      setLoading(true);
      await fetchDeployments(); // Re-fetch the deployment data after setting loading to true
    };

    const selectedNodeId = selectedIds.length > 0 ? selectedIds[0] : '';

    const handleSidebarContentChange = (content) => {
      setSidebarContent(content);
    };
    
    const renderProtocolStack = () => (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {sidebarLoading ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              <>
                <TableRow>
                  <TableCell align="center" colSpan={2} style={{ fontWeight: 'bold', backgroundColor: '#F2F2F2' }}>IP Layer</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IP Address</TableCell>
                  <TableCell>{protocolStackData.ipAddress}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" colSpan={2} style={{ fontWeight: 'bold', backgroundColor: '#F2F2F2' }}>SCTP Layer</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>sctp.srcport</TableCell>
                  <TableCell>{protocolStackData.sctpSrcPort}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>sctp.dstport</TableCell>
                  <TableCell>{protocolStackData.sctpDstPort}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>sctp.verification_tag</TableCell>
                  <TableCell>{protocolStackData.sctpVerificationTag}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>sctp.assoc_index</TableCell>
                  <TableCell>{protocolStackData.sctpAssocIndex}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>sctp.port</TableCell>
                  <TableCell>{protocolStackData.sctpPort}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>sctp.checksum</TableCell>
                  <TableCell>{protocolStackData.sctpChecksum}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>sctp.checksum.status</TableCell>
                  <TableCell>{protocolStackData.sctpChecksumStatus}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );

    const renderLogsTable = () => (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '12px', backgroundColor: '#F2F2F2', width: '150px' }}>Timestamp</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '12px', backgroundColor: '#F2F2F2', width: 'calc(100% - 150px)' }}>Logs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sidebarLoading ? (
              <TableRow>
                <TableCell colSpan={2} align="center" style={{ height: '100px' }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell align="center" style={{ fontFamily: 'monospace', fontSize: '12px', width: '150px' }}>{log.timestamp}</TableCell>
                  <TableCell align="center" style={{ fontFamily: 'monospace', fontSize: '12px', width: 'calc(100% - 150px)' }}>{log.log}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No logs available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );

    const renderPingGoogleTable = () => (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {sidebarLoading ? (
              <TableRow>
                <TableCell colSpan={1} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              logs.slice(0, currentLogIndex + 1).map((log, index) => (
                <TableRow key={index}>
                  <TableCell style={{ backgroundColor: '#F2F2F2', fontFamily: 'monospace', fontSize: '12px' }}>{log.log}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );

    const renderCurlGoogleOutput = () => (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {sidebarLoading ? (
              <TableRow>
                <TableCell align="center" colSpan={1} style={{ height: '100px' }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px' }}>
                    {log.log}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={1}>No curl output available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );

    const renderSidebarContent = () => {
      switch (sidebarContent) {
        case 'logs':
          return renderLogsTable();
        case 'pingGoogle':
          return renderPingGoogleTable();
        case 'curlGoogle':
          return renderCurlGoogleOutput();
        case 'protocolStack':
          return renderProtocolStack();
        default:
          return null;
      }
    };

    const createButtonStyles = {
      textTransform: 'none' // Prevent text from being uppercased
    };

    const topologySideBar = (
        <TopologySideBar
          className="topology-example-sidebar"
          show={showSideBar && selectedIds.length > 0}
          onClose={() => setSelectedIds([])}
        >
        <Box p={2}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => handleSidebarContentChange('protocolStack')}
            style={{
              marginRight: '10px',
              backgroundColor: sidebarContent === 'protocolStack' ? '#2E3B55' : undefined,
              borderRadius: '20px',
              ...createButtonStyles,
              fontSize: '12px',
              height: '24px'
            }}
          >
            Protocol Stack
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSidebarContentChange('logs')}
            style={{
              marginRight: '10px',
              backgroundColor: sidebarContent === 'logs' ? '#004080' : undefined,
              borderRadius: '20px',
              ...createButtonStyles,
              fontSize: '12px',
              height: '24px'
            }}
          >
            Logs
          </Button>
          {selectedIds.length > 0 && selectedIds[0] === 'UE' && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSidebarContentChange('pingGoogle')}
                style={{
                  marginRight: '10px',
                  backgroundColor: sidebarContent === 'pingGoogle' ? '#2E3B55' : undefined,
                  borderRadius: '20px',
                  ...createButtonStyles,
                  fontSize: '12px',
                  height: '24px'
                }}
              >
                Ping
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSidebarContentChange('curlGoogle')}
                style={{
                  marginRight: '10px',
                  backgroundColor: sidebarContent === 'curlGoogle' ? '#2E3B55' : undefined,
                  borderRadius: '20px',
                  ...createButtonStyles,
                  fontSize: '12px',
                  height: '24px'
                }}
              >
                Curl
              </Button>
            </>
          )}
        </Box>
        {renderSidebarContent()}  
        </TopologySideBar>
    );

    const controlButtons = createTopologyControlButtons({
        ...defaultControlButtonsOptions,
        zoomInCallback: action(() => {
        if (controller.getGraph()) {
            controller.getGraph().scaleBy(4 / 3);
        }
        }),
        zoomOutCallback: action(() => {
        if (controller.getGraph()) {
            controller.getGraph().scaleBy(0.75);
        }
        }),
        fitToScreenCallback: action(() => {
        if (controller.getGraph()) {
            controller.getGraph().fit(80);
        }
        }),
        resetViewCallback: action(() => {
        if (controller.getGraph()) {
            controller.getGraph().reset();
        }
        }),
        legend: false
    });

    const cancelButtonStyles = {
        backgroundColor: '#E3AE14',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#E39514',
          color: '#fff'
        }
    };

  return (
    <TopologyView sideBar={topologySideBar} controlBar={<TopologyControlBar controlButtons={controlButtons} />}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
      <VisualizationProvider controller={controller}>
        <VisualizationSurface state={{ selectedIds }} />
      </VisualizationProvider>
      )}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {modalAction}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to {modalAction} {selectedNodeId}?
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", marginTop: '-10px', marginRight: '16px' }}>
          <Button sx={cancelButtonStyles} onClick={handleModalClose} color="primary" style={{minWidth: '80px', borderRadius: '20px', ...createButtonStyles}}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleModalConfirm} color="primary" autoFocus disabled={actionLoading} style={{ minWidth: '80px', borderRadius: '20px', ...createButtonStyles }}>
            <Box display="flex" alignItems="center" justifyContent="center">
                {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
            </Box>
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        aria-labelledby="status-dialog-title"
        aria-describedby="status-dialog-description"
      >
        <DialogTitle id="status-dialog-title">
          Deployment Status
        </DialogTitle>
        <DialogContent>
          <p><strong>Deployment Name:</strong> {statusModalContent.deploymentName}</p>
          <p><strong>State:</strong> {statusModalContent.state}</p>
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", marginTop: '-10px', marginRight: '16px' }}>
          <Button sx={cancelButtonStyles} onClick={() => setStatusModalOpen(false)} color="primary" style={{ minWidth: '80px', borderRadius: '20px', ...createButtonStyles }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={edgeModalOpen}
        onClose={() => setEdgeModalOpen(false)}
        aria-labelledby="edge-dialog-title"
        aria-describedby="edge-dialog-description"
      >
        <DialogTitle id="edge-dialog-title">
          Edge Details
        </DialogTitle>
        <DialogContent>
          <p><strong>Edge ID:</strong> {selectedEdge ? selectedEdge.getId() : ''}</p>
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", marginTop: '-10px', marginRight: '16px' }}>
          <Button sx={cancelButtonStyles} onClick={() => setEdgeModalOpen(false)} color="primary" style={{ minWidth: '80px', borderRadius: '20px', ...createButtonStyles }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </TopologyView>
  );
};
export default TopologyCustomEdgeDemo;
