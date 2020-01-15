# Configuration GUI
The configuration GUI allows configuration changes to be made in to onos-config.

It comprises of:

* Dashboard view is a tabular layout that shows network changes.
    * A corresponding Details view shows individual details
    * Rollback of the last `NetworkChange`
    * Compaction of `NetworkChange`s older than a certain time (24 hours by default)
    * Access to a Device View through a link

* Device View is a graphical layout that shows the entire configuration of the
  device in a tree view.
    * It contains a panel that lists all of the `DeviceChanges` that have happened
    to the device. Each of these can be hidden or displayed (like a layer) that
    can be used to see the history of config changes.
    * An additional layer shows the `Snapshot` for that device
    * Another layer shows the Operational State (from the OpState cache) when
    connected to a real device
    * Another layer shows all of the configurable (Read Write) paths possible for
    the device. 
    * Zoom and Pan functions are also available within the graphical view
  
* Model View is a tabular layout that shows the list of Model Plugins loaded in
the system.
    * A details view shows the list of YANG models for that Model Plugin. 
