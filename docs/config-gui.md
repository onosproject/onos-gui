# Configuration GUI
The configuration GUI allows configuration changes to be made in to onos-config.

It comprises of:

* Network changes view is a tabular layout that shows network changes.
    * A corresponding Details view shows individual details
    * Rollback of the last Network change
    * Creation of a new Network change (temporarily referred to as __pending__)
    * Deletion of the **pending** Network Change
    * Commit of the **pending** Network Change

* Configurations view is a tabular layout that lists all the set of configurations
on the system
    * Selecting individual configuration will change to the Config View graphical layout.

* Config view is a graphical layout that shows the entire configuration of the
  device in a tree view.
    * It contains a panel that lists all of the config changes that have happened
    to the device. Each of these can be hidden or displayed (like a layer) that
    can be used to see the history of config changes.
    * An additional layer shows the Operational State (from the OpState cache) when
    connected to a real device
    * Another layer shows all of the configurable (Read Write) paths possible for
    the device. 
    * Within the graphical view clicking on a node allows the value to be edited
    (as long as a pending network change has been created)
    * Zoom and Pan functions are also available within the graphical view
  
* Model View is a tabular layout that shows the list of Model Plugins loaded in
the system.
    * A details view shows the list of YANG models for that Model Plugin. 
