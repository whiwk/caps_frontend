import React, { useEffect, useContext, useRef, useState, useCallback, useMemo } from 'react';
import '@patternfly/patternfly/patternfly.css';
import './TopologyGraph.css';
import './Terminal.css';
import api from '../services/apiService';
import { RefreshContext } from '../contexts/RefreshContext';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import MuiAlert from '@mui/material/Alert';

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

const DataEdge = React.memo(({ element, onEdgeClick, isSuccess, ...rest }) => {
  const handleEdgeClick = (e) => {
    e.stopPropagation();
    onEdgeClick(element);
  };

  const data = element.getData();
  const edgeClass = data?.isSuccess ? 'custom-edge-success' : 'custom-edge-failure';

  return (
    <DefaultEdge
      element={element}
      startTerminalType={EdgeTerminalType.circle}
      endTerminalType={EdgeTerminalType.circle}
      onClick={handleEdgeClick}
      className={edgeClass}
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
    event.stopPropagation();
    onSelect && onSelect(event);
    onContextMenu && onContextMenu(event);
    setShowSideBar(false);
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
    >
      <g transform={`translate(15, 15)`}>
        <image href={iconSrc} width={70} height={70} />
      </g>
    </DefaultNode>
  );
});

const customLayoutFactory = (type, graph) => new GridLayout(graph, {
});

export const TopologyGraph = () => {
    const { refreshTopology, setRefreshTopology } = useContext(RefreshContext);
    const [selectedIds, setSelectedIds] = useState([]);
    const [deployments, setDeployments] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showSideBar, setShowSideBar] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [pods, setPods] = useState([]);
    const [sidebarContent, setSidebarContent] = useState('protocolStack');
    const [sidebarLoading, setSidebarLoading] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [statusModalContent, setStatusModalContent] = useState({ deploymentName: '', state: '' });
    const [protocolStackData, setProtocolStackData] = useState({});
    const [edgeModalOpen, setEdgeModalOpen] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
    const [customMessage, setCustomMessage] = useState('');
    const [dangerStatus, setDangerStatus] = useState(false);
    const [warningModalOpen, setWarningModalOpen] = useState(false);
    const [warningModalMessage, setWarningModalMessage] = useState('');
    const [userInfo, setUserInfo] = useState({ cu_matches: 0, du_matches: 0, ue_matches: 0 });

    const handleEdgeClick = useCallback((element) => {
      if (element && element.id) {
        setSelectedEdge(element);
        setEdgeModalOpen(true);
      } else {
        console.error('Element does not have id property:', element);
      }
    }, []);

    const fetchDeployments = useCallback(async () => {
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

    const fetchPods = useCallback(async () => {
      try {
        const response = await api.get('kube/pods/');
        const podsData = response.data.pods.map((pod) => ({
          name: pod.name,
        }));
        setPods(podsData);
      } catch (error) {
        console.error('Failed to fetch pods:', error);
      }
    }, []);

    const handleTopologyRefresh = async () => {
      setLoading(true);
      await fetchPods();
      setLoading(false);
    };

    const fetchProtocolStackData = useCallback(async (nodeId) => {
      const authToken = localStorage.getItem('authToken');
      const currentRequestId = Date.now(); // Unique ID for the current request
      requestIdRef.current = currentRequestId; // Store it in the ref
    
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
    
          if (response.data && response.data.packets && Array.isArray(response.data.packets)) {
            const parsedData = response.data.packets.map((item) => {
              const sctp = item._source?.layers?.sctp || {};
              const sctpChunk = Object.values(sctp).find(value => value?.['sctp.chunk_type']);
    
              const parsedItem = {
                ipAddress: item._source?.layers?.ip?.["ip.src"] || null,
                sctpSrcPort: sctp["sctp.srcport"] || null,
                sctpDstPort: sctp["sctp.dstport"] || null,
                sctpVerificationTag: sctp["sctp.verification_tag"] || null,
                sctpAssocIndex: sctp["sctp.assoc_index"] || null,
                sctpPort: sctp["sctp.port"] || null,
                sctpChecksum: sctp["sctp.checksum"] || null,
                sctpChecksumStatus: sctp["sctp.checksum.status"] || null,
                sctpChunkType: sctpChunk?.["sctp.chunk_type"] || null,
                sctpChunkFlags: sctpChunk?.["sctp.chunk_flags"] || null,
                sctpChunkLength: sctpChunk?.["sctp.chunk_length"] || null,
                sctpParameterType: sctpChunk?.["Heartbeat info parameter (Information: 52 bytes)"]?.["sctp.parameter_type"] || null,
                sctpParameterLength: sctpChunk?.["Heartbeat info parameter (Information: 52 bytes)"]?.["sctp.parameter_length"] || null,
                sctpHeartbeatInformation: sctpChunk?.["Heartbeat info parameter (Information: 52 bytes)"]?.["sctp.parameter_heartbeat_information"] || null,
              };
    
              return parsedItem;
            }).filter(packet => packet.sctpSrcPort !== null && packet.sctpDstPort !== null);
    
            if (requestIdRef.current === currentRequestId) {
              setProtocolStackData(parsedData[0] || {}); // Display the first packet data that contains SCTP information
            }
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
    
    // useRef to store the current request ID
    const requestIdRef = useRef(null);
    
    useEffect(() => {
      if (selectedIds.length > 0) {
        fetchProtocolStackData(selectedIds[0]);
      }
    }, [selectedIds, fetchProtocolStackData]);

    useEffect(() => {
      fetchDeployments();
      fetchPods();
    }, [fetchDeployments, fetchPods]);

    useEffect(() => {
      if (refreshTopology) {
        fetchUserInfo();
        fetchDeployments();
        fetchPods();
        setRefreshTopology(false);
      }
    }, [refreshTopology, fetchDeployments, setRefreshTopology, fetchPods]);

    useEffect(() => {
      if (selectedIds.length > 0) {
        fetchProtocolStackData(selectedIds[0]);
      }
    }, [selectedIds, fetchProtocolStackData]);

    const fetchLogs = useCallback(async (nodeId) => {
      try {
        setSidebarLoading(true);
        let response;
        if (nodeId === 'AMF') {
          response = await api.get('kube/get_amf_logs/');
        } else if (nodeId === 'UPF') {
          response = await api.get('kube/get_upf_logs/');
        } else {
          const searchNodeId = nodeId.toLowerCase();
          const pod = pods.find(pod => pod.name.toLowerCase().includes(searchNodeId));
          if (pod) {
            response = await api.get(`kube/pods/${pod.name}/logs/`);
          } else {
            setLogs([]);
            setSidebarLoading(false);
            return;
          }
        }
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

    const determineNodeStatus = useCallback((nodeName) => {
      if (nodeName === 'AMF' || nodeName === 'UPF') {
        return NodeStatus.success;
      }
    
      const searchNodeName = nodeName.toLowerCase() === 'rru' ? 'du' : nodeName.toLowerCase();
      const deployment = deployments.find(d => d.deployment_name.toLowerCase().includes(searchNodeName));
    
      if (!deployment) {
        return NodeStatus.danger;
      }
    
      return deployment.replicas > 0 ? NodeStatus.success : NodeStatus.warning;
    }, [deployments]);

    const handleStatusDecoratorClick = useCallback(async (nodeId) => {
      try {
        setSidebarLoading(true);
        let response;
        let dangerStatus = false;
    
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
            setCustomMessage(''); // Reset custom message
          } else {
            setStatusModalContent('Component not available. Please configure the F1 CU and F1 DU port for the CU/DU components to make it available. You can configure it on the Configuration Panel below.');
            dangerStatus = true;
          }
        }
        
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          const state = response.data[0].replicas > 0 ? 'Running' : 'Stopped';
          setStatusModalContent({ deploymentName: response.data[0].name, state });
          setCustomMessage(''); // Reset custom message
        }
    
        setDangerStatus(dangerStatus); // Set the flag for danger status
        setStatusModalOpen(true);
    
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setSidebarLoading(false);
      }
    }, [deployments]);

    const renderStatusModalContent = () => {
      if (dangerStatus) {
        return (
          <Dialog
            open={statusModalOpen}
            onClose={() => setStatusModalOpen(false)}
            aria-labelledby="status-dialog-title"
            aria-describedby="status-dialog-description"
          >
            <DialogTitle id="warning-dialog-title">Warning</DialogTitle>
            <DialogContent>
              {statusModalContent}
            </DialogContent>
            <DialogActions style={{ justifyContent: "flex-end", marginTop: '-10px', marginRight: '16px' }}>
              <Button sx={cancelButtonStyles} onClick={() => setStatusModalOpen(false)} color="primary" style={{ minWidth: '80px', borderRadius: '20px', ...createButtonStyles }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        );
      } else {
        return (
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
              {customMessage && <p><strong>Note:</strong> {customMessage}</p>}
            </DialogContent>
            <DialogActions style={{ justifyContent: "flex-end", marginTop: '-10px', marginRight: '16px' }}>
              <Button sx={cancelButtonStyles} onClick={() => setStatusModalOpen(false)} color="primary" style={{ minWidth: '80px', borderRadius: '20px', ...createButtonStyles }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        );
      }
    };

    const nodes = useMemo(() => {
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
                    status: determineNodeStatus('UE'),
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
                    status: determineNodeStatus('DU'),
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
                    status: determineNodeStatus('DU'),
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
                    status: determineNodeStatus('CU'),
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
                    status: NodeStatus.success,
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
                    status: NodeStatus.success,
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

    const edges = useMemo(() => [
      {
        id: `air-interface`,
        type: 'data-edge',
        source: 'UE',
        target: 'RRU',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.medium,
        data: { isSuccess: userInfo.du_matches === 12 && userInfo.ue_matches === 9 },
      },
      {
        id: `Open-Fronthaul-interface`,
        type: 'data-edge',
        source: 'RRU',
        target: 'DU',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.medium,
        data: { isSuccess: userInfo.du_matches === 12 },
      },
      {
        id: `F1-interface`,
        type: 'data-edge',
        source: 'DU',
        target: 'CU',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.medium,
        data: { isSuccess: userInfo.cu_matches === 12 && userInfo.du_matches === 12 },
      },
      {
        id: `N2-interface`,
        type: 'data-edge',
        source: 'CU',
        target: 'AMF',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.medium,
        data: { isSuccess: userInfo.cu_matches === 12 },
      },
      {
        id: `N3-interface`,
        type: 'data-edge',
        source: 'CU',
        target: 'UPF',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.medium,
        data: { isSuccess: userInfo.cu_matches === 12 },
      },
    ], [userInfo]);

    useEffect(() => {
      if (!loading) {
        // console.log('Nodes:', nodes);
        // console.log('Edges:', edges);
      }
    }, [loading, nodes, edges]);

    const controller = useMemo(() => {
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

        const createContextMenu = (nodeStatus) => {
          setWarningModalOpen(false)
          if (nodeStatus === NodeStatus.danger) {
              setStatusModalOpen(true); 
          }
          switch (nodeStatus) {
              case NodeStatus.success:
                  return createContextMenuItems('Stop', 'Restart');
              case NodeStatus.warning:
                  return createContextMenuItems('Start');
              default:
                  return [];
          }
        };
    
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
                      withContextMenu((element) => {
                        return createContextMenu(element.getData().status);
                      })(
                        (props) => <CustomNode {...props} setShowSideBar={setShowSideBar} onStatusDecoratorClick={handleStatusDecoratorClick} />
                      )
                    )
                  )
                );
              case ModelKind.edge:
                return withSelection()((props) => {
                  const data = props.element.getData();
                  return (
                    <DataEdge
                      {...props}
                      onSelect={() => handleEdgeClick(props.element)}
                      isSuccess={data?.isSuccess}
                    />
                  );
                });
              default:
                return undefined;
            }
        }
      };
    
      const newController = new Visualization();
      newController.registerLayoutFactory(customLayoutFactory);
      newController.registerComponentFactory(customComponentFactory);
      newController.addEventListener(SELECTION_EVENT, ids => {
        const selectedNodeId = ids[0];
        const selectedNode = nodes.find(node => node.id === selectedNodeId);
        const nodeStatus = selectedNode ? determineNodeStatus(selectedNode.id) : null;
    
        if (selectedNodeId === 'AMF' || selectedNodeId === 'UPF') {
          setSelectedIds(ids);
          setShowSideBar(true);
        } else if (nodeStatus === NodeStatus.danger) {
          handleStatusDecoratorClick(selectedNodeId);
          setShowSideBar(false);
        } else if (nodeStatus === NodeStatus.warning) {
          setWarningModalMessage(`You must start the component ${selectedNodeId} first.`);
          setWarningModalOpen(true);
          setShowSideBar(false);
          setSelectedIds(ids);
        } else {
          setSelectedIds(ids);
          setShowSideBar(true);
        }
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
    }, [nodes, edges, handleStatusDecoratorClick, handleEdgeClick, determineNodeStatus]);

      useEffect(() => {
        if (controller) {
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
        };
        return mapping[nodeLabel] || nodeLabel.toLowerCase();
    };

    const handleModalConfirm = async () => {
      setActionLoading(true);
      try {
        if (selectedIds.length === 0) {
          throw new Error('Please try again');
        }
    
        const nodeId = selectedIds[0];
        const selectedNode = nodes.find(node => node.id === nodeId);
    
        if (!selectedNode) {
          alert('Node not recognized. Please select a valid node.');
          throw new Error('Node not recognized');
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
          setSnackbarSeverity('success');
          setSnackbarMessage(`${modalAction} ${nodeId}: success!`);
        } else {
          setSnackbarSeverity('error');
          setSnackbarMessage(`${modalAction} ${nodeId}: failed.`);
        }
    
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error executing action:', error);
        setSnackbarSeverity('error');
        setSnackbarMessage(`Failed: ${error.message}`);
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
            <TableRow>
              <TableCell align="center" colSpan={2} style={{ fontWeight: 'bold', backgroundColor: '#F2F2F2' }}>IP Layer</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IP Address</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.ipAddress ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" colSpan={2} style={{ fontWeight: 'bold', backgroundColor: '#F2F2F2' }}>SCTP Layer</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.srcport</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpSrcPort ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.dstport</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpDstPort ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.verification_tag</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpVerificationTag ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.assoc_index</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpAssocIndex ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.port</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpPort ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.checksum</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpChecksum ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.checksum.status</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpChecksumStatus ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.chunk_type</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpChunkType ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.chunk_flags</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpChunkFlags ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.chunk_length</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpChunkLength ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.parameter_type</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpParameterType ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.parameter_length</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpParameterLength ?? 'null')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sctp.parameter_heartbeat_information</TableCell>
              <TableCell>
                {sidebarLoading ? <CircularProgress size={20} /> : (protocolStackData.sctpHeartbeatInformation ?? 'null')}
              </TableCell>
            </TableRow>
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

    const renderSidebarContent = () => {      
      switch (sidebarContent) {
        case 'logs':
          return renderLogsTable();
        case 'protocolStack':
          return renderProtocolStack();
        case 'shell':
          return <Terminal />;
        default:
          return null;
      }
    };

    const createButtonStyles = {
      textTransform: 'none'
    };

    const renderWarningModal = () => (
      <Dialog
        open={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        aria-labelledby="warning-dialog-title"
        aria-describedby="warning-dialog-description"
      >
        <DialogTitle id="warning-dialog-title">Warning</DialogTitle>
        <DialogContent>{warningModalMessage}</DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", marginTop: '-10px', marginRight: '16px' }}>
          <Button sx={cancelButtonStyles} onClick={() => setWarningModalOpen(false)} color="primary" style={{ minWidth: '80px', borderRadius: '20px', ...createButtonStyles }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );

    const handleRefresh = async () => {
      const selectedNodeId = selectedIds.length > 0 ? selectedIds[0] : '';
      switch (sidebarContent) {
        case 'logs':
          await fetchLogs(selectedNodeId);
          break;
        case 'protocolStack':
          await fetchProtocolStackData(selectedNodeId);
          break;
        default:
          break;
      }
    };

    const topologySideBar = (
      <TopologySideBar
        className="topology-example-sidebar"
        show={showSideBar && selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
      >
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <div>
              {selectedIds.length > 0 && selectedIds[0] !== 'AMF' && selectedIds[0] !== 'UPF' && (
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
              )}
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSidebarContentChange('shell')}
                  style={{
                    marginRight: '10px',
                    backgroundColor: sidebarContent === 'shell' ? '#2E3B55' : undefined,
                    borderRadius: '20px',
                    ...createButtonStyles,
                    fontSize: '12px',
                    height: '24px'
                  }}
                >
                  Shell
                </Button>
              )}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefresh}
              style={{
                borderRadius: '20px',
                ...createButtonStyles,
                fontSize: '12px',
                height: '24px',
                backgroundColor: '#F2B90F'
              }}
            >
              <RefreshIcon style={{ fontSize: '20px', color: '#FFF' }} />
            </Button>
          </Box>
        </Box>
        {renderSidebarContent()}
      </TopologySideBar>
    );

    const TopologyControlBarWithRefresh = ({ controller, onRefresh }) => {
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
        legend: false,
      });
    
      const refreshButton = {
        id: 'refresh',
        icon: <RefreshIcon viewBox="0 0 20 20" style={{ width: 16, height: 16 }} />,
        tooltip: 'Refresh Topology',
        ariaLabel: 'Refresh Topology',
        callback: onRefresh,
        disabled: false,
        hidden: false,
      };
    
      return (
        <TopologyControlBar
          controlButtons={[...controlButtons, refreshButton]}
        />
      );
    };

    const cancelButtonStyles = {
        backgroundColor: '#E3AE14',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#E39514',
          color: '#fff'
        }
    };

    const topologyControlBar = (
      <TopologyControlBarWithRefresh controller={controller} onRefresh={handleTopologyRefresh} />
    );  

    const fetchUserInfo = async () => {
      try {
        const response = await api.get('user/information/');
        setUserInfo({
          cu_matches: response.data.cu_matches,
          du_matches: response.data.du_matches,
          ue_matches: response.data.ue_matches,
        });
      } catch (error) {
        console.error('Failed to fetch user information:', error);
      }
    };

    useEffect(() => {
      fetchUserInfo();
    }, []);

    return (
      <TopologyView sideBar={topologySideBar} controlBar={topologyControlBar}>
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
                {actionLoading ? <CircularProgress size={25} color="inherit" /> : 'Confirm'}
              </Box>
            </Button>
          </DialogActions>
        </Dialog>
        {renderStatusModalContent()}
        {renderWarningModal()}
        <Dialog
          open={edgeModalOpen}
          onClose={() => setEdgeModalOpen(false)}
          aria-labelledby="edge-dialog-title"
          aria-describedby="edge-dialog-description"
        >
          <DialogTitle id="edge-dialog-title">
            Link Details
          </DialogTitle>
          <DialogContent>
            <p><strong>Interface Name:</strong> {selectedEdge ? selectedEdge.getId() : ''}</p>
            <p><strong>Link Status:</strong> {selectedEdge && selectedEdge.getData().isSuccess ? 'Connected' : 'Disconnected'}</p>
          </DialogContent>
          <DialogActions style={{ justifyContent: "flex-end", marginTop: '-10px', marginRight: '16px' }}>
            <Button sx={cancelButtonStyles} onClick={() => setEdgeModalOpen(false)} color="primary" style={{ minWidth: '80px', borderRadius: '20px', ...createButtonStyles }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </TopologyView>
    );
};

const Terminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [podName, setPodName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [websocketUrl, setWebsocketUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalBodyRef = useRef(null);
  const websocketRef = useRef(null);
  const outputBuffer = useRef('');

  useEffect(() => {
    // Fetch the pod name and namespace
    const fetchPodAndNamespace = async () => {
      try {
        const podResponse = await api.get('/kube/pods/');
        const userResponse = await api.get('user/information/'); // Assuming you have an endpoint to get user info

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
          setIsProcessing(false);
        }
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsProcessing(false); // Ensure the prompt is displayed if WebSocket closes unexpectedly
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsProcessing(false); // Ensure the prompt is displayed if WebSocket errors
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
      if (websocketRef.current) {
        websocketRef.current.send(
          JSON.stringify({
            pod_name: podName,
            namespace: namespace,
            command: 'stop',
          })
        );
      }
      setOutput((prevOutput) => [...prevOutput, '^C']);
    }
  }, [podName, namespace]);

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

  useEffect(() => {
    if (!isProcessing && terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [isProcessing]);

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
      <div className="terminal-body" ref={terminalBodyRef}>
        <div className="terminal-output">
          {output.map((entry, index) => (
            <div key={index}>
              <div className="prompt-container">
                <div className="prompt">{`orca\\ue\\shell>`}</div>
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
              <div className="prompt">orca\ue\shell&gt;</div>
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
    </div>
  );
};

export default TopologyGraph;
