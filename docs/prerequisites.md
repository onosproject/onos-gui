# GUI Development Prerequisites
This document provides an overview of the tools and packages needed to work on and to build onos-gui.
Developers are expected to have these tools installed on the machine where the project is built.

## NodeJS
Install the latest Long Term Support version of NodeJS on your system.

* Downloads are available from https://nodejs.org/en/download/
* Instructions for installing on Linux are at https://github.com/nodejs/help/wiki/Installation

After installing it should be possible to see the version of **node** and **npm**
(which is bundled with it) that you installed with:
```bash
node -v
npm -v
```

## Angular CLI
Angular CLI provides the **ng** tools. Installation instructions are at
https://angular.io/guide/setup-local

The following command can be run from any folder:
```bash
npm install -g @angular/cli
```

## Checkout the onos-gui code from Git
Using a process described [contributing.md](../../onos-docs/docs/developers/contributing.md)
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
After this install (and after changing to the web/onos-gui folder) it should be
possible to see the Angular CLI version:
```bash
cd web/onos-gui
ng version
```
This should give a result like:
```bash
Your global Angular CLI version (8.1.2) is greater than your local
version (7.0.7). The local Angular CLI version is used.

To disable this warning use "ng config -g cli.warnings.versionMismatch false".

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    

Angular CLI: 7.0.7
Node: 12.6.0
OS: linux x64
Angular: 7.0.4
... animations, common, compiler, compiler-cli, core, forms
... http, language-service, platform-browser
... platform-browser-dynamic, router
...
``` 

## Angular dependencies
Staying inside the **web/onos-gui** folder, the Angular dependencies must be installed.
This is as simple as running **npm install** in the folder. This takes the dependencies
listed in **package.json** and installs them in the temporary folder **node_modules**:
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
[Visual Studio Code] is another option that supports TypeScript..

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
[deploy]: ../../onos-docs/docs/developers/deployment.md
