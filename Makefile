.PHONY: all build build-contracts fmt fmt-check init-contracts lint pre-commit test test-contracts full-test

all: build test

build: build-contracts

build-contracts:
	@echo 🚂 Building contracts...
	@cd contracts && cargo +nightly b -r --workspace
	@ls -l contracts/target/wasm32-unknown-unknown/release/*.wasm

fmt:
	@echo 🚂 Formatting...
	@cd contracts && cargo fmt

fmt-check:
	@echo 🚂 Checking a format...
	@cd contracts && cargo fmt --all --check

init-contracts:
	@echo 🚂 Installing a toolchain and a target...
	@rustup toolchain add nightly
	@rustup target add wasm32-unknown-unknown --toolchain nightly

lint:
	@echo 🚂 Running the linter...
	@cd contracts && cargo +nightly clippy --workspace -- -D warnings

pre-commit: fmt lint test

test: test-contracts

test-contracts:
	@echo 🚂 Running unit tests...
	@cd contracts && cargo +nightly t -Fbinary-vendor

full-test:
	@echo 🚂 Running all tests...
	@cd contracts && cargo +nightly t -Fbinary-vendor -- --include-ignored --test-threads=1
