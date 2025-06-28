# Data Classification and Recognition (DCR) System

This module is extracted from the bachelor thesis: [Data Chart Renderer](https://github.com/SaNuelson/DataChartRenderer)

## Overview

The (originally DCR) **ARTISAN** - Automated Recognition of Types In Structured Array Notation, is a module designed to
automatically identify and recognize a fitting format describing the provided array of serialized string values.
It provides capabilities for:

- Identifying underlying data types of provided input
- Recognizing specific patterns in data
- Providing all collected details describing the inferred format
- Parsing new serialized strings conforming to the format into their deserialized typed representation
- Serializing any typed values into their serialized string form conforming to the inferred format

## Core Components

### Core / Catalogue

The main class of the module wraps functionality in a package, expects a read CSV file as an input, then runs aforementioned
functionality on top of each column.

### Parser

The parser module contains logic for recognizing specific data formats:

- **Enum Parser**
  - Uses statistical analysis to identify categorical data
- **Number Parser**
  - Recognizes various numerical formats including integers, decimals, scientific notation, and numbers with different separators.
  - Capable of inferring repeating prefixes (i.e. currency codes / symbols) or suffixes (i.e. units of measurement)
- **Timestamp Parser**
  - Identifies various date and time formats including ISO8601, common regional formats, and specialized time representations.
  - In case of less common timestamps, employs a slower but thorough algorithm to generate and match nearly arbitrary timestamp formats.
- **String Parser**
  - Analyzes text patterns to identify common string formats like emails, URLs, and more.

### Utils

Utility functions supporting the DCR functionality:

- **Array Utils**: Functions for manipulating arrays and sequences.
- **Logic Utils**: Set of higher-order functions made to work with the timestamp format generator.
- **Pattern Utils**: Contains a function designed to generate regex which works as string cutter. Used within recognition process for easy decomposition of incoming strings.
- **String Utils**: String manipulation and pattern matching utilities.
- **Time Utils**: Date and time manipulation helpers.

### Mapper

Set of function responsible to look for potential primary keys, composite keys, etc.

Incomplete and unused.

## Key Concepts

### UseType

UseType is the fundamental concept in the DCR system. It represents a specific data format or pattern that can be:

- Used to validate if a string conforms to a format
- Applied to convert between string representations and typed values
- Compared with other formats to determine relationships (subset, superset, etc.)

Each UseType has:

1. A format specification
2. Functions to convert between string and native representation
3. Domain information (min/max values, constraints)
4. Priority relative to other UseTypes

### Recognition Process

The recognition process typically follows these steps:

1. Analyze a sample of data strings
2. Generate candidate UseType formats
3. Test formats against the full dataset
4. Filter and rank the valid formats
5. Select the most appropriate formats based on priority and confidence

## Usage Examples

```typescript
// Recognize number formats in a dataset
const numbers = ['1,000', '2,000', '3,000', '4,000', '5,000'];
const numberFormats = recognizeNumbers(numbers, {});

// Recognize timestamp formats
const dates = ['2023-01-15', '2023-02-20', '2023-03-25'];
const timestampFormats = recognizeTimestamps(dates, {});
```

## Planned Enhancements

### Confidence and Reliability Scoring

Enhance the format recognition system with a more sophisticated scoring mechanism including:

#### 1. Confidence Scoring

A confidence score representing how likely a specific format is the correct interpretation of the data.

In contrast to priority score, which is inherent to each of the different useTypes, this should be set dynamically
based on its formatting. Potentially, priority may take ultimate precedence, with confidence only giving order to formats
of the same useType.

For example, for numbers:
- A format with commas as thousands separators would receive higher confidence. That is, if a thousands separator is inferred
from the data, it means the thousands separator is preceded/succeeded by a fitting number of digits, which makes it less likely
to be a false positive, rather than decimal separator.
- On the other hand, a format with commas as decimal separators would receive lower confidence for the same data.
- Naturally, the scoring needs to be more complex. Multiple identical separators in a number should shift confidence towards thousands separators.
Similarly, at most a single identical separator should shift confidence towards decimal separators, 
especially if the number has enough digits to consider a thousands separator missing.

For timestamps:
- More restrictive formats (with more specific tokens) would get higher confidence when they match
- Formats requiring padded days (DD vs D) would have higher confidence than those accepting both

#### 2. Reliability Metric

A reliability metric will indicate what percentage of the source data was successfully matched by a format:

- Will account for null values that should be excluded from the calculation
- May consider unique values vs. total values
- Provides a clear measure of how well a format covers the dataset

#### 3. Combined Scoring

The final ranking of formats will combine:

- **Priority**: The inherent precedence of the format class
- **Confidence**: How well the specific format features match the data patterns
- **Reliability**: How much of the dataset is successfully parsed

This approach will enable more intelligent handling of ambiguous formats and provide better default interpretations while preserving all valid alternatives.
