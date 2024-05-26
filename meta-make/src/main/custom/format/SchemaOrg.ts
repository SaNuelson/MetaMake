import Property, {ListProperty, StructuredProperty} from "../../../common/dto/Property.js";
import MetaFormat from "../../../common/dto/MetaFormat.js";

const DataDownload = new StructuredProperty({
  name: "data_download",
  description: "All or part of a Dataset in downloadable form.",
  propertyDefinitions: {
    // TODO
  },
  uri: "https://schema.org/DataDownload"
})

const DataCatalog = new StructuredProperty({
  name: "data_catalog",
  description: "A collection of datasets.",
  propertyDefinitions: {
    // TODO
  },
  uri: "https://schema.org/DataCatalog"
})

const Thing = new StructuredProperty({
  name: "thing",
  description: "The most generic type of item.",
  propertyDefinitions: {
    "description":
      {
        mandatory: true,
        property: new Property({
          name: "description",
          description: "A description of the item.",
          type: "string", // TODO: or file
          uri: "https://schema.org/Text" // TODO: or https://schema.org/TextObject
        }),
        uri: "https://schema.org/description"
      },
    "name":
      {
        mandatory: true,
        property: new Property({
          name: "name",
          description: "The name of the item.",
          type: "string",
          uri: "https://schema.org/Text"
        }),
        uri: "https://schema.org/name"
      },
    "url":
      {
        mandatory: true,
        property: new Property({
          name: "url",
          description: "URL of the item.",
          type: "string",
          uri: "https://schema.org/URL"
        }),
        uri: "https://schema.org/url"
      }
  },
  uri: "https://schema.org/Thing"
})

const Country = new StructuredProperty({
  name: "country",
  description: "A country.",
  propertyDefinitions: {
    "smokingAllowed":
      {
        mandatory: true,
        property: new Property({
          name: "smokingAllowed",
          description: "Indicates whether it is allowed to smoke in the place, e.g. in the restaurant, hotel or hotel room.",
          type: "boolean",
          uri: "https://schema.org/Boolean"
        }),
        uri: "https://schema.org/smokingAllowed"
      },
    "longitude":
      {
        mandatory: true,
        property: new Property({
          name: "longitude",
          description: "The longitude of a location. For example -122.08585 (WGS 84).",
          type: "string", // TODO: or number
          uri: "https://schema.org/Text" // TODO: or https://schema.org/Number
        }),
        uri: "https://schema.org/longitude"
      }
  },
  uri: "https://schema.org/Country"
})




const Dataset = new StructuredProperty({
  name: "Dataset",
  description: "A body of structured information describing some topic(s) of interest.",
  propertyDefinitions: {
    // Properties from Dataset
    "distributions":
      {
        mandatory: true,
        property: new ListProperty({
          name: "Distribution list",
          property: DataDownload
        }),
        uri: "https://schema.org/distribution"
      },
    "includedInDataCatalog":
      {
        mandatory: true,
        property: DataCatalog,
        uri: "https://schema.org/includedInDataCatalog"
      },
    "issns":
      {
        mandatory: true,
        property: new ListProperty({
          name: "issn list",
          property: new Property({
            name: "issn",
            description: "The International Standard Serial Number (ISSN) that identifies this serial publication. You can repeat this property to identify different formats of, or the linking ISSN (ISSN-L) for, this serial publication.",
            type: "string",
            uri: "https://schema.org/Text"
          })
        }),
        uri: "https://schema.org/issn"
      },
    "measurementMethod":
      {
        mandatory: true,
        property: new StructuredProperty({
          // TODO: DefinedTerm or MeasurementMethodEnum or Text or URL
          name: "measurementMethod",
          description: "A subproperty of measurementTechnique that can be used for specifying specific methods, in particular via MeasurementMethodEnum.",
          propertyDefinitions: {
            // TODO
          }
        }),
        uri: "https://schema.org/measurementMethod"
      },
    "measurementTechnique":
      {
        mandatory: true,
        property: new StructuredProperty({
          // TODO: DefinedTerm or MeasurementMethodEnum or Text or URL
          name: "measurementTechnique",
          description: "A technique, method or technology used in an Observation, StatisticalVariable or Dataset (or DataDownload, DataCatalog), corresponding to the method used for measuring the corresponding variable(s)",
          propertyDefinitions: {
            // TODO
          }
        }),
        uri: "https://schema.org/measurementTechnique"
      },
    "variableMeasured":
      {
        mandatory: true,
        property: new StructuredProperty({
          // TODO: Property or PropertyValue or StatisticalVariable or Text
          name: "variableMeasured",
          description: "The variableMeasured property can indicate (repeated as necessary) the variables that are measured in some dataset, either described as text or as pairs of identifier and description using PropertyValue, or more explicitly as a StatisticalVariable.",
          propertyDefinitions: {
            // TODO
          }
        }),
        uri: "https://schema.org/variableMeasured"
      },

    // Properties from CreativeWork
    "about":
      {
        mandatory: true,
        property: Thing,
        uri: "https://schema.org/about"
      },
    "abstract":
      {
        mandatory: true,
        property: new Property({
          name: "abstract",
          description: "An abstract is a short description that summarizes a CreativeWork.",
          type: "string",
          uri: "https://schema.org/Text"
        }),
        uri: "https://schema.org/abstract"
      },
    "author":
      {
        mandatory: true,
        property: new StructuredProperty({
          name: "author",
          description: "The author of this content or rating. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably.",
          propertyDefinitions: {
            // TODO Organization or Person
          }
        }),
        uri: "https://schema.org/author"
      },
    "copyrightYear":
      {
        mandatory: true,
        property: new Property({
          name: "copyrightYear",
          description: "The year during which the claimed copyright for the CreativeWork was first asserted.",
          type: "number",
          uri: "https://schema.org/Number"
        }),
        uri: "https://schema.org/copyrightYear"
      },
    "countryOfOrigin":
      {
        mandatory: true,
        property: Country,
        uri: "https://schema.org/countryOfOrigin"
      },
    "datePublished":
      {
        mandatory: true,
        property: new Property({
          name: "datePublished",
          description: "Date of first publication or broadcast. For example the date a CreativeWork was broadcast or a Certification was issued.",
          type: "date",
          uri: "https://schema.org/Date" // TODO: or https://schema.org/DateTime
        }),
        uri: "https://schema.org/datePublished"
      },
    "isAccessibleForFree":
      {
        mandatory: true,
        property: new Property({
          name: "isAccessibleForFree",
          description: "A flag to signal that the item, event, or place is accessible for free. Supersedes free.",
          type: "boolean",
          uri: "https://schema.org/Boolean"
        }),
        uri: "https://schema.org/isAccessibleForFree"
      },
    "keywords":
      {
        mandatory: true,
        property: new ListProperty({
          name: "Keywords list",
          property: new Property({
            name: "keyword",
            description: "Keywords or tags used to describe some item. Multiple textual entries in a keywords list are typically delimited by commas, or by repeating the property.",
            type: "string", // TODO: or DefinedTerm or URL
            uri: "https://schema.org/Text" // TODO: https://schema.org/DefinedTerm or https://schema.org/URL
          })
        }),
        uri: "https://schema.org/keywords"
      },
    "version":
      {
        mandatory: true,
        property: new Property({
          name: "version",
          description: "The version of the CreativeWork embodied by a specified resource.",
          type: "string", // TODO: or number
          uri: "https://schema.org/Text" // TODO: or https://schema.org/Number
        }),
        uri: "https://schema.org/version"
      },

    // Properties from Thing
    // TODO: add properties from Thing defined above

  }
})

const SchemaOrgDataset = new MetaFormat("Schema.org Dataset", Dataset)

export default SchemaOrgDataset;
