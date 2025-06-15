# MetaMake Development Focus

## Current Development Focus

This document helps maintain focus on the immediate development goals. Update this document as tasks are completed or priorities shift.

### Active Sprint Goals

- [ ] Complete the prototype pipeline with basic functionality
  - Including CSV parsing, schema analysis, and basic metadata extraction
  - LLM integration is considered part of this basic functionality
- [ ] Implement processor validation framework
  - Ensure processors can properly validate their inputs/outputs
  - Enable error reporting for incompatible processor connections

### Current Task Details

#### Prototype Pipeline

**Goal:** Create a working end-to-end pipeline that can take a CSV file and produce basic DCAT-AP-CZ metadata

**Components needed:**
- [x] CSV parser
- [x] Basic MetaStore implementation
- [ ] CSV schema analyzer (being implemented as CsvSchemaAnalyzerProcessor)
- [ ] Metadata extractor for basic fields
- [ ] Metadata formatter for DCAT-AP-CZ

**Definition of Done:**
- Pipeline can process a simple CSV file
- Output metadata contains at least title, description, and distribution information
- Metadata validates against DCAT-AP-CZ schema

#### Processor Validation

**Goal:** Ensure processors can validate their inputs and outputs

**Components needed:**
- [ ] Input/output schema definition interface
- [ ] Validation mechanism for processor connections
- [ ] Error reporting for incompatible processors

**Definition of Done:**
- Processors can declare required inputs and outputs
- Pipeline refuses to run with incompatible processors
- Clear error messages guide users to fix configuration issues

## Technical Challenges Tracking

### Open Issues

1. **Stream Processing for Large Files**
   - Need to ensure all processors can work with streaming data
   - Consider memory limitations for very large datasets

2. **Provenance Tracking Performance**
   - Current implementation may have performance issues with large metadata sets
   - Need to profile and optimize if necessary

3. **LLM Integration**
   - Need to balance cost vs. quality for LLM-generated metadata
   - Consider implementing caching for LLM responses

## Next Sprint Planning

### Upcoming Features

1. Orchestrator implementation with validation
2. Support for additional data formats (JSON, XML)
3. Web UI for basic pipeline interaction
4. Enhanced LLM prompting for better metadata quality

---

## Reference Architecture

```
┌──────────────┐     ┌──────────────┐     ┌────────────────┐
│  Data Input  │────>│  Processors  │────>│  Metadata Out  │
└──────────────┘     └──────────────┘     └────────────────┘
                            │
                            v
                     ┌─────────────┐
                     │  MetaStore  │
                     └─────────────┘
```

### Key Components

1. **Data Input**
   - File readers for different formats
   - Streaming parsers
   - Format detection

2. **Processors**
   - Structural analyzers
   - Content analyzers
   - LLM processors
   - Standard-specific formatters

3. **MetaStore**
   - Quad store with provenance tracking
   - Named graphs for processor outputs
   - Reification for statement metadata

4. **Metadata Output**
   - Standard-specific serialization
   - Validation against schemas
   - Export in various formats

---

*Update this document regularly to maintain focus on current development priorities.*
