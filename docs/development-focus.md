# Development Focus

## Development Timeline

1. [Core Infrastructure](#core-infrastructure-may-2025) (Completed) 
2. [DCR Module Completion](#dcr-module-completion-june-2025) (Current)
3. [Prototype Pipeline](#prototype-pipeline) (Next)
4. [Extended Features](#extended-features) (Future)
5. [Technical Debt](#current-technical-debt)
6. [Known Bugs](#known-bugs)

## Details

### Core Infrastructure (May 2025)

Base components required for the project:

- Reader interface - generic data source access interface
- Local CSV reader - streaming implementation for CSV files, easiest implementation of a reader
- Custom MetaStore wrapper - extends N3.Store with additional functionality, i.e. provenance through reification
- Configured logger - caller tracing with directed file and console output

### DCR Module Completion (June 2025) - Postponed

Fix and complete the Data Content Recognition module:

- Fix TypeScript errors in existing code
- Implement missing type definitions
- Complete test suite for parsers
- Fix timestamp recognition edge cases
- Ensure proper error handling

*Note: This development has been postponed. May be revisited in a smaller scope in the future.*

### Prototype Pipeline

Implement a basic end-to-end pipeline:

- Read a CSV file
- Analyze CSV structure and content
- Generate basic metadata using LLM
- Export to DCAT-AP-CZ format

### Extended Features

Planned for after the prototype is working:

- Pipeline orchestration
- Additional data format support
- Web UI for visualization
- Enhanced metadata extraction

## Current Technical Debt

- ~~Processor interface in `processor.d.ts` includes a `dataset` parameter not used in implementations~~ (Resolved: Replaced with `data` parameter for SourceManager)
- Inconsistent TypeScript typing across the project
- Missing tests for critical components
- Timestamp recognition has potential edge case issues

## Known Bugs

- DCR module fails on certain timestamp formats
- Null handling is inconsistent in array utilities
- Enum recognition sometimes incorrectly classifies numeric data

---

*Last updated: 2025-06-28*
