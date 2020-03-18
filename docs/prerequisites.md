# GUI Development Prerequisites
This document provides an overview of the tools and packages needed to work on and to build onos-gui.
Developers are expected to have these tools installed on the machine where the project is built.

## Reusing tools from an existing ONOS installation
If you already have the legacy ONOS project code checked out and built using Bazel
on your system, then you already have all the tools you need.
Add the following 2 entries to your $PATH environment variable to give access
to the `npm` and the `ng` command respectively

* `[bazel output_base]/external/nodejs_linux_amd64/bin/nodejs/bin`
* `~/onos/web/gui2/node_modules/@angular/cli/bin`

where **[bazel output_base]** above can be found from running the command:
```bash
bazel info output_base
```

After setting the PATH it should be possible to see the version of **node** and **npm**:
```bash
node -v
npm -v
which ng
```

## NodeJS
If legacy ONOS is not available install the latest Long Term Support version of NodeJS on your system.

* Downloads are available from <https://nodejs.org/en/download/>
    * Please use **v10.16.0** or greater
* Instructions for installing on Linux are at <https://github.com/nodejs/help/wiki/Installation>

After installing it should be possible to see the version of **node** and **npm**
(which is bundled with it) that you installed with:
```bash
node -v
npm -v
```

## Angular CLI
If legacy ONOS is not available install Angular CLI to provide the **ng** tools. Installation instructions are at
<https://angular.io/guide/setup-local>

The following command can be run from any folder:
```bash
npm install -g @angular/cli
```

## Checkout the onos-gui code from Git
Using a process described [contributing.md](../../developers/contributing.md)
the Git repo should be forked in your own name on 
[github.com/onosproject/onos-gui](https://github.com/onosproject/onos-gui).

```bash
git clone https://github.com/$GIT_USER/onos-gui.git
# or: 
git clone git@github.com:$GIT_USER/onos-gui.git
```

```bash
cd $ONOS_ROOT/onos-gui
git remote add upstream https://github.com/onosproject/onos-gui.git
# or: git remote add upstream git@github.com:onosproject/onos-gui.git

# Never push to upstream master
git remote set-url --push upstream no_push

# Confirm that your remotes make sense:
git remote -v
```

## Set up Angular for local development
After this install (and after changing to the `web/onos-gui` folder) it should be
possible to see the Angular CLI version:
```bash
cd web/onos-gui
ng version
```
This should give a result like:

```bash
     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    
Angular CLI: 8.3.20
Node: 10.16.0
OS: linux x64
Angular: 8.2.14
... animations, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... router
...
``` 

## Angular dependencies
Staying inside the `web/onos-gui` folder, the Angular dependencies must be installed.
This is as simple as running `npm install` in the folder. This takes the dependencies
listed in `package.json` and installs them in the temporary folder `node_modules`:
```bash
npm install
```

## Docker
[Docker] is required to build the project Docker images and also to compile `*.proto` files into TypeScript source files.

## Local kubernetes environment
Some form of local kubernetes development environment is also needed.
The core team uses [Kind], but there are other options such as [Minikube] and [Microk8s] for Ubuntu.
The **[onit]** (ONOS Integration Test tool) should be used to set up the cluster,
or [deploy] gives more details on a Helm installation.

## IDE
Some form of an integrated development environment that supports Web Development
with TypeScript is also recommended. The core team uses the Intellij
[WebStorm IDE] from JetBrains, but there are many other options.
The [Atom] editor is a lightweight solution supporting TypeScript and Git integration.
[Visual Studio Code] is another option that supports TypeScript.

## License
The project requires that all Typescript source files are properly annotated using the Apache 2.0 License.
Since this requirement is enforced by the CI process, it is strongly recommended that developers
setup their IDE to include the [license text](https://github.com/onosproject/onos-gui/blob/master/build/licensing/boilerplate.ts.txt)
automatically.

[Docker]: https://docs.docker.com/install/
[Kind]: https://github.com/kubernetes-sigs/kind
[Minikube]: https://kubernetes.io/docs/tasks/tools/install-minikube/
[MicroK8s]: https://microk8s.io/

[WebStorm IDE]: https://www.jetbrains.com/webstorm/
[Atom]: https://atom.io/
[Visual Studio Code]: https://code.visualstudio.com

[onit]: ../../onos-test/docs/setup.md
[deploy]: ../../onos-config/docs/deployment.md
