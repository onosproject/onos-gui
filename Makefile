.PHONY: build

ONOS_GUI_VERSION := latest
ONOS_GUI_DEBUG_VERSION := debug
ONOS_BUILD_VERSION := stable

build: # @HELP build the Web GUI and run all validations (default)
build:
	cd web/onos-gui && ng build --prod

test: # @HELP run the unit tests and source code validation
test: build deps lint license_check

coverage: # @HELP generate unit test coverage data
coverage: deps build license_check

deps: # @HELP ensure that the required dependencies are in place
	cd web/onos-gui && npm install

lint: # @HELP run the linters for Go source code
	cd web/onos-gui && ng lint

license_check: # @HELP examine and ensure license headers exist
	./build/licensing/boilerplate.py -v

protos: # @HELP compile the protobuf files (using protoc-go Docker)
	docker run -it -v `pwd`/..:/go/src/github.com/onosproject \
		-w /go/src/github.com/onosproject/onos-gui \
		--entrypoint build/bin/compile-protos-ts.sh \
		onosproject/protoc-go:stable

onos-gui-docker: # @HELP build onos-gui Docker image
	docker build . -f build/onos-gui/Dockerfile \
		-t onosproject/onos-gui:${ONOS_GUI_VERSION}

images: # @HELP build all Docker images
images: build onos-gui-docker

all: build images

clean: # @HELP remove all the build artifacts
	rm -rf ./web/onos-gui/dist

help:
	@grep -E '^.*: *# *@HELP' $(MAKEFILE_LIST) \
    | sort \
    | awk ' \
        BEGIN {FS = ": *# *@HELP"}; \
        {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}; \
    '
