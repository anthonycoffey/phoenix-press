# PhoenixPress WordPress Plugin Makefile
# =======================================

.PHONY: help install build start clean reset format release

# Default target
.DEFAULT_GOAL := help

# Colors for output
YELLOW := \033[33m
GREEN := \033[32m
BLUE := \033[34m
RESET := \033[0m

help: ## Show this help message
	@echo "$(BLUE)PhoenixPress WordPress Plugin$(RESET)"
	@echo "================================"
	@echo ""
	@echo "$(YELLOW)Available commands:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-12s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies (npm and composer)
	@echo "$(YELLOW)Installing PHP dependencies...$(RESET)"
	composer install --optimize-autoloader
	@echo "$(YELLOW)Installing JavaScript dependencies...$(RESET)"
	npm install
	@echo "$(GREEN)✓ All dependencies installed successfully!$(RESET)"

build: ## Build the project for production
	@echo "$(YELLOW)Building project for production...$(RESET)"
	npm run build
	@echo "$(GREEN)✓ Build completed successfully!$(RESET)"

start: ## Start development server with file watching
	@echo "$(YELLOW)Starting development server...$(RESET)"
	npm run start

clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(RESET)"
	npm run clean:react
	@echo "$(GREEN)✓ Build artifacts cleaned!$(RESET)"

reset: ## Reset project (remove node_modules, vendor, and lock files)
	@echo "$(YELLOW)Resetting project...$(RESET)"
	npm run reset
	@if [ -d "vendor" ]; then rm -rf vendor; fi
	@if [ -f "composer.lock" ]; then rm composer.lock; fi
	@echo "$(GREEN)✓ Project reset completed!$(RESET)"

format: ## Format code using WordPress standards
	@echo "$(YELLOW)Formatting code...$(RESET)"
	npm run format
	@echo "$(GREEN)✓ Code formatted successfully!$(RESET)"

release: ## Create a release package
	@echo "$(YELLOW)Creating release package...$(RESET)"
	npm run release
	@echo "$(GREEN)✓ Release package created!$(RESET)"

# Development workflow shortcuts
dev-install: install ## Alias for install (development setup)

prod-build: clean install build ## Full production build (clean, install, build)
	@echo "$(GREEN)✓ Production build completed!$(RESET)"

# Quick status check
status: ## Show project status
	@echo "$(BLUE)PhoenixPress Project Status$(RESET)"
	@echo "============================="
	@echo ""
	@echo "$(YELLOW)Node.js version:$(RESET)"
	@node --version 2>/dev/null || echo "Node.js not installed"
	@echo ""
	@echo "$(YELLOW)NPM version:$(RESET)"
	@npm --version 2>/dev/null || echo "NPM not installed"
	@echo ""
	@echo "$(YELLOW)PHP version:$(RESET)"
	@php --version 2>/dev/null | head -1 || echo "PHP not installed"
	@echo ""
	@echo "$(YELLOW)Composer version:$(RESET)"
	@composer --version 2>/dev/null || echo "Composer not installed"
	@echo ""
	@if [ -d "node_modules" ]; then echo "$(GREEN)✓ Node modules installed$(RESET)"; else echo "$(YELLOW)⚠ Node modules not installed$(RESET)"; fi
	@if [ -d "vendor" ]; then echo "$(GREEN)✓ Composer packages installed$(RESET)"; else echo "$(YELLOW)⚠ Composer packages not installed$(RESET)"; fi
	@if [ -d "build" ]; then echo "$(GREEN)✓ Build directory exists$(RESET)"; else echo "$(YELLOW)⚠ Build directory not found$(RESET)"; fi