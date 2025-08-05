#!/usr/bin/env bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_error() {
    echo -e "${RED}ERROR: $1${NC}" >&2
}

print_success() {
    echo -e "${GREEN}SUCCESS: $1${NC}" >&2
}

print_warning() {
    echo -e "${YELLOW}WARNING: $1${NC}" >&2
}

# Check if CHANGELOG.md is staged for commit
changelog_staged=$(git diff --cached --name-only | grep -c "CHANGELOG\.md")

# Check if there are any changes to files other than CHANGELOG.md
other_changes=$(git diff --cached --name-only | grep -v "CHANGELOG\.md" | wc -l | tr -d '[:space:]')

# If there are changes to other files but CHANGELOG.md is not staged
if [ "$other_changes" -gt 0 ] && [ "$changelog_staged" -eq 0 ]; then
    print_error "CHANGELOG.md has not been updated."
    print_error "Please update the CHANGELOG.md file to reflect your changes."
    exit 1
fi

print_success "CHANGELOG.md check passed."
exit 0
