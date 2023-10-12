.PHONY: help
# Show this help.
help:
	@awk '/^#/{c=substr($$0,3);next}c&&/^[[:alpha:]][[:alnum:]_-]+:/{print substr($$1,1,index($$1,":")),c}1{c=0}' $(MAKEFILE_LIST) | column -s: -t

.PHONY: serve
# run npm development server
serve:
	cd ts && npm run serve

.PHONY: build
# run npm build
build:
	find public/assets/ -type f \( -name "*.js" -o -name "*.css" \) -exec rm -f {} \; && cd ts && npm run build
