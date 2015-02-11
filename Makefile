SHELL := /bin/bash
PACKAGE = jst
DISTDIR = /usr/local
LIBDIR = $(DISTDIR)/lib
BINDIR = $(DISTDIR)/bin
PACKAGEDIR = $(LIBDIR)/$(PACKAGE)

base: clean
	@mkdir -p $(PACKAGEDIR)
	@echo "PACKAGE EXTRACTED TO: \""$(PACKAGEDIR)\"
	@cp -r * $(PACKAGEDIR)
	@cd $(PACKAGEDIR); npm install
	@chmod a+x $(PACKAGEDIR)/jst.js
	@ln -s $(PACKAGEDIR)/jst.js $(BINDIR)/$(PACKAGE)

clean:
	@echo 'Remove old packages and link'
	@rm -Rf $(PACKAGEDIR)
	@rm -Rf $(BINDIR)/$(PACKAGE)

.PHONY: build
