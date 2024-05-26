import Property, { StructuredProperty } from "../../../common/dto/Property.js";
import MetaFormat from "../../../common/dto/MetaFormat.js";

const Dataset = new StructuredProperty({
  name: "Dataset",
  description: "A set of RDF triples that are published, maintained or aggregated by a single provider.",
  propertyDefinitions: {
    "number_of_properties":
      {
        mandatory: true,
        property: new Property({
          name: "Number of properties",
          description: "The total number of distinct properties in a void:Dataset. In other words, the number of distinct resources that occur in the predicate position of triples in the dataset.",
          type: "number",
          uri: "https://www.w3.org/2001/XMLSchema#integer"
        }),
        uri: "http://rdfs.org/ns/void#properties"
      },
    "vocabulary":
      {
        mandatory: true,
        property: new Property({
          name: "Vocabulary",
          description: "A vocabulary that is used in the dataset.",
          type: "object" // TODO: ???
        }),
        uri: "http://rdfs.org/ns/void#vocabulary"
      },
    "feature":
      {
        mandatory: true,
        // TODO: ???
        property: new StructuredProperty({
          name: "Feature",
          description: "",
          propertyDefinitions: {
            "technical_feature":
              {
                mandatory: true,
                property: new Property({
                  name: "Technical feature",
                  description: "A technical feature of a void:Dataset, such as a supported RDF serialization format.",
                  type: "object"
                }),
                uri: "http://rdfs.org/ns/void#TechnicalFeature"
              }
          }
        }),
        uri: "http://rdfs.org/ns/void#feature"
      },
    "classes":
      {
        mandatory: true,
        property: new Property({
          name: "Classes",
          description: "The total number of distinct classes in a void:Dataset. In other words, the number of distinct resources occuring as objects of rdf:type triples in the dataset.",
          type: "number",
          uri: "https://www.w3.org/2001/XMLSchema#integer"
        }),
        uri: "http://rdfs.org/ns/void#classes"
      },
    "distinct_subjects":
      {
        mandatory: true,
        property: new Property({
          name: "Distinct subjects",
          description: "The total number of distinct subjects in a void:Dataset. In other words, the number of distinct resources that occur in the subject position of triples in the dataset.",
          type: "number",
          uri: "https://www.w3.org/2001/XMLSchema#integer"
        }),
        uri: "http://rdfs.org/ns/void#distinctSubjects"
      },
    "number_of_entities":
      {
        mandatory: true,
        property: new Property({
          name: "Number of entities",
          description: "The total number of entities that are described in a void:Dataset.",
          type: "number",
          uri: "https://www.w3.org/2001/XMLSchema#integer"
        }),
        uri: "http://rdfs.org/ns/void#entities"
      },
    "has_subset":
      {
        mandatory: true,
        property: new Property({
          name: "Has subset",
          description: "",
          type: "object",
          uri: "http://rdfs.org/ns/void#Dataset"
        }),
        uri: "http://rdfs.org/ns/void#subset"
      },
    "uri_space":
      {
        mandatory: true,
        property: new Property({
          name: "URI space",
          description: "A URI that is a common string prefix of all the entity URIs in a void:Dataset.",
          type: "string", // TODO: ???
          uri: "https://www.w3.org/2000/01/rdf-schema#Literal"
        }),
        uri: "http://rdfs.org/ns/void#uriSpace"
      },
    "class_partition":
      {
        mandatory: true,
        property: new StructuredProperty({
          name: "Class Partition",
          description: "A subset of a void:Dataset that contains only the entities of a certain rdfs:Class.",
          propertyDefinitions: {
            "subset":
              {
                mandatory: true,
                property: new Property({
                  name: "Subset",
                  description: "",
                  type: "object", // TODO: ???
                  uri: "http://rdfs.org/ns/void#Dataset" // TODO: ???
                }),
                uri: "http://rdfs.org/ns/void#subset"
              }
          },
        }),
        uri: "http://rdfs.org/ns/void#classPartition"
      },
    "has_an_URI_look-up_endpoint_at":
      {
        mandatory: true,
        property: new Property({
          name: "Has an URI look-up endpoint at",
          description: "Defines a simple URI look-up protocol for accessing a dataset.",
          type: "string" // TODO: ???
        }),
        uri: "http://rdfs.org/ns/void#uriLookupEndpoint"
      },
    "property":
      {
        mandatory: true,
        property: new Property({
          name: "Property",
          description: "The rdf:Property that is the predicate of all triples in a property-based partition.",
          type: "string", // TODO: ???
          uri: "https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }),
        uri: "http://rdfs.org/ns/void#property"
      },
    "data_dump":
      {
        mandatory: true,
        property: new Property({
          name: "Data Dump",
          description: "An RDF dump, partial or complete, of a void:Dataset.",
          type: "string", // TODO: ???
          uri: "https://www.w3.org/2000/01/rdf-schema#Resource"
        }),
        uri: "http://rdfs.org/ns/void#dataDump"
      },
    "distinct_objects":
      {
        mandatory: true,
        property: new Property({
          name: "Distinct objects",
          description: "The total number of distinct objects in a void:Dataset. In other words, the number of distinct resources that occur in the object position of triples in the dataset. Literals are included in this count.",
          type: "number",
          uri: "https://www.w3.org/2001/XMLSchema#integer"
        }),
        uri: "http://rdfs.org/ns/void#distinctObjects"
      },
    "example_resource_of_dataset":
      {
        mandatory: true,
        property: new Property({
          name: "Example resource of dataset",
          description: "",
          type: "object", // TODO: ???
          uri: "https://www.w3.org/2000/01/rdf-schema#Resource"
        }),
        uri: "http://rdfs.org/ns/void#exampleResource"
      },
    "class":
      {
        mandatory: true,
        property: new Property({
          name: "Class",
          description: "The rdfs:Class that is the rdf:type of all entities in a class-based partition.",
          type: "object", // TODO: ???
          uri: "https://www.w3.org/2000/01/rdf-schema#Class"
        }),
        uri: "http://rdfs.org/ns/void#class"
      },
    "root_resource":
    // TODO: top?
      {
        mandatory: true,
        property: new Property({
          name: "Root resource",
          description: "A top concept or entry point for a void:Dataset that is structured in a tree-like fashion. All resources in a dataset can be reached by following links from its root resources in a small number of steps.",
          type: "object", // TODO: ???
        }),
        uri: "http://rdfs.org/ns/void#rootResource"
      },
    "has_a_SPARQL_endpoint_at":
      {
        mandatory: true,
        property: new Property({
          name: "has a SPARQL endpoint at",
          description: "",
          type: "string", // TODO: ???
        }),
        uri: "http://rdfs.org/ns/void#sparqlEndpoint"
      },
    "open_search_description":
      {
        mandatory: true,
        property: new Property({
          name: "Open search description",
          description: "An OpenSearch description document for a free-text search service over a void:Dataset.",
          type: "object", // TODO: ???
          uri: "http://xmlns.com/foaf/0.1/Document"
        }),
        uri: "http://rdfs.org/ns/void#openSearchDescription"
      },
    "property_partition":
      {
        mandatory: true,
        property: new Property({
          name: "Property partition",
          description: "A subset of a void:Dataset that contains only the triples of a certain rdf:Property.",
          type: "object", // TODO: ???
          uri: "http://rdfs.org/ns/void#Dataset"
        }),
        uri: "http://rdfs.org/ns/void#propertyPartition"
      },
    "number_of_documents":
      {
        mandatory: true,
        property: new Property({
          name: "Number of documents",
          description: "The total number of documents, for datasets that are published as a set of individual documents, such as RDF/XML documents or RDFa-annotated web pages. Non-RDF documents, such as web pages in HTML or images, are usually not included in this count. This property is intended for datasets where the total number of triples or entities is hard to determine. void:triples or void:entities should be preferred where practical.",
          type: "number",
          uri: "https://www.w3.org/2001/XMLSchema#integer"
        }),
        uri: "http://rdfs.org/ns/void#documents"
      },
    "number_of_triples":
      {
        mandatory: true,
        property: new Property({
          name: "Number of triples",
          description: "The total number of triples contained in a void:Dataset.",
          type: "number",
          uri: "https://www.w3.org/2001/XMLSchema#integer"
        }),
        uri: "http://rdfs.org/ns/void#triples"
      },
  },
  uri: "http://rdfs.org/ns/void#Dataset"
})

const Void = new MetaFormat("VoID Dataset", Dataset)

export default Void;
