import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MobileAltIcon as Icon1 } from '@patternfly/react-icons';
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

interface Pod {
  name: string;
  state: string;
}

interface CustomNodeProps {
  element: Node;
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
  onSelect,
  ...rest
}) => {
  const Icon = Icon1;

  return (
    <DefaultNode
      element={element}
      onContextMenu={onContextMenu}
      contextMenuOpen={contextMenuOpen}
      showStatusDecorator
      selected={selected}
      onSelect={onSelect}
      labelPosition={LabelPosition.right}
      {...rest}
    >
      <g transform={`translate(16, 16)`}>
        <Icon style={{ color: '#393F44' }} width={50} height={50} />
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
    status: NodeStatus.danger,
    x: 70,
    y: 130
  },
  {
    id: 'RRU',
    type: 'node',
    label: 'RRU',
    labelPosition: LabelPosition.bottom,
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NodeShape.ellipse,
    status: NodeStatus.danger,
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
    shape: NodeShape.ellipse,
    status: NodeStatus.danger,
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
    shape: NodeShape.ellipse,
    status: NodeStatus.danger,
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
    shape: NodeShape.octagon,
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
    shape: NodeShape.octagon,
    status: NodeStatus.success,
    x: 750,
    y: 130
  },
  {
    id: 'Group-1',
    children: ['UE'],
    type: 'group',
    group: true,
    label: 'Fronthaul',
    style: {
      padding: 20
    }
  },
  {
    id: 'Group-2',
    children: ['RRU', 'DU', 'CU'],
    type: 'group',
    group: true,
    label: 'Midhaul',
    style: {
      padding: 20
    }
  },
  {
    id: 'Group-3',
    children: ['AMF', 'UPF'],
    type: 'group',
    group: true,
    label: 'Backhaul',
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

export const TopologyCustomEdgeDemo: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pods, setPods] = useState<Pod[]>([]);
  const [nodes, setNodes] = useState<NodeModel[]>(NODES_INIT);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await api.get('kube/pods/');
        const podsData = response.data.pods.map((pod: any) => ({
          name: pod.name,
          state: pod.state
        }));
        setPods(podsData);
        updateNodeStatuses(podsData);
      } catch (error) {
        console.error('Failed to fetch pods:', error);
      }
    };
    fetchPods();
  }, []);


  const updateNodeStatuses = (podsData) => {
    const updatedNodes = nodes.map(node => {
      // Skip updating for AMF and UPF
      if (node.id === 'AMF' || node.id === 'UPF') {
        return node;
      }
      return {
        ...node,
        status: determineNodeStatus(node.id, podsData)
      };
    });
    setNodes(updatedNodes);
  };


  const determineNodeStatus = (nodeName, podsData) => {
    // Determine which pod name to match based on the nodeName
    let matchPart = nodeName.toLowerCase().substring(0, 2); // 'UE' -> 'ue', etc.
    
    // Special handling for DU and RRU to share the same status
    if (nodeName === 'DU' || nodeName === 'RRU') {
      // Find the first pod that starts with "oai-du-"
      const duPod = podsData.find(p => p.name.toLowerCase().startsWith('oai-du-'));
      if (duPod) {
        switch (duPod.state) {
          case 'Running': return NodeStatus.success;
          case 'Pending': return NodeStatus.warning;
          default: return NodeStatus.danger;
        }
      }
    }
  
    // For all other nodes
    const pod = podsData.find(p => p.name.toLowerCase().includes(matchPart));
    if (!pod) return NodeStatus.danger; // If no pod matches, default to danger
    switch (pod.state) {
      case 'Running': return NodeStatus.success;
      case 'Pending': return NodeStatus.warning;
      default: return NodeStatus.danger;
    }
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
                  withSelection()(CustomNode)
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
    const newController = new Visualization();
    newController.registerLayoutFactory(customLayoutFactory);
    newController.registerComponentFactory(customComponentFactory);
    newController.addEventListener(SELECTION_EVENT, setSelectedIds);

    const model = { nodes, edges: EDGES, graph: { id: 'g1', type: 'graph', layout: 'Cola' } };
    newController.fromModel(model, true);

    return newController;
  }, [nodes]);

  const handleContextMenuAction = (action: string) => {
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalConfirm = () => {
    setSnackbarMessage(`Action ${modalAction} executed successfully!`);
    setSnackbarOpen(true);
    setModalOpen(false);
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
      show={selectedIds.length > 0}
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
  );
};

export default TopologyCustomEdgeDemo;