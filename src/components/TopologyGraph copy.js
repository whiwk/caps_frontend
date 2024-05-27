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

const CONNECTOR_SOURCE_DROP = 'connector-src-drop';
const CONNECTOR_TARGET_DROP = 'connector-src-drop';

const DataEdge = React.memo(({ element, ...rest }) => (
  <DefaultEdge
    element={element}
    startTerminalType={EdgeTerminalType.circle}
    endTerminalType={EdgeTerminalType.circle} {...rest}
  />
));

const CustomNode = React.memo(({
  element,
  selected,
  onSelect,
  onContextMenu,
  contextMenuOpen,
  setShowSideBar,
  ...rest
}) => {
  const nodeId = element.getId();
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
  const data = element.getData();
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
    const [sidebarContent, setSidebarContent] = React.useState('logs');

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

    React.useEffect(() => {
      fetchDeployments();
      fetchPods();
    }, [fetchDeployments, fetchPods]);

    const fetchLogs = React.useCallback(async (nodeId) => {
      try {
        // console.log('Fetching logs for nodeId:', nodeId);
        // console.log('Current pods:', pods);
        const searchNodeId = nodeId.toLowerCase() === 'rru' ? 'du' : nodeId.toLowerCase();
        const pod = pods.find(pod => pod.name.toLowerCase().includes(searchNodeId));
        // console.log('Found pod:', pod);
        if (pod) {
          const response = await api.get(`kube/pods/${pod.name}/logs/`);
          // console.log('fetchLogs response:', response.data);
          if (Array.isArray(response.data)) {
            setLogs(response.data);
          } else {
            setLogs([]);
          }
        } else {
          // console.log(`No matching pod found for nodeId: ${nodeId}`);
          setLogs([]);
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
        setLogs([]);
      }
    }, [pods]);

    const pingGoogle = React.useCallback(async () => {
      try {
        const response = await api.post('kube/ping_google/');
        if (response.data && response.data.output) {
          setLogs([{ timestamp: new Date().toISOString(), log: response.data.output }]);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error('Failed to ping Google:', error);
        setLogs([]);
      }
    }, []);

    const curlGoogle = React.useCallback(async () => {
      try {
        const response = await api.post('kube/curl_google/');
        if (response.data && response.data.output) {
          setLogs([{ timestamp: new Date().toISOString(), log: response.data.output }]);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error('Failed to curl Google:', error);
        setLogs([]);
      }
    }, []);

    React.useEffect(() => {
      if (selectedIds.length > 0) {
        if (sidebarContent === 'logs') {
          fetchLogs(selectedIds[0]);
        } else if (sidebarContent === 'pingGoogle') {
          pingGoogle();
        } else if (sidebarContent === 'curlGoogle') {
          curlGoogle();
        }
      }
    }, [selectedIds, sidebarContent, fetchLogs, pingGoogle, curlGoogle]);

    const determineNodeStatus = React.useCallback((nodeName) => {
        const deployment = deployments.find(d => d.deployment_name.toLowerCase().includes(nodeName.toLowerCase()));
        return deployment && deployment.replicas > 0 ? NodeStatus.success : NodeStatus.danger;
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
    }, [determineNodeStatus]);

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
                        withContextMenu(() => contextMenu)((props) => <CustomNode {...props} setShowSideBar={setShowSideBar} />)
                      )
                    )
                  );
                case ModelKind.edge:
                  return withSelection()(
                    withContextMenu(() => contextMenu)(DataEdge)
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
      }, [nodes, edges]);

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

    const topologySideBar = (
        <TopologySideBar
          className="topology-example-sidebar"
          show={showSideBar && selectedIds.length > 0}
          onClose={() => setSelectedIds([])}
        >
          <Box p={2}>
            <Button variant="contained" onClick={() => handleSidebarContentChange('logs')} style={{ marginRight: 10 }}>
              Fetch Logs
            </Button>
            {selectedIds.length > 0 && selectedIds[0] === 'UE' && (
              <>
                <Button variant="contained" onClick={() => handleSidebarContentChange('pingGoogle')} style={{ marginRight: 10 }}>
                  Ping Google
                </Button>
                <Button variant="contained" onClick={() => handleSidebarContentChange('curlGoogle')}>
                  Curl Google
                </Button>
              </>
            )}
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Logs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.log}</TableCell>
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
        <DialogActions>
          <Button sx={cancelButtonStyles} onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleModalConfirm} color="primary" autoFocus disabled={actionLoading} style={{ minWidth: '80px' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
                {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
            </Box>
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
