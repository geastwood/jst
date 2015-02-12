SHELL := /bin/bash
PACKAGE = jst
DISTDIR = /usr/local
LIBDIR = $(DISTDIR)/lib
BINDIR = $(DISTDIR)/bin
PACKAGEDIR = $(LIBDIR)/$(PACKAGE)

base: clean
	@mkdir -p $(PACKAGEDIR)
	@cp -r * $(PACKAGEDIR)
	@cd $(PACKAGEDIR); npm install
	@chmod a+x $(PACKAGEDIR)/$(PACKAGE).js
	@ln -s $(PACKAGEDIR)/$(PACKAGE).js $(BINDIR)/$(PACKAGE)
	@echo "Done!"

clean:
	@rm -Rf $(PACKAGEDIR)
	@rm -Rf $(BINDIR)/$(PACKAGE)

.PHONY: build
