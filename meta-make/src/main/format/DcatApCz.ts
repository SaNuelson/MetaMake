import MetaProperty, {
  StructuredMetaProperty
} from "../../common/dto/MetaProperty";
import MetaFormat from "../../common/dto/MetaFormat";
import {
  MandatoryArity,
  OneOrMoreArity,
  OptionalArity,
  UnboundedArity
} from "../../common/dto/ArityBounds";
import { getEuCodebook } from "./fetchers/dcat.js";
import MetaStore from "../data/MetaStore.js";
import { CodebookEntry } from "../../common/dto/CodebookEntry.js";

// region Codebooks
const ThemeCodebook: CodebookEntry[] = await MetaStore.getCached(
  async () => getEuCodebook("http://publications.europa.eu/resource/authority/data-theme", "cs"),
  3000,
  "ThemeCodebook"
);
const AccrualPeriodicityCodebook: CodebookEntry[] = await MetaStore.getCached(
  async () => getEuCodebook("http://publications.europa.eu/resource/authority/frequency", "cs"),
  3000,
  "AccrualPeriodicityCodebook"
);
const GeoTerritoryCodebook: CodebookEntry[] = [
  ...(await MetaStore.getCached(
    () => getEuCodebook("http://publications.europa.eu/resource/authority/continent", "cs"),
    3000,
    "GeoTerritoryCodebook1"
  )),
  ...(await MetaStore.getCached(
    () => getEuCodebook("http://publications.europa.eu/resource/dataset/country", "cs"),
    3000,
    "GeoTerritoryCodebook2"
  )),
  ...(await MetaStore.getCached(
    () => getEuCodebook("http://publications.europa.eu/resource/dataset/place", "cs"),
    3000,
    "GeoTerritoryCodebook3"
  ))
];
const IntelPropertyCodebook: CodebookEntry[] = [
  {
    uri: "https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/obsahuje-v%C3%ADce-autorsk%C3%BDch-d%C4%9Bl/",
    value: "Distribuce datové sady obsahuje více autorských děl"
  },
  {
    uri: "https://creativecommons.org/licenses/by/4.0/",
    value: "Licence CC BY 4.0 DEED"
  },
  {
    uri: "https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/neobsahuje-autorsk%C3%A1-d%C3%ADla/",
    value: "Distribuce datové sady neobsahuje autorská díla"
  }
];
const DatabaseOriginalityCodebook: CodebookEntry[] = [
  {
    uri: "https://creativecommons.org/licenses/by/4.0/",
    value: "Licencované CC BY 4.0 DEED"
  },
  {
    uri: "https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/nen%C3%AD-autorskopr%C3%A1vn%C4%9B-chr%C3%A1n%C4%9Bnou-datab%C3%A1z%C3%AD/",
    value: "Distribuce datové sady není autorskoprávně chráněnou databází"
  }
];
const DatabaseIntelPropertyCodebook: CodebookEntry[] = [
  {
    uri: "https://creativecommons.org/publicdomain/zero/1.0/",
    value: "Licence CC0 1.0 DEED"
  },
  {
    uri: "https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/nen%C3%AD-chr%C3%A1n%C4%9Bna-zvl%C3%A1%C5%A1tn%C3%ADm-pr%C3%A1vem-po%C5%99izovatele-datab%C3%A1ze/",
    value: "Distribuce datové sady není chráněna zvláštním právem pořizovatele databáze"
  }
];
const PersonalDataPresenceCodebook: CodebookEntry[] = [
  {
    uri: "https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/obsahuje-osobn%C3%AD-%C3%BAdaje/",
    value: "Distribuce datové sady obsahuje osobní údaje"
  },
  {
    uri: "https://data.gov.cz/podm%C3%ADnky-u%C5%BEit%C3%AD/neobsahuje-osobn%C3%AD-%C3%BAdaje/",
    value: "Distribuce datové sady neobsahuje osobní údaje"
  }
];
// endregion

// region 3.5 Třída: Datová služba
const DatovaSluzba = new StructuredMetaProperty({
  name: "Datová služba",
  description: "Třída reprezentující datovou službu zpřístupňující data datové sady. Odpovídá třídě dcat:DataService.",
  children: [
    // 3.5.1 Název
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Název",
        description: "Tato vlastnost obsahuje název datové služby. Odpovídá vlastnosti dct:title.",
        type: "string",
        uri: "http://purl.org/dc/terms/title"
      })
    },
    // 3.5.2 Přístupový bod
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Přístupový bod",
        description: "Tato vlastnost obsahuje URL přístupového bodu datové služby. Odpovídá vlastnosti dcat:endpointURL.",
        type: "string",
        uri: "http://www.w3.org/ns/dcat#endpointURL"
      })
    },
    // 3.5.3 Odkaz na specifikaci
    {
      arity: OptionalArity,
      property: new MetaProperty({
        name: "Odkaz na specifikaci",
        description: "Tato vlastnost odkazuje na specifikaci, jíž se datová služba řídí. Takovou specifikací je například SPARQL. Seznam možných hodnot lze nalézt například v seznamu udržovaném Open Source Geospatial Foundation. Odpovídá vlastnosti dct:conformsTo.",
        type: "string",
        uri: "http://purl.org/dc/terms/conformsTo" // URL specifikace.
      })
    },
    // 3.5.4 Popis přístupového bodu
    {
      arity: OptionalArity,
      property: new MetaProperty({
        name: "Popis přístupového bodu",
        description: "Tato vlastnost obsahuje URL popisu přístupového bodu datové služby. Odpovídá vlastnosti dcat:endpointDescription.",
        type: "string",
        uri: "http://www.w3.org/ns/dcat#endpointDescription"
      })
    }
  ],
  uri: "http://www.w3.org/ns/dcat#DataService"
});
// endregion

// region 3.4 Třída: Distribuce datové sady
const Distribuce = new StructuredMetaProperty({
  name: "Distribuce datové sady",
  description: "Fyzická podoba datové sady v konkrétním formátu nebo jako konkrétní služba, nikdy obojí. Odpovídá třídě dcat:Distribution.",
  children: [
    // 3.4.1 Specifikace podmínek užití
    {
      arity: MandatoryArity,
      // TODO: Check
      property: new StructuredMetaProperty({
        name: "Specifikace podmínek užití",
        description: "Tato vlastnost odkazuje na strukturovaný popis podmínek užití této distribuce datové sady. Hodnoty se řídí návodem na stanovení podmínek užití.",
        children: [
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "Podmínky užití autorského díla",
              description: "Podmínky užití autorského díla.",
              domain: IntelPropertyCodebook,
              isDomainStrict: false,
              type: "string"
            })
          },
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "Autor díla",
              description: "Autor díla.",
              type: "string"
            })
          },
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "Podmínky užití databáze jako autorského díla",
              description: "Podmínky užití databáze jako autorského díla.",
              domain: DatabaseIntelPropertyCodebook,
              isDomainStrict: true,
              type: "string"
            })
          },
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "Autor databáze",
              description: "Autor databáze.",
              type: "string"
            })
          },
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "Přítomnost osobích údajů",
              description: "Přítomnost osobích údajů.",
              domain: PersonalDataPresenceCodebook,
              type: "string"
            })
          }
        ]
      })
    },
    // 3.4.2 Odkaz na stažení souboru
    {
      // TODO: Povinná pro soubor ke stažení
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Odkaz na stažení souboru",
        description: "Tato vlastnost obsahuje URL, které je přímým odkazem na stažitelný soubor v daném formátu. Odpovídá vlastnosti dcat:downloadURL.",
        type: "string",
        uri: "http://www.w3.org/ns/dcat#downloadURL" // URL souboru ke stažení.
      })
    },
    // 3.4.3 Přístupové URL
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Přístupové URL",
        description: "Tato vlastnost obsahuje URL, pomocí kterého se lze dostat k distribuci datové sady. Odpovídá vlastnosti dcat:accessURL. Pro účely katalogů otevřených dat v ČR je hodnota této vlastnosti buďto stejná jako odkaz na stažení souboru v případě distribuce reprezentující soubor ke stažení, nebo stejná jako přístupový bod v případě distribuce reprezentující datovou službu.",
        type: "string",
        uri: "http://www.w3.org/ns/dcat#accessURL" // Přístupové URL distribuce datové sady.
      })
    },
    // 3.4.4 Formát souboru ke stažení
    {
      // TODO: Povinná pro soubor ke stažení 0...1
      // TODO: IRI
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Formát souboru ke stažení",
        description: "Tato vlastnost odkazuje na typ souboru s distribucí. Odpovídá vlastnosti dct:format. Dle DCAT-AP 2.0.1 jsou hodnoty z evropského číselníku typů souboru.",
        type: "string",
        uri: "http://purl.org/dc/terms/format"
      })
    },
    // 3.4.5 Media type souboru ke stažení
    {
      // TODO: Povinná pro soubor ke stažení 0...1
      // TODO: IRI
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Media type souboru ke stažení",
        description: "Tato vlastnost odkazuje na typ média distribuce tak, jak je definováno v oficiálním rejstříku typů médií spravovaném IANA [IANA-MEDIA-TYPES]. Odpovídá vlastnosti dcat:mediaType.",
        type: "string",
        uri: "http://www.w3.org/ns/dcat#mediaType"
      })
    },
    // 3.4.6 Odkaz na strojově čitelné schéma souboru ke stažení
    {
      arity: OptionalArity,
      property: new MetaProperty({
        name: "Odkaz na strojově čitelné schéma souboru ke stažení",
        description: "Tato vlastnost odkazuje na ustanovené schéma, jímž se popisovaná distribuce řídí. Odpovídá vlastnosti dct:conformsTo.",
        type: "string",
        uri: "http://purl.org/dc/terms/conformsTo" // URL schématu.
      })
    },
    // 3.4.7 Media type kompresního formátu
    {
      arity: OptionalArity,
      property: new MetaProperty({
        // TODO: IRI
        name: "Media type použitého kompresního formátu souboru ke stažení",
        description: "Tato vlastnost odkazuje na media typ kompresního formátu souboru ke stažení tak, jak je definováno v oficiálním rejstříku typů médií spravovaném IANA [IANA-MEDIA-TYPES]. Kompresní formát určuje techniku použitou ke zmenšení velikosti jednoho souboru ke stažení. Odpovídá vlastnosti dcat:compressFormat.",
        type: "string",
        uri: "http://www.w3.org/ns/dcat#compressFormat"
      })
    },
    // 3.4.8 Media type balíčkovacího formátu
    {
      arity: OptionalArity,
      property: new MetaProperty({
        // TODO: IRI
        name: "Media type použitého balíčkovacího formátu souboru ke stažení",
        description: "Tato vlastnost odkazuje na media typ balíčkovacího formátu souboru ke stažení tak, jak je definováno v oficiálním rejstříku typů médií spravovaném IANA [IANA-MEDIA-TYPES]. Balíčkovací formát určuje techniku použitou k zabalení více souborů do jednoho. Odpovídá vlastnosti dcat:packageFormat.",
        type: "string",
        uri: "http://www.w3.org/ns/dcat#packageFormat"
      })
    },
    // 3.4.9 Název distribuce datové sady
    {
      arity: OptionalArity,
      property: new MetaProperty({
        name: "Název distribuce datové sady",
        description: "Tato vlastnost obsahuje název distribuce. Odpovídá vlastnosti dct:title.",
        type: "string",
        uri: "http://purl.org/dc/terms/title"
      })
    },
    // 3.4.10 Vazba: přístupová služba
    {
      // TODO: Povinná pro datovou službu
      arity: OptionalArity,
      property: DatovaSluzba
    }
  ],
  uri: "http://www.w3.org/ns/dcat#distribution"
});
// endregion

// region 3.3 Třída: Datová sada
const DatovaSada = new StructuredMetaProperty({
  name: "Datová sada",
  description: "Klíčová třída reprezentující poskytovanou informaci. Odpovídá třídě dcat:Dataset.",
  children: [
    // 3.3.1 Název
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Název",
        description: "Tato vlastnost obsahuje název datové sady. Odpovídá vlastnosti dct:title.",
        type: "string",
        uri: "http://purl.org/dc/terms/title"
      })
    },
    // 3.3.2 Popis
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Popis",
        description: "Tato vlastnost obsahuje volný text s popisem datové sady. Odpovídá vlastnosti dct:description.",
        type: "string",
        uri: "http://purl.org/dc/terms/description"
      })
    },
    // 3.3.3 Poskytovatel
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Poskytovatel",
        description: "Poskytovatel datové sady. Odpovídá vlastnosti dct:publisher.",
        type: "string",
        uri: "http://purl.org/dc/terms/publisher" // IRI OVM z Registru práv a povinností (RPP}).
      })
    },
    // 3.3.4 Téma
    {
      arity: OneOrMoreArity,
      property: new MetaProperty({
        name: "Téma",
        description: "Tato vlastnost odkazuje na kategorii či téma datové sady. Datová sada může být popsána více tématy. Odpovídá vlastnosti dcat:theme. Dle DCAT-AP 2.0.1 musí být alespoň jedno téma z evropského číselníku datových témat.",
        domain: ThemeCodebook,
        isDomainStrict: true,
        type: "string",
        uri: "http://www.w3.org/ns/dcat#theme"
      })
    },
    // 3.3.5 Periodicita aktualizace
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Periodicita aktualizace",
        description: "Tato vlastnost odkazuje na frekvenci, se kterou je datová sada aktualizována. Odpovídá vlastnosti dct:accrualPeriodicity. Dle DCAT-AP 2.0.1 jsou hodnoty z evropského číselníku frekvencí.",
        domain: AccrualPeriodicityCodebook,
        isDomainStrict: true,
        type: "string",
        uri: "http://purl.org/dc/terms/accrualPeriodicity"
      })
    },
    // 3.3.6 Klíčová slova
    {
      arity: OneOrMoreArity,
      property: new MetaProperty({
        name: "Klíčová slova",
        description: "Tato vlastnost obsahuje klíčové slovo nebo značku popisující datovou sadu. Odpovídá vlastnosti dcat:keyword.",
        type: "string",
        uri: "http://www.w3.org/ns/dcat#keyword"
      })
    },
    // 3.3.7 Související geografické území - prvek z RÚIAN
    {
      arity: OneOrMoreArity,
      // TODO:  Codebook value (IRI})
      property: new MetaProperty({
        name: "Související geografické území - prvek z RÚIAN",
        description: "Tato vlastnost odkazuje na územní prvek RÚIAN pokrytý datovou sadou. Datová sada může pokrývat více územních prvků RÚIAN. Odpovídá vlastnosti dct:spatial.",
        type: "string",
        uri: "http://purl.org/dc/terms/spatial"
      })
    },
    // 3.3.8 Související geografické území
    {
      arity: OneOrMoreArity,
      property: new MetaProperty({
        name: "Související geografické území",
        description: "Tato vlastnost odkazuje na geografickou oblast pokrytou datovou sadou. Datová sada může být popsána více geografickými oblastmi. Odpovídá vlastnosti dct:spatial.",
        // TODO: v popise nepovinna, v scheme 1...*
        // TODO: Add GeoNames
        domain: GeoTerritoryCodebook,
        isDomainStrict: false,
        type: "string",
        uri: "http://purl.org/dc/terms/spatial"
      })
    },
    // 3.3.9 Časové pokrytí
    {
      arity: OptionalArity,
      property: new StructuredMetaProperty({
        name: "Časové pokrytí",
        description: "Tato vlastnost odkazuje na časový úsek pokrytý datovou sadou. Odpovídá vlastnosti dct:temporal.",
        // TODO: check children
        children: [
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "Začátek",
              description: "Začátek časového pokrytí.",
              type: "date",
              uri: "http://www.w3.org/ns/dcat#startDate"
            })
          },
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "Konec",
              description: "Konec časového pokrytí.",
              type: "date",
              uri: "http://www.w3.org/ns/dcat#endDate"
            })
          }
        ],
        uri: "http://purl.org/dc/terms/temporal"
      })
    },
    // 3.3.10 Kontaktní bod - jméno a email
    {
      arity: OptionalArity,
      property: new StructuredMetaProperty({
        name: "Kontaktní bod - jméno a email",
        description: "Tato vlastnost obsahuje kontaktní informace, které mohou být využity pro zasílání připomínek k datové sadě. Odpovídá vlastnosti dcat:contactPoint.",
        children: [
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "Jméno",
              description: "Jméno kontaktního bodu.",
              type: "string",
              uri: "http://www.w3.org/2006/vcard/ns#fn"
            })
          },
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "E-mail",
              description: "E-mail kontaktního bodu.",
              type: "string",
              uri: "http://www.w3.org/2006/vcard/ns#hasEmail"
            })
          }
        ],
        uri: "http://www.w3.org/ns/dcat#contactPoint"
      })
    },
    // 3.3.11 Odkaz na dokumentaci
    {
      arity: OptionalArity,
      property: new MetaProperty({
        name: "Odkaz na dokumentaci",
        description: "Tato vlastnost odkazuje na stránku nebo dokument o datové sadě. Odpovídá vlastnosti foaf:page.",
        type: "string",
        uri: "http://xmlns.com/foaf/0.1/page" // URL webové stránky dokumentace.
      })
    },
    // 3.3.12 Odkaz na specifikaci
    {
      arity: UnboundedArity,
      property: new MetaProperty({
        name: "Odkaz na specifikaci",
        description: "Tato vlastnost odkazuje na specifikaci, jíž se datová sada řídí. Takovou specifikací jsou zejména Otevřené formální normy. Odpovídá vlastnosti dct:conformsTo.",
        type: "string",
        uri: "http://purl.org/dc/terms/conformsTo" // URL specifikace.
      })
    },
    // 3.3.13 Klasifikace dle EuroVoc
    {
      arity: UnboundedArity,
      // TODO: Codebook (crazy big RDF, possibly converted xml table (code: name}) for CZ, but only in zip with others
      property: new MetaProperty({
        name: "Klasifikace dle EuroVoc",
        description: "Tato vlastnost odkazuje na kategorii či téma datové sady dle EuroVoc. Datová sada může být popsána více tématy. Odpovídá vlastnosti dcat:theme.",
        type: "string",
        uri: "http://www.w3.org/ns/dcat#theme"
      })
    },
    // 3.3.14 Prostorové rozlišení v metrech
    {
      arity: OptionalArity,
      property: new MetaProperty({
        name: "Prostorové rozlišení v metrech",
        description: "Tato vlastnost určuje prostorové rozlišení dat v datové sadě v metrech. Jedná se o nejmenší prostorový rozdíl v datové sadě. Odpovídá vlastnosti dcat:spatialResolutionInMeters.",
        type: "number",
        uri: "http://www.w3.org/ns/dcat#spatialResolutionInMeters"
      })
    },
    // 3.3.15 Časové rozlišení
    {
      arity: OptionalArity,
      property: new MetaProperty({
        name: "Časové rozlišení",
        description: "Tato vlastnost určuje časové rozlišení dat v datové sadě. Jedná se o nejmenší časový rozdíl v datové sadě. Odpovídá vlastnosti dcat:temporalResolution.",
        type: "date", // TODO: correct type??
        uri: "http://www.w3.org/ns/dcat#temporalResolution"
      })
    },
    // 3.3.16 Vazba: Je součástí
    {
      arity: OptionalArity,
      property: new MetaProperty({
        // TODO: IRI
        name: "Je součástí",
        description: "Tato vlastnost odkazuje na zastřešující datovou sadu datové série, jejíž je tato datová sada součástí. Odpovídá vlastnosti dct:isPartOf.",
        type: "string",
        uri: "http://purl.org/dc/terms/isPartOf"
      })
    },
    // 3.3.17 Vazba: Distribuce datové sady
    {
      // TODO: Povinná, pokud se nejedná o zastřešující datovou sadu datové série, 0...*
      arity: MandatoryArity,
      property: Distribuce
    }
  ],
  uri: "http://www.w3.org/ns/dcat#dataset"
});
// endregion

// region 3.2 Třída: Katalog
// @ts-ignore
const Katalog = new StructuredMetaProperty({
  name: "Katalog",
  description: "Třída reprezentující datový katalog. Odpovídá třídě dcat:Catalog.",
  children: [
    // 3.2.1 Název
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Název",
        description: "Tato vlastnost obsahuje název datového katalogu. Odpovídá vlastnosti dct:title.",
        type: "string"
      })
    },
    // 3.2.2 Popis
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Popis",
        description: "Tato vlastnost obsahuje volný text s popisem datového katalogu. Odpovídá vlastnosti dct:description.",
        type: "string"
      })
    },
    // 3.2.3 Poskytovatel
    {
      arity: MandatoryArity,
      property: new MetaProperty({
        name: "Poskytovatel",
        description: "Poskytovatel datového katalogu. Odpovídá vlastnosti dct:publisher.",
        type: "string"
        // IRI, OVM z Registru práv a povinností (RPP}).
      })
    },
    // 3.2.4 Kontaktní bod - jméno a email
    {
      arity: OptionalArity,
      property: new StructuredMetaProperty({
        name: "Kontaktní bod - jméno a email",
        description: "Tato vlastnost obsahuje kontaktní informace, které mohou být využity pro zasílání připomínek ke katalogu. Odpovídá vlastnosti dcat:contactPoint.",
        children: [
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "Jméno",
              description: "Jméno kontaktního bodu.",
              type: "string"
            })
          },
          {
            arity: MandatoryArity,
            property: new MetaProperty({
              name: "E-mail",
              description: "E-mail kontaktního bodu.",
              type: "string"
            })
          }
        ]
      })
    },
    // 3.2.5 Domovská stránka
    {
      arity: OptionalArity,
      property: new MetaProperty({
        name: "Domovská stránka",
        description: "Tato vlastnost odkazuje na domovskou stránku lokálního katalogu, kam mohou chodit uživatelé. Odpovídá vlastnosti foaf:homepage.",
        type: "string"
        // URL webové stránky.
      })
    },
    // 3.2.6 Vazba: Datová sada
    {
      arity: UnboundedArity,
      property: DatovaSada
    }
  ]
});
// endregion

const DcatApCz = new MetaFormat("DCAT-AP-CZ", DatovaSada)

export default DcatApCz;
