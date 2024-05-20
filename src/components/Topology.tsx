import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MobileAltIcon as Icon1, ClusterIcon as Icon2, NetworkIcon as Icon3 } from '@patternfly/react-icons';
import '@patternfly/patternfly/patternfly.css';
import './Topology.css'
import api from '../services/apiService';
import {
  action,
  ColaLayout,
  ComponentFactory,
  CREATE_CONNECTOR_DROP_TYPE,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  Edge,
  EdgeAnimationSpeed,
  EdgeModel,
  EdgeStyle,
  EdgeTerminalType,
  Graph,
  GraphComponent,
  LabelPosition,
  Layout,
  LayoutFactory,
  Model,
  ModelKind,
  Node,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  NodeModel,
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
  WithContextMenuProps,
  ContextMenuSeparator,
  ContextMenuItem,
  withDndDrop,
  withDragNode,
  WithDragNodeProps,
  withPanZoom,
  withSelection,
  WithSelectionProps
} from '@patternfly/react-topology';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

interface Deployment {
  deployment_name: string;
  replicas: number;
}

interface CustomNodeProps {
  element: Node;
  setShowSideBar: (show: boolean) => void;
}

interface DataEdgeProps {
  element: Edge;
}

const CONNECTOR_SOURCE_DROP = 'connector-src-drop';
const CONNECTOR_TARGET_DROP = 'connector-src-drop';

const DataEdge: React.FC<DataEdgeProps> = ({ element, ...rest }) => (
  <DefaultEdge
    element={element}
    startTerminalType={EdgeTerminalType.circle}
    endTerminalType={EdgeTerminalType.circle}
    {...rest}
  />
);

const CustomNode: React.FC<CustomNodeProps & WithSelectionProps & WithDragNodeProps & WithContextMenuProps> = ({
  element,
  selected,
  onContextMenu, 
  contextMenuOpen,
  setShowSideBar,
  onSelect,
  ...rest
}) => {
  const nodeId = element.getId();
  // let Icon;

  // if (nodeId === 'UE') {
  //   Icon = Icon1;
  // } else if (['RRU', 'DU', 'CU'].includes(nodeId)) {
  //   Icon = Icon2;
  // } else if (['AMF', 'UPF'].includes(nodeId)) {
  //   Icon = Icon3;
  // }

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

  const handleContextMenu = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
    event.stopPropagation(); // Ensure the event doesn't propagate
    if (onSelect) {
      onSelect(event); // Ensure the event object is passed to onSelect
    }
    if (onContextMenu) {
      onContextMenu(event);
    }
    setShowSideBar(false); // Hide the sidebar when context menu is triggered
  };

  const shouldShowContextMenu = nodeId !== 'AMF' && nodeId !== 'UPF' && nodeId !== 'RRU';

  return (
    <DefaultNode
      element={element}
      onContextMenu={shouldShowContextMenu ? handleContextMenu : undefined}
      contextMenuOpen={contextMenuOpen}
      showStatusDecorator
      selected={selected}
      onSelect={onSelect}
      labelPosition={LabelPosition.right}
      {...rest}
    >
      <g transform={`translate(12, 12)`}>
        {/* <Icon style={{ color: '#393F44' }} width={30} height={30} /> */}
        <image href={iconSrc} width={60} height={60} />
      </g>
    </DefaultNode>
  );
};

const customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined =>
  new ColaLayout(graph, { layoutOnDrag: false });

const createContextMenuItems = (
  handleContextMenuAction: (action: string) => void,
  ...labels: string[]
): React.ReactElement[] => {
  return labels.map((label, i) => {
    if (label === '-') {
      return <ContextMenuSeparator component="li" key={`separator:${i.toString()}`} />;
    }
    return (
      <ContextMenuItem key={label} onClick={() => handleContextMenuAction(label)}>
        {label}
      </ContextMenuItem>
    );
  });
};

export const TopologyCustomEdgeDemo: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [nodes, setNodes] = useState<NodeModel[]>([]);
  const [edges, setEdges] = useState<EdgeModel[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSideBar, setShowSideBar] = useState(false);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const response = await api.get('kube/deployments/');
        const deploymentsData = response.data.map((deployment: any) => ({
          deployment_name: deployment.deployment_name,
          replicas: deployment.replicas
        }));
        setDeployments(deploymentsData);
        const { nodes: updatedNodes, edges: updatedEdges } = updateNodeStatuses(deploymentsData);
        setNodes(updatedNodes);
        setEdges(updatedEdges);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Failed to fetch deployments:', error);
      }
    };
    fetchDeployments();
  }, []);


  const updateNodeStatuses = (deploymentsData) => {
    const NODE_DIAMETER = 80;
    const NODES_INIT: NodeModel[] = [
      {
        id: 'UE',
        type: 'node',
        label: 'UE',
        labelPosition: LabelPosition.bottom,
        width: NODE_DIAMETER,
        height: NODE_DIAMETER,
        shape: NodeShape.rect,
        status: determineNodeStatus('UE', deploymentsData),
        x: 90,
        y: 130
      },
      {
        id: 'RRU',
        type: 'node',
        label: 'RRU',
        labelPosition: LabelPosition.bottom,
        width: NODE_DIAMETER,
        height: NODE_DIAMETER,
        shape: NodeShape.rect,
        status: determineNodeStatus('RRU', deploymentsData),
        x: 300,
        y: 130
      },
      {
        id: 'DU',
        type: 'node',
        label: 'DU',
        labelPosition: LabelPosition.bottom,
        width: NODE_DIAMETER,
        height: NODE_DIAMETER,
        shape: NodeShape.rect,
        status: determineNodeStatus('DU', deploymentsData),
        x: 400,
        y: 130
      },
      {
        id: 'CU',
        type: 'node',
        label: 'CU',
        labelPosition: LabelPosition.bottom,
        width: NODE_DIAMETER,
        height: NODE_DIAMETER,
        shape: NodeShape.rect,
        status: determineNodeStatus('CU', deploymentsData),
        x: 550,
        y: 130
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
        x: 750,
        y: 100
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
        x: 750,
        y: 130
      },
      {
        id: 'Group-1',
        children: ['UE'],
        type: 'group',
        group: true,
        label: 'End Users',
        style: {
          padding: 20
        }
      },
      {
        id: 'Group-2',
        children: ['RRU', 'DU', 'CU'],
        type: 'group',
        group: true,
        label: 'RAN',
        style: {
          padding: 20
        }
      },
      {
        id: 'Group-3',
        children: ['AMF', 'UPF'],
        type: 'group',
        group: true,
        label: 'Core',
        style: {
          padding: 20
        }
      }
    ];

    const EDGES: EdgeModel[] = [
      {
        id: `UE to RRU`,
        type: 'data-edge',
        source: 'UE',
        target: 'RRU',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.mediumSlow
      },
      {
        id: `RRU to DU`,
        type: 'data-edge',
        source: 'RRU',
        target: 'DU',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.mediumSlow
      },
      {
        id: `DU to CU`,
        type: 'data-edge',
        source: 'DU',
        target: 'CU',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.mediumSlow
      },
      {
        id: `CU to AMF`,
        type: 'data-edge',
        source: 'CU',
        target: 'AMF',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.mediumSlow
      },
      {
        id: `CU to UPF`,
        type: 'data-edge',
        source: 'CU',
        target: 'UPF',
        edgeStyle: EdgeStyle.dashedMd,
        animationSpeed: EdgeAnimationSpeed.mediumSlow
      }
    ];

    return { nodes: NODES_INIT, edges: EDGES };
  };

  const determineNodeStatus = (nodeName, deploymentsData) => {
    let matchPart = nodeName.toLowerCase().substring(0, 2);

    if (nodeName === 'DU' || nodeName === 'RRU') {
      const duDeployment = deploymentsData.find(d => d.deployment_name.toLowerCase().startsWith('oai-du-level1'));
      if (duDeployment) {
        return duDeployment.replicas > 0 ? NodeStatus.success : NodeStatus.danger;
      }
    }

    const deployment = deploymentsData.find(d => d.deployment_name.toLowerCase().includes(matchPart));
    if (!deployment) return NodeStatus.danger;
    return deployment.replicas > 0 ? NodeStatus.success : NodeStatus.danger;
  };

  const customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
    switch (type) {
      case 'group':
        return DefaultGroup;
      case 'data-edge':
        return DataEdge;
      default:
        switch (kind) {
          case ModelKind.graph:
            return withPanZoom()(GraphComponent);
          case ModelKind.node:
            return withContextMenu(() => createContextMenuItems(handleContextMenuAction, 'Start', 'Stop', 'Restart'))(
              withDndDrop(nodeDropTargetSpec([CONNECTOR_SOURCE_DROP, CONNECTOR_TARGET_DROP]))(
                withDragNode(nodeDragSourceSpec('node', true, true))(
                  withSelection()((props) => <CustomNode {...props} setShowSideBar={setShowSideBar} />)
                )
              )
            );
          case ModelKind.edge:
            return withSelection()(DefaultEdge);
          default:
            return undefined;
        }
    }
  };

  const controller = useMemo(() => {
    if (!isDataLoaded) return undefined;

    const newController = new Visualization();
    newController.registerLayoutFactory(customLayoutFactory);
    newController.registerComponentFactory(customComponentFactory);
    newController.addEventListener(SELECTION_EVENT, ids => {
      console.log('Selection event, IDs:', ids);
      setSelectedIds(ids);
      setShowSideBar(true); // Show sidebar on selection event
    });

    const model = { nodes, edges, graph: { id: 'g1', type: 'graph', layout: 'Cola' } };
    newController.fromModel(model, true);

    return newController;
  }, [nodes, edges, isDataLoaded]);

  const handleContextMenuAction = (action: string) => {
    console.log('Context menu action:', action);
    console.log('Selected component IDs:', selectedIds);
    setModalAction(action);
    setModalOpen(true);
    setShowSideBar(false); // Hide sidebar when a context menu item is clicked
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const getApiValueForNode = (nodeLabel) => {
    const mapping = {
      'CU': 'single_cu',
      'DU': 'single_du',
      'UE': 'single_ue',
      'RRU': 'single_rru',
      // Add other mappings as necessary
    };
    return mapping[nodeLabel] || nodeLabel.toLowerCase();
  };

  const handleModalConfirm = async () => {
    try {
      if (selectedIds.length === 0) {
        throw new Error('No node selected');
      }

      const nodeId = selectedIds[0]; // assuming the first selected ID corresponds to the node to act on
      console.log('Selected node ID:', nodeId); // Debugging log

      const selectedNode = nodes.find(node => node.id === nodeId); // find the node
      console.log('Selected node:', selectedNode); // Debugging log

      if (!selectedNode) {
        throw new Error('Node not found');
      }

      const nodeLabel = selectedNode.label;
      console.log('Node label:', nodeLabel); // Debugging log

      const apiValue = getApiValueForNode(nodeLabel); // map node label to API value
      console.log('API value:', apiValue); // Debugging log

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

      console.log('API response:', response); // Debugging log
      if (response.status === 200) {
        setSnackbarMessage(`Action ${modalAction} executed successfully!`);
      } else {
        setSnackbarMessage(`Action ${modalAction} failed.`);
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error executing action:', error); // Debugging log
      setSnackbarMessage(`Action ${modalAction} failed: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setModalOpen(false);
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const createContextMenuItems = (...labels: string[]): React.ReactElement[] => {
    return labels.map((label, i) => {
      if (label === '-') {
        return <ContextMenuSeparator component="li" key={`separator:${i.toString()}`} />;
      }
      return (
        <ContextMenuItem key={label} onClick={() => handleContextMenuAction(label)}>
          {label}
        </ContextMenuItem>
      );
    });
  };

  const topologySideBar = (
    <TopologySideBar
      className="topology-example-sidebar"
      show={showSideBar && selectedIds.length > 0} // Conditionally render based on showSideBar state
      onClose={() => setSelectedIds([])}
    >
      <div style={{ marginTop: 27, marginLeft: 20, height: '800px' }}>{selectedIds[0]}</div>
    </TopologySideBar>
  );

  const controlButtons = createTopologyControlButtons({
    ...defaultControlButtonsOptions,
    zoomInCallback: action(() => {
      controller.getGraph().scaleBy(4 / 3);
    }),
    zoomOutCallback: action(() => {
      controller.getGraph().scaleBy(0.75);
    }),
    fitToScreenCallback: action(() => {
      controller.getGraph().fit(80);
    }),
    resetViewCallback: action(() => {
      controller.getGraph().reset();
    }),
    legend: false,
  });

  const topologyControlBar = (
    <TopologyControlBar controlButtons={controlButtons} className="topology-control-bar" />
  );

  return (
    isDataLoaded ? (
      <TopologyView 
        sideBar={topologySideBar}
        controlBar={topologyControlBar}
      >
        <VisualizationProvider controller={controller}>
          <VisualizationSurface state={{ selectedIds }} />
        </VisualizationProvider>
        <Dialog open={modalOpen} onClose={handleModalClose}>
          <DialogTitle>{modalAction} Pod</DialogTitle>
          <DialogContent>Are you sure you want to {modalAction.toLowerCase()} the pod?</DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">Cancel</Button>
            <Button onClick={handleModalConfirm} color="primary">Confirm</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success">{snackbarMessage}</Alert>
        </Snackbar>
      </TopologyView>
    ) : (
      <div>Loading...</div>
    )
  );
};

export default TopologyCustomEdgeDemo;