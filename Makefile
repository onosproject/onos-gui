export CGO_ENABLED=0
export GO111MODULE=on

.PHONY: build

ONOS_GUI_VERSION := latest
ONOS_GUI_DEBUG_VERSION := debug
ONOS_BUILD_VERSION := stable

build: # @HELP build the Web GUI and run all validations (default)
build:
	cd web/onos-gui && ng build

test: # @HELP run the unit tests and source code validation
test: build deps lint vet license_check gofmt cyclo misspell ineffassign

coverage: # @HELP generate unit test coverage data
coverage: build deps lint vet license_check gofmt cyclo misspell ineffassign
	./build/bin/coveralls-coverage

deps: # @HELP ensure that the required dependencies are in place
	go build -v ./...
	bash -c "diff -u <(echo -n) <(git diff go.mod)"
	bash -c "diff -u <(echo -n) <(git diff go.sum)"

lint: # @HELP run the linters for Go source code
	golint -set_exit_status github.com/onosproject/onos-gui/pkg/...
	golint -set_exit_status github.com/onosproject/onos-gui/cmd/...
	golint -set_exit_status github.com/onosproject/onos-gui/test/...
	cd web/onos-gui && ng lint

vet: # @HELP examines Go source code and reports suspicious constructs
	go vet github.com/onosproject/onos-gui/pkg/...
	go vet github.com/onosproject/onos-gui/cmd/...
	go vet github.com/onosproject/onos-gui/test/...

cyclo: # @HELP examines Go source code and reports complex cycles in code
	gocyclo -over 25 pkg/
	gocyclo -over 25 cmd/
	gocyclo -over 25 test/

misspell: # @HELP examines Go source code and reports misspelled words
	misspell -error -source=text pkg/
	misspell -error -source=text cmd/
	misspell -error -source=text test/
	misspell -error docs/

ineffassign: # @HELP examines Go source code and reports inefficient assignments
	ineffassign pkg/
	ineffassign cmd/
	ineffassign test/

license_check: # @HELP examine and ensure license headers exist
	./build/licensing/boilerplate.py -v

gofmt: # @HELP run the Go format validation
	bash -c "diff -u <(echo -n) <(gofmt -d pkg/ cmd/ tests/)"

protos: # @HELP compile the protobuf files (using protoc-go Docker)

onos-gui-docker: build # @HELP build onos-gui Docker image
	docker build . -f build/onos-gui/Dockerfile \
		-t onosproject/onos-gui:${ONOS_GUI_VERSION}

images: # @HELP build all Docker images
images: build onos-gui-docker

all: build images

run-docker: # @HELP run onos-gui docker image
run-docker: onos-gui-docker
	docker stop onos-gui || echo "onos-gui was not running"
	docker run -d --rm -p 5180:80 \
		--name onos-gui onosproject/onos-gui

clean: # @HELP remove all the build artifacts
	rm -rf ./web/onos-gui/dist

help:
	@grep -E '^.*: *# *@HELP' $(MAKEFILE_LIST) \
    | sort \
    | awk ' \
        BEGIN {FS = ": *# *@HELP"}; \
        {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}; \
    '
