#!/usr/bin/env bash

# Git commit message format validator
# Format: <type>: <subject>
# Where type = feat | fix | docs | chore | style | refactor | perf | test | build

# Enable debug mode (uncomment for troubleshooting)
# set -x

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VALID_TYPES="feat|fix|docs|chore|style|refactor|perf|test|build"
MIN_SUBJECT_LENGTH=10
MAX_SUBJECT_LENGTH=50
MAX_TOTAL_LENGTH=72

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

# Function to validate commit message format
validate_commit_message() {
    local commit_msg="$1"
    local errors=()
    local warnings=()

    # Check if message is empty
    if [[ -z "$commit_msg" ]]; then
        errors+=("Commit message cannot be empty")
        return 1
    fi

    # Remove leading/trailing whitespace
    commit_msg=$(echo "$commit_msg" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    # Check basic format: <type>: <subject>
    if [[ ! "$commit_msg" =~ ^([a-z]+):[[:space:]]*(.+)$ ]]; then
        echo "ERROR: Commit message must follow format: <type>: <subject>" >&2
        echo "Example: feat: add user authentication" >&2
        echo "Your commit message: '$commit_msg'" >&2
        echo "Valid types: ${VALID_TYPES//|/, }" >&2
        return 1
    fi

    # Extract type and subject
    local type="${BASH_REMATCH[1]}"
    local subject="${BASH_REMATCH[2]}"

    # Validate type
    if [[ ! "$type" =~ ^($VALID_TYPES)$ ]]; then
        errors+=("Invalid type '$type'. Valid types are: ${VALID_TYPES//|/, }")
    fi

    # Validate subject
    if [[ -z "$subject" ]]; then
        errors+=("Subject cannot be empty")
    else
        # Check subject length
        local subject_length=${#subject}
        if [[ $subject_length -lt $MIN_SUBJECT_LENGTH ]]; then
            warnings+=("Subject is too short ($subject_length chars). Minimum recommended: $MIN_SUBJECT_LENGTH chars")
        fi
        
        if [[ $subject_length -gt $MAX_SUBJECT_LENGTH ]]; then
            warnings+=("Subject is too long ($subject_length chars). Maximum recommended: $MAX_SUBJECT_LENGTH chars")
        fi

        # Check if subject starts with uppercase (should be lowercase)
        if [[ "$subject" =~ ^[A-Z] ]]; then
            errors+=("Subject should start with lowercase letter")
        fi

        # Check if subject ends with period
        if [[ "$subject" =~ \.$  ]]; then
            errors+=("Subject should not end with a period")
        fi

        # Check for imperative mood (basic check)
        if [[ "$subject" =~ ^(added|fixed|updated|changed|removed|deleted) ]]; then
            warnings+=("Consider using imperative mood: use 'add' instead of 'added', 'fix' instead of 'fixed', etc.")
        fi
    fi

    # Check total message length
    local total_length=${#commit_msg}
    if [[ $total_length -gt $MAX_TOTAL_LENGTH ]]; then
        warnings+=("Total message length ($total_length chars) exceeds recommended maximum of $MAX_TOTAL_LENGTH chars")
    fi

    # Print warnings if any
    if [[ ${#warnings[@]} -gt 0 ]]; then
        for warning in "${warnings[@]}"; do
            print_warning "$warning"
        done
        echo >&2
    fi

    # print_success "Commit message format is valid!"
    return 0
}

# Main execution
main() {
    local commit_msg=""
    
    # Husky passes the commit message file as the first argument
    if [[ -n "$1" && -f "$1" ]]; then
        # Read from commit message file (husky/git hook scenario)
        commit_msg=$(cat "$1" 2>/dev/null)
        # echo "DEBUG: Read from file: '$commit_msg'" >&2
    # Check if commit message is provided as argument
    elif [[ $# -gt 0 ]]; then
        commit_msg="$*"
    # Read from stdin
    elif [[ ! -t 0 ]]; then
        commit_msg=$(cat)
    else
        echo "Usage: $0 [commit-message-file|commit-message]" >&2
        echo "   or: echo 'commit message' | $0" >&2
        echo >&2
        echo "This script is designed to work with:" >&2
        echo "  - Husky commit-msg hooks" >&2
        echo "  - Direct command line usage" >&2
        echo "  - Piped input" >&2
        echo >&2
        echo "Examples:" >&2
        echo "  $0 'feat: add new feature'" >&2
        echo "  echo 'fix: resolve bug' | $0" >&2
        exit 1
    fi

    # Check if we successfully read the commit message
    if [[ -z "$commit_msg" ]]; then
        print_error "Could not read commit message"
        echo "DEBUG INFO:" >&2
        echo "  Arg 1: $1" >&2
        echo "  File exists: $(test -f "$1" && echo "yes" || echo "no")" >&2
        echo "  File readable: $(test -r "$1" && echo "yes" || echo "no")" >&2
        exit 1
    fi

    # Extract only the first line for validation (ignore commit body)
    commit_msg=$(echo "$commit_msg" | head -n 1)

    validate_commit_message "$commit_msg"
    exit $?
}

# Run main function with all arguments
main "$@"
