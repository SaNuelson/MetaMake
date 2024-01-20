<!--suppress CheckEmptyScriptTag -->

Metadata generation
===

## Links

- [Survey of Tools for Linked Data Consumption](https://www.semantic-web-journal.net/content/survey-tools-linked-data-consumption-1)
- Linked data related
    - [RDF dataset profiling](https://www.semanticscholar.org/paper/RDF-dataset-profiling-a-survey-of-features%2C-and-Ellefi-Bellahsene/d219df43ed43e39fbb39514de38dd08704c70c9e)
    - [Structure inference for linked data using clustering](https://www.researchgate.net/publication/262328480_Structure_inference_for_linked_data_sources_using_clustering)
- General
    - [Dataset profiling: Tutorial](https://dl.acm.org/doi/abs/10.1145/3035918.3054772)

## Reading rundowns

- [Understanding metadata](https://www.academia.edu/download/82117494/Understanding_20Metadata.pdf)
    - brief rundown of most common data formats (csv, xml, relational, rdf) along with ways metadata are implemented in
      them
- [Functionalities for automatic metadata generation applications: a survey of metadata experts' opinions](https://www.inderscienceonline.com/doi/abs/10.1504/IJMSO.2006.008766)
    - fulltext available through Sci-hub ([here](https://sci-hub.hkvisa.net/10.1504/ijmso.2006.008766) or final
      report [here](https://www.loc.gov/catdir/bibcontrol/lc_amega_final_report))
- [Evaluation of Semi-Automatic Metadata Generation Tools: A Survey of the Current State of the Art](https://ital.corejournals.org/index.php/ital/article/view/5889)

## Problem definition

Open data often comes without annotations, metadat

## Related work

- [Automating metadata generation](https://dl.acm.org/doi/abs/10.1145/1060745.1060825)
    - based on ARIADNE system (portal for archeological data)
    - categorizes metadata generation based on source of information:
        - **Content-based analysis**
            - keywords extraction, language/pattern recognition
        - **Context-based analysis**
            - <todo>Summarize from paper</todo>
        - **Usage analysis**
            - frequency of usage, number of users, length of reading
        - **Composite document structure analysis**
            - relationship with enclosing and/or sibling resources

## Desired metadata

- ### Descriptive metadata
    - the descriptive information about a resource.
    - i.e.:
        - Title
        - Author(s)
        - Subject
        - Description / abstract
        - Keywords, tags
        - Publication date
- ### Technical metadata
    - about file's overall technical details
    - i.e.:
        - File type
        - File size
        - Creation date/time
        - Compression scheme
        - Checksum
        - Access URL
- ### Content metadata
    - metadata about contained data.
    - i.e.:
        - Sequence (i.e., TOC)
        - Types, versions, relationships of contained data
- ### Administrative metadata
    - the information to help manage a resource
    - i.e.:
        - Copyright status
        - License terms
        - Rights holder
- ### Provenance metadata
    - about changes to the data, who/how/when modified the contents
    - i.e.:
        - Modification date/time
        - Modification details
        - Modification author

MetaMake
===

## Main concepts

- user provides knowledge base and input file
- metadata are generated for input file using all knowledge:
    - content of file
    - existing metadata (i.e., kept by OS)
    - knowledge base (both directly and indirectly)

## Process

1. _(optionally)_ User provides **knowledge base**.
2. User provides **resource** to be annotated.
3. **Metadata extraction**
    1. Existing metadata
        - metadata file **explicitly provided** by user
        - OR metadata contained **within** provided resource (i.e., in CSV header)
        - OR metadata **linked to** by resource in standardized way (i.e., XML DTD)
        - metadata available **from system** (i.e. Windows' last modified, created at...)
    2. Context metadata
        - if available, adjacent resources, path to resource
4. **Metadata generation**
    1. Collect and leverage extracted metadata
    2. <todo>Use SOTA metadata generation algorithms</todo>
5. **Metadata validation**
    1. <todo>Validation by checking metadata consistency</todo>
    2. Validation by the user using GUI editor
6. **Metadata export**
    - resource schema (if structured)
      - either embedded into resource
      - or created as a separate file (DTD, XSL) with potentially editting resource to include link
    - document schema
      - DCAT/DCAT-AP/DCAT-US...

---

## Related SW viability for MetMake toolkit

- <no></no> ANVL/ERC Kernel Metadata Conversion toolkit
  - provides conversion from ANVL format to more common ones
  - of no substance to toolkit
- <no></no> Apache POI
  - Java library for Microsoft's proprietary formats
  - of no substance to toolkit
- <maybe></maybe> Apache TIKA
  - able to recognize and read provided file, and extract metadata
- <maybe></maybe> Ariadne harvester
  - part of Ariadne system cataloguing archeological data
  - <todo>Find if/where are docs</todo>
- <no></no> Data Fountains
  - HTML meta tag extractor with crawler and deducing missing meta
  - has potential but seems to be dead
- <no></no> Dublin Core metadata toolkit
  - able to convert metadata to DublinCore conformant RDF
  - seems dead
- <maybe></maybe> Editor‐Converter Dublin Core Metadata
  - converting user input into DC RDF
  - GNUv2, has Github. Usable, but seems to be just a simple mapping, might be just easier to DIY
- <yes></yes> Embedded Metadata Extraction Tool (EMET)
  - extracts embedded image metadata
  - <todo>Check their repo owner (openEQUELLA), for more potential tools</todo>
- <no></no> FreeCite
  - dead
- <yes></yes> General Architecture for Text Engineering
  - analyzes text and extracts keywords, can map to provided ontologies
- <yes></yes> Automatic keyword extractor
  - extract keywords from full-text
  - built in Java
- <no></no> MetaGen
  - builts docs from C# projects
- <no></no> MetaGenerator
  - only for Joomla CMS content
- 

---

<style>
    todo::before {
        content: "TODO: ";
    }
    todo {
        border: 1px solid orange;
        color: orange;
        background-color: #fff2;
        padding: 0 2em;
        border-radius: 10px;
    }
    rant {
        display: block;
        border: 2px dashed lightgreen;
        color: lightgreen;
        background-color: #fff2;
        padding: 0 2em;
        border-radius: 10px;
    }
    yes, no, maybe {
        border: 2px solid white;
        border-radius: 20%;
        padding: 0 .3em;   
        background-color: #fff2;
    }
    yes {
        border-color: limegreen;
        color: limegreen;
    }
    yes::before {content: "Y"}
    no {
        border-color: red;
        color: red;
    }
    no::before {content: "N"}
    maybe {
        border-color: coral;
        color: coral;
    }
    maybe::before {content: "X"}
</style>
