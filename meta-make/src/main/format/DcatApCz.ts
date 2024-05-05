import MetaProperty, {ListMetaProperty, StructuredMetaProperty} from "../../common/dto/MetaProperty";
import MetaFormat from "../../common/dto/MetaFormat";

const DcatApCz = new MetaFormat(
  'DCAT-AP-CZ',
  new StructuredMetaProperty(
    '',
    '',
    []
  )
)


// region 3.2 Třída: Katalog
const Katalog = new StructuredMetaProperty(
  'Katalog',
  'Třída reprezentující datový katalog. Odpovídá třídě dcat:Catalog.',
  [
    // 3.2.1 Název
    new MetaProperty(
      'Název',
      'Tato vlastnost obsahuje název datového katalogu. Odpovídá vlastnosti dct:title.',
      true,
      'string'
    ),
    // 3.2.2 Popis
    new MetaProperty(
      'Popis',
      'Tato vlastnost obsahuje volný text s popisem datového katalogu. Odpovídá vlastnosti dct:description.',
      true,
      'string'
    ),
    // 3.2.3 Poskytovatel
    new MetaProperty(
      'Poskytovatel',
      'Poskytovatel datového katalogu. Odpovídá vlastnosti dct:publisher.',
      true,
      'string',
      'url' // IRI, OVM z Registru práv a povinností (RPP).
    ),
    // 3.2.4 Kontaktní bod - jméno a email
    new StructuredMetaProperty(
      'Kontaktní bod - jméno a email',
      'Tato vlastnost obsahuje kontaktní informace, které mohou být využity pro zasílání připomínek ke katalogu. Odpovídá vlastnosti dcat:contactPoint.',
      // TODO: non-mandatory
      // TODO: add children
      []
    ),
    // 3.2.5 Domovská stránka
    new MetaProperty(
      'Domovská stránka',
      'Tato vlastnost odkazuje na domovskou stránku lokálního katalogu, kam mohou chodit uživatelé. Odpovídá vlastnosti foaf:homepage.',
      false,
      'string',
      'url' // URL webové stránky.
    ),
    // 3.2.6 Vazba: Datová sada
    // TODO: prepojit s datovou sadou
    new StructuredMetaProperty(
      'Vazba: Datová sada',
      'Tato vlastnost odkazuje na datové sady v katalogu. Odpovídá vlastnosti dcat:dataset.',
      // TODO: add children
      []
    )
  ]
)
// endregion

// region 3.3 Třída: Datová sada
const DatovaSada = new StructuredMetaProperty(
  'Datová sada',
  'Klíčová třída reprezentující poskytovanou informaci. Odpovídá třídě dcat:Dataset.',
  [
    // 3.3.1 Název
    new MetaProperty(
      'Název',
      'Tato vlastnost obsahuje název datové sady. Odpovídá vlastnosti dct:title.',
      true,
      'string'
    ),
    // 3.3.2 Popis
    new MetaProperty(
      'Popis',
      'Tato vlastnost obsahuje volný text s popisem datové sady. Odpovídá vlastnosti dct:description.',
      true,
      'string'
    ),
    // 3.3.3 Poskytovatel
    new MetaProperty(
      'Poskytovatel',
      'Poskytovatel datové sady. Odpovídá vlastnosti dct:publisher.',
      true,
      'string',
      'url' // IRI OVM z Registru práv a povinností (RPP).
    ),
    // 3.3.4 Téma
    new ListMetaProperty(
      // TODO: mandatory 1...*, IRI
      'Téma',
      'Tato vlastnost odkazuje na kategorii či téma datové sady. Datová sada může být popsána více tématy. Odpovídá vlastnosti dcat:theme. Dle DCAT-AP 2.0.1 musí být alespoň jedno téma z evropského číselníku datových témat.',
      'string'
    ),
    // 3.3.5 Periodicita aktualizace
    new MetaProperty(
      'Periodicita aktualizace',
      'Tato vlastnost odkazuje na frekvenci, se kterou je datová sada aktualizována. Odpovídá vlastnosti dct:accrualPeriodicity. Dle DCAT-AP 2.0.1 jsou hodnoty z evropského číselníku frekvencí.',
      true,
      'string',
      'url' // IRI položky z evropského číselníku frekvencí
    ),
    // 3.3.6 Klíčová slova
    new ListMetaProperty(
      // TODO: mandatory 1...*, IRI
      'Klíčová slova',
      'Tato vlastnost obsahuje klíčové slovo nebo značku popisující datovou sadu. Odpovídá vlastnosti dcat:keyword.',
      'string'
    ),
    // 3.3.7 Související geografické území - prvek z RÚIAN
    new ListMetaProperty(
      // TODO: mandatory 1...*, IRI
      'Související geografické území - prvek z RÚIAN',
      'Tato vlastnost odkazuje na územní prvek RÚIAN pokrytý datovou sadou. Datová sada může pokrývat více územních prvků RÚIAN. Odpovídá vlastnosti dct:spatial.',
      'string'
    ),
    // 3.3.8 Související geografické území
    new ListMetaProperty(
      // TODO: mandatory 1...*, IRI
      'Související geografické území',
      'Tato vlastnost odkazuje na geografickou oblast pokrytou datovou sadou. Datová sada může být popsána více geografickými oblastmi. Odpovídá vlastnosti dct:spatial.',
      'string'
    ),
    // 3.3.9 Časové pokrytí
    new StructuredMetaProperty(
      'Časové pokrytí',
      'Tato vlastnost odkazuje na časový úsek pokrytý datovou sadou. Odpovídá vlastnosti dct:temporal.',
      // TODO: non-mandatory
      // TODO: check children
      [
        new MetaProperty(
          'Začátek',
          'Začátek časového pokrytí.',
          true,
          'date'
        ),
        new MetaProperty(
          'Konec',
          'Konec časového pokrytí.',
          true,
          'date'
        )
      ]
    ),
    // 3.3.10 Kontaktní bod - jméno a email
    new StructuredMetaProperty(
      'Kontaktní bod - jméno a email',
      'Tato vlastnost obsahuje kontaktní informace, které mohou být využity pro zasílání připomínek k datové sadě. Odpovídá vlastnosti dcat:contactPoint.',
      // TODO: non-mandatory
      // TODO: check children
      [
        new MetaProperty(
          'Jméno',
          'Jméno kontaktního bodu.',
          true,
          'string'
        ),
        new MetaProperty(
          'E-mail',
          'E-mail kontaktního bodu.',
          true,
          'string',
          'email'
        ),
      ]
    ),
    // 3.3.11 Odkaz na dokumentaci
    new MetaProperty(
      'Odkaz na dokumentaci',
      'Tato vlastnost odkazuje na stránku nebo dokument o datové sadě. Odpovídá vlastnosti foaf:page.',
      false,
      'string',
      'url' // URL webové stránky dokumentace.
    ),
    // 3.3.12 Odkaz na specifikaci
    // TODO: change to ListMetaProperty?
    new MetaProperty(
      'Odkaz na specifikaci',
      'Tato vlastnost odkazuje na specifikaci, jíž se datová sada řídí. Takovou specifikací jsou zejména Otevřené formální normy. Odpovídá vlastnosti dct:conformsTo.',
      false,
      'string',
      'url' // URL specifikace.
    ),
    // 3.3.13 Klasifikace dle EuroVoc
    new ListMetaProperty(
      // TODO: non-mandatory - 0...*, IRI
      'Klasifikace dle EuroVoc',
      'Tato vlastnost odkazuje na kategorii či téma datové sady dle EuroVoc. Datová sada může být popsána více tématy. Odpovídá vlastnosti dcat:theme.',
      'string'
    ),
    // 3.3.14 Prostorové rozlišení v metrech
    new MetaProperty(
      'Prostorové rozlišení v metrech',
      'Tato vlastnost určuje prostorové rozlišení dat v datové sadě v metrech. Jedná se o nejmenší prostorový rozdíl v datové sadě. Odpovídá vlastnosti dcat:spatialResolutionInMeters.',
      false,
      'number'
    ),
    // 3.3.15 Časové rozlišení
    new MetaProperty(
      'Časové rozlišení',
      'Tato vlastnost určuje časové rozlišení dat v datové sadě. Jedná se o nejmenší časový rozdíl v datové sadě. Odpovídá vlastnosti dcat:temporalResolution.',
      false,
      'date' // TODO: correct type??
    ),
    // 3.3.16 Vazba: Je součástí
    new ListMetaProperty(
      // TODO: non-mandatory, 0...*, IRI
      'Je součástí',
      'Tato vlastnost odkazuje na zastřešující datovou sadu datové série, jejíž je tato datová sada součástí. Odpovídá vlastnosti dct:isPartOf.',
      'string'
    ),
    // 3.3.17 Vazba: Distribuce datové sady
    // TODO: Povinná, pokud se nejedná o zastřešující datovou sadu datové série - 0...*
    // TODO: prepojit s Distribuce datové sady
    // TODO: list of StructuredMetaProperty?
    new StructuredMetaProperty(
      'Distribuce datové sady',
      'Tato vlastnost odkazuje z datové sady na její distribuci. Odpovídá vlastnosti dcat:distribution.',
      // TODO: Povinná, pokud se nejedná o zastřešující datovou sadu datové série.
      // TODO: add children
      []
    )
  ]
)
// endregion

// region 3.4 Třída: Distribuce datové sady
const distribuceDatoveSady = new StructuredMetaProperty(
  'Distribuce datové sady',
  'Fyzická podoba datové sady v konkrétním formátu nebo jako konkrétní služba, nikdy obojí. Odpovídá třídě dcat:Distribution.',
  [
    // 3.4.1 Specifikace podmínek užití
    new StructuredMetaProperty(
      'Specifikace podmínek užití',
      'Tato vlastnost odkazuje na strukturovaný popis podmínek užití této distribuce datové sady. Hodnoty se řídí návodem na stanovení podmínek užití.',
      // TODO: add children
      [
        new MetaProperty(
          'Podmínky užití autorského díla',
          'Podmínky užití autorského díla.',
          true,
          'string'
        ),
        new MetaProperty(
          'Autor díla',
          'Autor díla.',
          true,
          'string'
        ),
        new MetaProperty(
          'Podmínky užití databáze jako autorského díla',
          'Podmínky užití databáze jako autorského díla.',
          true,
          'string'
        ),
        new MetaProperty(
          'Autor databáze',
          'Autor databáze.',
          true,
          'string'
        ),
        new MetaProperty(
          'Podmínky užití databáze chráněné zvláštními právy',
          'Podmínky užití databáze chráněné zvláštními právy.',
          true,
          'string'
        ),
        new MetaProperty(
          'Přítomnost osobích údajů',
          'Přítomnost osobích údajů.',
          true,
          'string'
        ),
      ]
    ),
    // 3.4.2 Odkaz na stažení souboru
    new MetaProperty(
      'Odkaz na stažení souboru',
      'Tato vlastnost obsahuje URL, které je přímým odkazem na stažitelný soubor v daném formátu. Odpovídá vlastnosti dcat:downloadURL.',
      true, // Povinná pro soubor ke stažení
      'string',
      'url' // URL souboru ke stažení.
    ),
    // 3.4.3 Přístupové URL
    // TODO: StructuredMetaProperty?? lebo moze odkazovat na jednu Datovu sluzbu
    new MetaProperty(
      'Přístupové URL',
      'Tato vlastnost obsahuje URL, pomocí kterého se lze dostat k distribuci datové sady. Odpovídá vlastnosti dcat:accessURL. Pro účely katalogů otevřených dat v ČR je hodnota této vlastnosti buďto stejná jako odkaz na stažení souboru v případě distribuce reprezentující soubor ke stažení, nebo stejná jako přístupový bod v případě distribuce reprezentující datovou službu.',
      true,
      'string',
      'url' // Přístupové URL distribuce datové sady.
    ),
    // 3.4.4 Formát souboru ke stažení
    new MetaProperty(
      // TODO: 0...1, IRI
      'Formát souboru ke stažení',
      'Tato vlastnost odkazuje na typ souboru s distribucí. Odpovídá vlastnosti dct:format. Dle DCAT-AP 2.0.1 jsou hodnoty z evropského číselníku typů souboru.',
      true, // Povinná pro soubor ke stažení
      'string'
    ),
    // 3.4.5 Media type souboru ke stažení
    new MetaProperty(
      // TODO: 0...1, IRI
      'Media type souboru ke stažení',
      'Tato vlastnost odkazuje na typ média distribuce tak, jak je definováno v oficiálním rejstříku typů médií spravovaném IANA [IANA-MEDIA-TYPES]. Odpovídá vlastnosti dcat:mediaType.',
      true, // Povinná pro soubor ke stažení
      'string'
    ),
    // 3.4.6 Odkaz na strojově čitelné schéma souboru ke stažení
    new MetaProperty(
      'Odkaz na strojově čitelné schéma souboru ke stažení',
      'Tato vlastnost odkazuje na ustanovené schéma, jímž se popisovaná distribuce řídí. Odpovídá vlastnosti dct:conformsTo.',
      false,
      'string',
      'url' // URL schématu.
    ),
    // 3.4.7 Media type kompresního formátu
    new MetaProperty(
      // TODO: IRI
      'Media type použitého kompresního formátu souboru ke stažení',
      'Tato vlastnost odkazuje na media typ kompresního formátu souboru ke stažení tak, jak je definováno v oficiálním rejstříku typů médií spravovaném IANA [IANA-MEDIA-TYPES]. Kompresní formát určuje techniku použitou ke zmenšení velikosti jednoho souboru ke stažení. Odpovídá vlastnosti dcat:compressFormat.',
      false,
      'string'
    ),
    // 3.4.8 Media type balíčkovacího formátu
    new MetaProperty(
      // TODO: IRI
      'Media type použitého balíčkovacího formátu souboru ke stažení',
      'Tato vlastnost odkazuje na media typ balíčkovacího formátu souboru ke stažení tak, jak je definováno v oficiálním rejstříku typů médií spravovaném IANA [IANA-MEDIA-TYPES]. Balíčkovací formát určuje techniku použitou k zabalení více souborů do jednoho. Odpovídá vlastnosti dcat:packageFormat.',
      false,
      'string'
    ),
    // 3.4.9 Název distribuce datové sady
    new MetaProperty(
      'Název distribuce datové sady',
      'Tato vlastnost obsahuje název distribuce. Odpovídá vlastnosti dct:title.',
      false,
      'string'
    ),
    // 3.4.10 Vazba: přístupová služba
    // TODO: prepojit s datovou sluzbou
    new StructuredMetaProperty(
      'Přístupová služba',
      'Datová služba zpřístupňující distribuci datové sady. Odpovídá vlastnosti dcat:accessService.',
      // TODO: Povinná pro datovou službu
      // TODO: add children
      []
    )
  ]
)
// endregion

// region 3.5 Třída: Datová služba
const datovaSluzba = new StructuredMetaProperty(
  'Datová služba',
  'Třída reprezentující datovou službu zpřístupňující data datové sady. Odpovídá třídě dcat:DataService.',
  [
    // 3.5.1 Název
    new MetaProperty(
      'Název',
      'Tato vlastnost obsahuje název datové služby. Odpovídá vlastnosti dct:title.',
      true,
      'string'
    ),
    // 3.5.2 Přístupový bod
    new MetaProperty(
      'Přístupový bod',
      'Tato vlastnost obsahuje URL přístupového bodu datové služby. Odpovídá vlastnosti dcat:endpointURL.',
      true,
      'string',
      'url'
    ),
    // 3.5.3 Odkaz na specifikaci
    new MetaProperty(
      'Odkaz na specifikaci',
      'Tato vlastnost odkazuje na specifikaci, jíž se datová služba řídí. Takovou specifikací je například SPARQL. Seznam možných hodnot lze nalézt například v seznamu udržovaném Open Source Geospatial Foundation. Odpovídá vlastnosti dct:conformsTo.',
      false,
      'string',
      'url' // URL specifikace.
    ),
    // 3.5.4 Popis přístupového bodu
    new MetaProperty(
      'Popis přístupového bodu',
      'Tato vlastnost obsahuje URL popisu přístupového bodu datové služby. Odpovídá vlastnosti dcat:endpointDescription.',
      false,
      'string',
      'url'
    )
  ]
)
// endregion

export default DcatApCz;
