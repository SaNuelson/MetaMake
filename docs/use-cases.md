# MetaMake Use Cases

## Overview
This document outlines the key use cases for the MetaMake system, providing a reference to keep development focused and aligned with user needs. Each use case is structured to clarify who, what, why, and how the system will be used.

## Primary Use Cases

### UC1: Basic Metadata Generation
**Actor:** Data Provider

**Goal:** Generate standard-compliant metadata for a data file with minimal effort

**Flow:**
1. User provides a data file (CSV, JSON, XML, RDF)
2. System analyzes the file structure and content
3. System generates metadata according to selected standard (e.g., DCAT-AP-CZ)
4. System presents the generated metadata to the user
5. User exports or saves the metadata

**Requirements:**
- Support for multiple data formats
- Inference of basic metadata from file contents
- Compliance with metadata standards

### UC2: Custom Pipeline Configuration
**Actor:** Advanced User

**Goal:** Configure a custom metadata extraction pipeline for specific needs

**Flow:**
1. User selects available processors
2. User configures each processor's settings
3. User arranges processors in desired sequence
4. User saves the pipeline configuration
5. User executes the pipeline with input data

**Requirements:**
- Visual or programmatic interface for pipeline configuration
- Processor validation to ensure compatible inputs/outputs
- Ability to save and load pipeline configurations

### UC3: Processor Creation and Extension
**Actor:** Developer

**Goal:** Create custom processors to extend the system's capabilities

**Flow:**
1. Developer identifies a need for a new processor type
2. Developer implements the processor interface
3. Developer tests the processor with sample data
4. Developer integrates the processor into the system
5. Processor becomes available for use in pipelines

**Requirements:**
- Well-documented processor interface
- Testing framework for processor validation
- Mechanism to register and discover processors

### UC4: Manual Metadata Refinement
**Actor:** Data Steward

**Goal:** Review and refine automatically generated metadata

**Flow:**
1. System generates initial metadata through automatic processes
2. User reviews generated metadata
3. User edits or enhances specific metadata fields
4. System validates changes against the metadata standard
5. User finalizes and exports the refined metadata

**Requirements:**
- User interface for metadata editing
- Validation against schema requirements
- Tracking of manual vs. automated metadata

## Secondary Use Cases

### UC5: LLM Integration and Customization
**Actor:** Data Provider

**Goal:** Customize and fine-tune LLM behavior for specific metadata generation needs

**Flow:**
1. User configures LLM processor settings (e.g., prompt templates, confidence thresholds)
2. User provides sample data for testing
3. System applies LLM processing with custom settings
4. User reviews results and adjusts settings if needed
5. User saves optimized LLM configuration for future use

**Requirements:**
- Configurable LLM integration settings
- Testing interface for LLM output quality
- Ability to save and share LLM configurations

### UC6: Batch Processing
**Actor:** Data Administrator

**Goal:** Process multiple data files in one operation

**Flow:**
1. User selects multiple data files or a directory
2. User configures processing options
3. System processes all files sequentially
4. System generates metadata for each file
5. User exports all generated metadata

### UC7: Metadata Schema Extension
**Actor:** Standard Developer

**Goal:** Add support for a new metadata standard

**Flow:**
1. User imports SHACL shapes for the new standard
2. System registers the new standard
3. User configures mapping between general metadata and standard-specific fields
4. System validates the configuration
5. A new standard becomes available for metadata generation

## Development Focus Priorities

1. **Core Pipeline Functionality** (UC1, UC2)
   - Complete the basic metadata extraction pipeline
   - Ensure the processor framework is solid and extensible
   - Support for multiple input formats

2. **Metadata Quality** (UC3, UC4)
   - Implement LLM integration for enhanced metadata
   - Develop validation mechanisms
   - Create interfaces for manual refinement

3. **Advanced Features** (UC5, UC6, UC7)
   - LLM integration customization
   - Batch processing capabilities
   - Schema extension mechanisms
   - Performance optimizations for larger datasets

---

*This document will be updated as requirements evolve and implementation progresses.*
