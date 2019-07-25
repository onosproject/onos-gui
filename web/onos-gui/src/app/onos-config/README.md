# onos-config view

**onos-config** view is a set of Angular components for displaying and exiting
the configuration of onos devices through the **onos-config** system.

# Component hierarchy

## NetworkChangesComponent
Top level routed from the Navigation menu at **/config/nwchanges**

Contains:
```
NetworkChangesComponent
  |
  |- NetworkChangeDetailComponent
```

### NetworkChangeDetailComponent
NetworkChangeDetailComponent is a details panel listing configurations and
their changes of the the selected network change. Each one is a link that
routes to the ConfigView of the selected config.

## ConfigViewComponent
Top level routed from NetworkChangesComponent or anything with a configID at
**config/configview/<configid>**.

Contains:
```
ConfigViewComponent 
  |
  |- ConfigLayersPanelComponent
  |
  |- LayerSvgComponent
       |
       |- ContainerSvgComponent
       |
       |- LeafSvgComponent 
```

## ConfigLayersPanelComponent
ConfigLayersPanelComponent is a HTML panel displaying details of the Component
and its list of changes. Each one has a visibility control. There is also a
visibility control for the State and Operational views of the device that this
configuration represents (if an actual device is connected). 

## LayerSvgComponent
LayerSvgComponent is an SVG canvas that displays all of the configuration (paths
and values) in a graphical tree view. There is one such layer per **change** of
the config. Each one is transparent and overlaid on top of older changes. There
are 2 more layers for State and Operational data if accessible from the device.

If an edit is made a new "Pending" layer is created to hold edited values. 

## ContainerSvgComponent
ContainerSvgComponent is an SVG icon that displays either a model **container**
(with cardinality of 0 or 1) or a model list (with cardinality > 1).

## LeafSvgComponent
LeafSvgComponent is an SVG icon that displays either a model **Leaf** or a
**Leaf List** with its value. If the leaf is editable this component will allow
the value to be edited.
