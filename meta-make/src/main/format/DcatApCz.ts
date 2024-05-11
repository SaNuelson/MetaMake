import MetaProperty, {
  UnboundedArity,
  MandatoryArity,
  OptionalArity,
  OneOrMoreArity,
  StructuredMetaProperty
} from '../../common/dto/MetaProperty'
import MetaFormat from '../../common/dto/MetaFormat'

// region 3.5 Třída: Datová služba
const DatovaSluzba = new StructuredMetaProperty(
  'Datová služba',
  'Třída reprezentující datovou službu zpřístupňující data datové sady. Odpovídá třídě dcat:DataService.',
  [
    // 3.5.1 Název
    {
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Název',
          'Tato vlastnost obsahuje název datové služby. Odpovídá vlastnosti dct:title.',
          'string'
        ),
    },
    // 3.5.2 Přístupový bod
    {
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Přístupový bod',
          'Tato vlastnost obsahuje URL přístupového bodu datové služby. Odpovídá vlastnosti dcat:endpointURL.',
          'string',
          'url'
        ),
    },
    // 3.5.3 Odkaz na specifikaci
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          'Odkaz na specifikaci',
          'Tato vlastnost odkazuje na specifikaci, jíž se datová služba řídí. Takovou specifikací je například SPARQL. Seznam možných hodnot lze nalézt například v seznamu udržovaném Open Source Geospatial Foundation. Odpovídá vlastnosti dct:conformsTo.',
          'string',
          'url' // URL specifikace.
        ),
    },
    // 3.5.4 Popis přístupového bodu
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          'Popis přístupového bodu',
          'Tato vlastnost obsahuje URL popisu přístupového bodu datové služby. Odpovídá vlastnosti dcat:endpointDescription.',
          'string',
          'url'
        )
    }
  ]
)
// endregion

// region 3.4 Třída: Distribuce datové sady
const Distribuce = new StructuredMetaProperty(
  'Distribuce datové sady',
  'Fyzická podoba datové sady v konkrétním formátu nebo jako konkrétní služba, nikdy obojí. Odpovídá třídě dcat:Distribution.',
  [
    // 3.4.1 Specifikace podmínek užití
    {
      arity: MandatoryArity,
      // TODO: Check
      property:
        new StructuredMetaProperty(
          'Specifikace podmínek užití',
          'Tato vlastnost odkazuje na strukturovaný popis podmínek užití této distribuce datové sady. Hodnoty se řídí návodem na stanovení podmínek užití.',
          [
            {
              arity: MandatoryArity,
              property:
                new MetaProperty(
                  'Podmínky užití autorského díla',
                  'Podmínky užití autorského díla.',
                  'string'
                ),
            },
            {
              arity: MandatoryArity,
              property:
                new MetaProperty('Autor díla', 'Autor díla.', 'string'),
            },
            {
              arity: MandatoryArity,
              property:
                new MetaProperty(
                  'Podmínky užití databáze jako autorského díla',
                  'Podmínky užití databáze jako autorského díla.',
                  'string'
                ),
            },
            {
              arity: MandatoryArity,
              property:
                new MetaProperty('Autor databáze', 'Autor databáze.', 'string'),
            },
            {
              arity: MandatoryArity,
              property:
                new MetaProperty(
                  'Podmínky užití databáze chráněné zvláštními právy',
                  'Podmínky užití databáze chráněné zvláštními právy.',
                  'string'
                ),
            },
            {
              arity: MandatoryArity,
              property:
                new MetaProperty(
                  'Přítomnost osobích údajů',
                  'Přítomnost osobích údajů.',
                  'string'
                )
            }
          ]
        ),
    },
    // 3.4.2 Odkaz na stažení souboru
    {
      // TODO: Povinná pro soubor ke stažení
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Odkaz na stažení souboru',
          'Tato vlastnost obsahuje URL, které je přímým odkazem na stažitelný soubor v daném formátu. Odpovídá vlastnosti dcat:downloadURL.',
          'string',
          'url' // URL souboru ke stažení.
        ),
    },
    // 3.4.3 Přístupové URL
    {
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Přístupové URL',
          'Tato vlastnost obsahuje URL, pomocí kterého se lze dostat k distribuci datové sady. Odpovídá vlastnosti dcat:accessURL. Pro účely katalogů otevřených dat v ČR je hodnota této vlastnosti buďto stejná jako odkaz na stažení souboru v případě distribuce reprezentující soubor ke stažení, nebo stejná jako přístupový bod v případě distribuce reprezentující datovou službu.',
          'string',
          'url' // Přístupové URL distribuce datové sady.
        ),
    },
    // 3.4.4 Formát souboru ke stažení
    {
      // TODO: Povinná pro soubor ke stažení 0...1
      // TODO: IRI
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Formát souboru ke stažení',
          'Tato vlastnost odkazuje na typ souboru s distribucí. Odpovídá vlastnosti dct:format. Dle DCAT-AP 2.0.1 jsou hodnoty z evropského číselníku typů souboru.',
          'string',
          'fileType'
        ),
    },
    // 3.4.5 Media type souboru ke stažení
    {
      // TODO: Povinná pro soubor ke stažení 0...1
      // TODO: IRI
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Media type souboru ke stažení',
          'Tato vlastnost odkazuje na typ média distribuce tak, jak je definováno v oficiálním rejstříku typů médií spravovaném IANA [IANA-MEDIA-TYPES]. Odpovídá vlastnosti dcat:mediaType.',
          'string',
          'mediaType'
        ),
    },
    // 3.4.6 Odkaz na strojově čitelné schéma souboru ke stažení
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          'Odkaz na strojově čitelné schéma souboru ke stažení',
          'Tato vlastnost odkazuje na ustanovené schéma, jímž se popisovaná distribuce řídí. Odpovídá vlastnosti dct:conformsTo.',
          'string',
          'conformsTo' // URL schématu.
        ),
    },
    // 3.4.7 Media type kompresního formátu
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          // TODO: IRI
          'Media type použitého kompresního formátu souboru ke stažení',
          'Tato vlastnost odkazuje na media typ kompresního formátu souboru ke stažení tak, jak je definováno v oficiálním rejstříku typů médií spravovaném IANA [IANA-MEDIA-TYPES]. Kompresní formát určuje techniku použitou ke zmenšení velikosti jednoho souboru ke stažení. Odpovídá vlastnosti dcat:compressFormat.',
          'string',
          'mediaType'
        ),
    },
    // 3.4.8 Media type balíčkovacího formátu
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          // TODO: IRI
          'Media type použitého balíčkovacího formátu souboru ke stažení',
          'Tato vlastnost odkazuje na media typ balíčkovacího formátu souboru ke stažení tak, jak je definováno v oficiálním rejstříku typů médií spravovaném IANA [IANA-MEDIA-TYPES]. Balíčkovací formát určuje techniku použitou k zabalení více souborů do jednoho. Odpovídá vlastnosti dcat:packageFormat.',
          'string',
          'mediaType'
        ),
    },
    // 3.4.9 Název distribuce datové sady
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          'Název distribuce datové sady',
          'Tato vlastnost obsahuje název distribuce. Odpovídá vlastnosti dct:title.',
          'string'
        ),
    },
    // 3.4.10 Vazba: přístupová služba
    {
      // TODO: Povinná pro datovou službu
      arity: OptionalArity,
      property: DatovaSluzba
    }
  ]
)
// endregion

// region 3.3 Třída: Datová sada
const DatovaSada = new StructuredMetaProperty(
  'Datová sada',
  'Klíčová třída reprezentující poskytovanou informaci. Odpovídá třídě dcat:Dataset.',
  [
    // 3.3.1 Název
    {
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Název',
          'Tato vlastnost obsahuje název datové sady. Odpovídá vlastnosti dct:title.',
          'string'
        ),
    },
    // 3.3.2 Popis
    {
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Popis',
          'Tato vlastnost obsahuje volný text s popisem datové sady. Odpovídá vlastnosti dct:description.',
          'string'
        ),
    },
    // 3.3.3 Poskytovatel
    {
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Poskytovatel',
          'Poskytovatel datové sady. Odpovídá vlastnosti dct:publisher.',
          'string',
          'url' // IRI OVM z Registru práv a povinností (RPP).
        ),
    },
    // 3.3.4 Téma
    {
      arity: OneOrMoreArity,
      property:
        new MetaProperty(
          'Téma',
          'Tato vlastnost odkazuje na kategorii či téma datové sady. Datová sada může být popsána více tématy. Odpovídá vlastnosti dcat:theme. Dle DCAT-AP 2.0.1 musí být alespoň jedno téma z evropského číselníku datových témat.',
          'string',
          'dataTheme'
        ),
    },
    // 3.3.5 Periodicita aktualizace
    {
      arity: MandatoryArity,
      // TODO: Codebook value (IRI)
      property: new MetaProperty(
        'Periodicita aktualizace',
        'Tato vlastnost odkazuje na frekvenci, se kterou je datová sada aktualizována. Odpovídá vlastnosti dct:accrualPeriodicity. Dle DCAT-AP 2.0.1 jsou hodnoty z evropského číselníku frekvencí.',
        'string',
        'frequency'
      ),
    },
    // 3.3.6 Klíčová slova
    {
      arity: OneOrMoreArity,
      property:
        new MetaProperty(
          'Klíčová slova',
          'Tato vlastnost obsahuje klíčové slovo nebo značku popisující datovou sadu. Odpovídá vlastnosti dcat:keyword.',
          'string'
        ),
    },
    // 3.3.7 Související geografické území - prvek z RÚIAN
    {
      arity: OneOrMoreArity,
      // TODO: Codebook value (IRI)
      property:
        new MetaProperty(
          'Související geografické území - prvek z RÚIAN',
          'Tato vlastnost odkazuje na územní prvek RÚIAN pokrytý datovou sadou. Datová sada může pokrývat více územních prvků RÚIAN. Odpovídá vlastnosti dct:spatial.',
          'string',
          'spatial'
        ),
    },
    // 3.3.8 Související geografické území
    {
      arity: OneOrMoreArity,
      // TODO: Codebook value (IRI)
      property:
        new MetaProperty(
          'Související geografické území',
          'Tato vlastnost odkazuje na geografickou oblast pokrytou datovou sadou. Datová sada může být popsána více geografickými oblastmi. Odpovídá vlastnosti dct:spatial.',
          // TODO: v popise nepovinna, v scheme 1...*
          'string',
          'geographical'
        ),
    },
    // 3.3.9 Časové pokrytí
    {
      arity: OptionalArity,
      property:
        new StructuredMetaProperty(
          'Časové pokrytí',
          'Tato vlastnost odkazuje na časový úsek pokrytý datovou sadou. Odpovídá vlastnosti dct:temporal.',
          // TODO: check children
          [
            {
              arity: MandatoryArity,
              property:
                new MetaProperty('Začátek', 'Začátek časového pokrytí.', 'date'),
            },
            {
              arity: MandatoryArity,
              property:
                new MetaProperty('Konec', 'Konec časového pokrytí.', 'date')
            }
          ]
        ),
    },
    // 3.3.10 Kontaktní bod - jméno a email
    {
      arity: OptionalArity,
      property:
        new StructuredMetaProperty(
          'Kontaktní bod - jméno a email',
          'Tato vlastnost obsahuje kontaktní informace, které mohou být využity pro zasílání připomínek k datové sadě. Odpovídá vlastnosti dcat:contactPoint.',
          [
            {
              arity: MandatoryArity,
              property:
                new MetaProperty('Jméno', 'Jméno kontaktního bodu.', 'string'),
            },
            {
              arity: MandatoryArity,
              property:
                new MetaProperty('E-mail', 'E-mail kontaktního bodu.', 'string', 'email')
            }
          ]
        ),
    },
    // 3.3.11 Odkaz na dokumentaci
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          'Odkaz na dokumentaci',
          'Tato vlastnost odkazuje na stránku nebo dokument o datové sadě. Odpovídá vlastnosti foaf:page.',
          'string',
          'url' // URL webové stránky dokumentace.
        ),
    },
    // 3.3.12 Odkaz na specifikaci
    {
      arity: UnboundedArity,
      property:
        new MetaProperty(
          'Odkaz na specifikaci',
          'Tato vlastnost odkazuje na specifikaci, jíž se datová sada řídí. Takovou specifikací jsou zejména Otevřené formální normy. Odpovídá vlastnosti dct:conformsTo.',
          'string',
          'url' // URL specifikace.
        ),
    },
    // 3.3.13 Klasifikace dle EuroVoc
    {
      arity: UnboundedArity,
      property:
        new MetaProperty(
          'Klasifikace dle EuroVoc',
          'Tato vlastnost odkazuje na kategorii či téma datové sady dle EuroVoc. Datová sada může být popsána více tématy. Odpovídá vlastnosti dcat:theme.',
          'string',
          'eurovoc'
        ),
    },
    // 3.3.14 Prostorové rozlišení v metrech
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          'Prostorové rozlišení v metrech',
          'Tato vlastnost určuje prostorové rozlišení dat v datové sadě v metrech. Jedná se o nejmenší prostorový rozdíl v datové sadě. Odpovídá vlastnosti dcat:spatialResolutionInMeters.',
          'number'
        ),
    },
    // 3.3.15 Časové rozlišení
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          'Časové rozlišení',
          'Tato vlastnost určuje časové rozlišení dat v datové sadě. Jedná se o nejmenší časový rozdíl v datové sadě. Odpovídá vlastnosti dcat:temporalResolution.',
          'date' // TODO: correct type??
        ),
    },
    // 3.3.16 Vazba: Je součástí
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          // TODO: IRI
          'Je součástí',
          'Tato vlastnost odkazuje na zastřešující datovou sadu datové série, jejíž je tato datová sada součástí. Odpovídá vlastnosti dct:isPartOf.',
          'string'
        ),
    },
    // 3.3.17 Vazba: Distribuce datové sady
    {
      // TODO: Povinná, pokud se nejedná o zastřešující datovou sadu datové série, 0...*
      arity: MandatoryArity,
      property: Distribuce
    }
  ]
)
// endregion

// region 3.2 Třída: Katalog
// @ts-ignore
const Katalog = new StructuredMetaProperty(
  'Katalog',
  'Třída reprezentující datový katalog. Odpovídá třídě dcat:Catalog.',
  [
    // 3.2.1 Název
    {
      arity: MandatoryArity,
      property: new MetaProperty(
        'Název',
        'Tato vlastnost obsahuje název datového katalogu. Odpovídá vlastnosti dct:title.',
        'string'
      )
    },
    // 3.2.2 Popis
    {
      arity: MandatoryArity,
      property: new MetaProperty(
        'Popis',
        'Tato vlastnost obsahuje volný text s popisem datového katalogu. Odpovídá vlastnosti dct:description.',
        'string'
      )
    },
    // 3.2.3 Poskytovatel
    {
      arity: MandatoryArity,
      property:
        new MetaProperty(
          'Poskytovatel',
          'Poskytovatel datového katalogu. Odpovídá vlastnosti dct:publisher.',
          'string',
          'url' // IRI, OVM z Registru práv a povinností (RPP).
        ),
    },
    // 3.2.4 Kontaktní bod - jméno a email
    {
      arity: OptionalArity,
      property:
        new StructuredMetaProperty(
          'Kontaktní bod - jméno a email',
          'Tato vlastnost obsahuje kontaktní informace, které mohou být využity pro zasílání připomínek ke katalogu. Odpovídá vlastnosti dcat:contactPoint.',
          [
            {
              arity: MandatoryArity,
              property: new MetaProperty('Jméno', 'Jméno kontaktního bodu.', 'string'),
            },
            {
              arity: MandatoryArity,
              property:
                new MetaProperty('E-mail', 'E-mail kontaktního bodu.', 'string', 'email')
            }
          ]
        ),
    },
    // 3.2.5 Domovská stránka
    {
      arity: OptionalArity,
      property:
        new MetaProperty(
          'Domovská stránka',
          'Tato vlastnost odkazuje na domovskou stránku lokálního katalogu, kam mohou chodit uživatelé. Odpovídá vlastnosti foaf:homepage.',
          'string',
          'url' // URL webové stránky.
        ),
    },
    // 3.2.6 Vazba: Datová sada
    {
      arity: UnboundedArity,
      property: DatovaSada
    }
  ]
)
// endregion

const DcatApCz = new MetaFormat('DCAT-AP-CZ', DatovaSada)

export default DcatApCz
