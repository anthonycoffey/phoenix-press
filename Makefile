ifndef COMPOSER_BIN
  COMPOSER_BIN := composer
endif
ifndef DATETIME
  DATETIME := $(shell date -u +%Y%m%d%H%M%SZ)
endif

.PHONY: install
install:
	$(COMPOSER_BIN) install
	$(COMPOSER_BIN) install --working-dir phoenix-press
	cd phoenix-press && npm install --include=dev

.PHONY: build
build:
	cd phoenix-press && npm run build

.PHONY: start
start:
	cd phoenix-press && npm run start

.PHONY: release
release:
	rm -rf phoenix-press.zip
	$(COMPOSER_BIN) install --working-dir phoenix-press --no-dev
	cd phoenix-press && npm install && npm run build
	zip -r --exclude="*node_modules*" --exclude="*src*" phoenix-press.zip phoenix-press

.PHONY: clean
clean:
	rm -rf phoenix-press/node_modules phoenix-press/package-lock.json vendor composer.lock
