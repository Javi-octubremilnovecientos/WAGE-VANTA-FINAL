# Dynamic Options — Carga Progresiva de ComboBox

## Diagrama de Flujo — Lógica completa de useDynamicOptions

```mermaid
graph TD
    A([DynamicComboField montado\nfieldId = Occupation]) --> B[useDynamicOptions - fieldId]
    B --> C[selectIsFieldEnabled\nsalarySelectors]
    C --> D{Todos los campos\nanteriores con valor?}
    D -- No --> E[isEnabled = false]
    E --> F[StandardComboBox disabled\nopacity-50 pointer-events-none]
    F --> G([Espera cambio en formValues])
    G --> C

    D -- Sí --> H[isEnabled = true]
    H --> I[Construir filterValues\nuseMemo]
    I --> J{Country presente\nen filterValues?}
    J -- No --> K[filterValues = null\nshouldSkip = true]
    K --> F

    J -- Sí --> L[shouldSkip = false\nuseGetFilteredOptionsQuery]
    L --> M{¿Resultado en caché\nRTK Query?}
    M -- Sí, hit --> N[records del caché\nsin HTTP request]
    M -- No, miss --> O[HTTP GET\nfunctions/v1/get-filtered-options]

    O --> P[(Edge Function\nget-filtered-options)]
    P --> Q{Validaciones\nen servidor}
    Q -- country inválido --> R[400 Bad Request]
    Q -- targetFields inválidos --> S[400 Bad Request]
    Q -- OK --> T[Construir query PostgREST\nTABLE_0 con filtros]
    T --> U[(Supabase DB\nTABLE_0)]
    U --> V[SalaryRecord Array\nsolo columna pedida]
    V --> W[Response 200 JSON]
    W --> N

    N --> X[useEffect detecta\nrecords disponibles]
    X --> Y[extractUniqueOptions\nrecords, fieldId]
    Y --> Z[Set para deduplicar\n+ sort alfabético]
    Z --> AA[dispatch setAvailableOptions\nfieldId, options]
    AA --> AB[dispatch setLoadingOptions\nfieldId, false]
    AB --> AC[StandardComboBox habilitado\ncon opciones reales]

    R --> AD([Error: campo sin opciones])
    S --> AD

    style A fill:#374151,stroke:#fff,color:#fff
    style B fill:#7c3aed,stroke:#fff,color:#fff
    style C fill:#0369a1,stroke:#fff,color:#fff
    style D fill:#f59e0b,stroke:#fff,color:#fff
    style E fill:#dc2626,stroke:#fff,color:#fff
    style F fill:#dc2626,stroke:#fff,color:#fff
    style H fill:#15803d,stroke:#fff,color:#fff
    style I fill:#7c3aed,stroke:#fff,color:#fff
    style J fill:#f59e0b,stroke:#fff,color:#fff
    style K fill:#dc2626,stroke:#fff,color:#fff
    style L fill:#ea580c,stroke:#fff,color:#fff
    style M fill:#f59e0b,stroke:#fff,color:#fff
    style N fill:#16a34a,stroke:#fff,color:#fff
    style O fill:#3b82f6,stroke:#fff,color:#fff
    style P fill:#3b82f6,stroke:#fff,color:#fff
    style Q fill:#f59e0b,stroke:#fff,color:#fff
    style R fill:#dc2626,stroke:#fff,color:#fff
    style S fill:#dc2626,stroke:#fff,color:#fff
    style T fill:#3b82f6,stroke:#fff,color:#fff
    style U fill:#1e3a8a,stroke:#fff,color:#fff
    style V fill:#3b82f6,stroke:#fff,color:#fff
    style W fill:#16a34a,stroke:#fff,color:#fff
    style X fill:#ea580c,stroke:#fff,color:#fff
    style Y fill:#ea580c,stroke:#fff,color:#fff
    style Z fill:#ea580c,stroke:#fff,color:#fff
    style AA fill:#ea580c,stroke:#fff,color:#fff
    style AB fill:#ea580c,stroke:#fff,color:#fff
    style AC fill:#16a34a,stroke:#fff,color:#fff
    style AD fill:#dc2626,stroke:#fff,color:#fff
    style G fill:#374151,stroke:#fff,color:#fff
```

## Diagrama de Flujo — Cascade al cambiar un campo

```mermaid
graph TD
    A([Usuario cambia Economic Activity\n= Manufacturing]) --> B[handleFieldChange\nFormLayout]
    B --> C[dispatch updateFormValue\nEconomic Activity = Manufacturing]
    C --> D[dispatch clearDownstreamData\nEconomic Activity]

    D --> E[Iterar DYNAMIC_FIELDS_ORDER\ndesde idx+1 hasta el final]
    E --> F[delete formValues.Occupation]
    E --> G[delete formValues.Occupation Level]
    E --> H[delete formValues.Education Level]
    E --> I[delete availableOptions.Occupation]
    E --> J[delete availableOptions.Occupation Level]
    E --> K[delete availableOptions.Education Level]
    E --> L[delete loadingOptions.*]

    F --> M[selectIsFieldEnabled re-evalúa\npara cada campo posterior]
    G --> M
    H --> M

    M --> N{Occupation habilitado?}
    N -- No: Occupation Level sin valor --> O[isEnabled = false\nshouldSkip = true]
    O --> P[Query cancelada\nStandardComboBox disabled]

    N -- Sí: depende solo de campos anteriores --> Q[isEnabled = true\nnuevo filterValues construido]
    Q --> R[Nueva query con\nEconomic Activity = Manufacturing]
    R --> S[Nuevas opciones de Occupation\npara Manufacturing]
    S --> T[dispatch setAvailableOptions\nOccupation con nuevos valores]
    T --> U[StandardComboBox Occupation\nhabilitado con opciones frescas]

    style A fill:#374151,stroke:#fff,color:#fff
    style B fill:#7c3aed,stroke:#fff,color:#fff
    style C fill:#ea580c,stroke:#fff,color:#fff
    style D fill:#dc2626,stroke:#fff,color:#fff
    style E fill:#dc2626,stroke:#fff,color:#fff
    style F fill:#dc2626,stroke:#fff,color:#fff
    style G fill:#dc2626,stroke:#fff,color:#fff
    style H fill:#dc2626,stroke:#fff,color:#fff
    style I fill:#dc2626,stroke:#fff,color:#fff
    style J fill:#dc2626,stroke:#fff,color:#fff
    style K fill:#dc2626,stroke:#fff,color:#fff
    style L fill:#dc2626,stroke:#fff,color:#fff
    style M fill:#0369a1,stroke:#fff,color:#fff
    style N fill:#f59e0b,stroke:#fff,color:#fff
    style O fill:#dc2626,stroke:#fff,color:#fff
    style P fill:#dc2626,stroke:#fff,color:#fff
    style Q fill:#15803d,stroke:#fff,color:#fff
    style R fill:#3b82f6,stroke:#fff,color:#fff
    style S fill:#3b82f6,stroke:#fff,color:#fff
    style T fill:#ea580c,stroke:#fff,color:#fff
    style U fill:#16a34a,stroke:#fff,color:#fff
```

## Diagrama de Secuencia — Carga progresiva completa Step 2

```mermaid
%%{init: {'theme':'dark', 'themeVariables': {
  'actorBkg':'#1e3a8a',
  'actorBorder':'#60a5fa',
  'actorTextColor':'#ffffff',
  'actorLineColor':'#6b7280',
  'signalColor':'#9ca3af',
  'signalTextColor':'#e5e7eb',
  'labelBoxBkgColor':'#374151',
  'labelBoxBorderColor':'#6b7280',
  'labelTextColor':'#ffffff',
  'loopTextColor':'#ffffff',
  'noteBkgColor':'#78350f',
  'noteTextColor':'#fef3c7',
  'noteBorderColor':'#f59e0b',
  'activationBkgColor':'#1e3a5f',
  'activationBorderColor':'#3b82f6'
}}}%%
sequenceDiagram
    actor User as Usuario
    participant FL as FormLayout
    participant DC_EA as DynamicComboField<br/>Economic Activity
    participant DC_OC as DynamicComboField<br/>Occupation
    participant DO as useDynamicOptions
    participant SEL as selectIsFieldEnabled
    participant RTK as RTK Query Cache
    participant EF as Edge Function<br/>get-filtered-options
    participant DB as Supabase TABLE_0
    participant RS as salarySlice

    User->>FL: Llega a Step 2
    FL->>DC_EA: render(fieldId=Economic Activity)
    DC_EA->>DO: useDynamicOptions(Economic Activity)
    DO->>SEL: isEnabled? Country+Gender tienen valor
    SEL-->>DO: true
    DO->>DO: filterValues = {Country, Gender}
    DO->>RTK: getFilteredOptions(country, formValues, [Economic Activity])
    RTK->>EF: GET ?country=Spain&formValues=...&targetFields=["Economic Activity"]
    EF->>EF: Valida country, targetFields
    EF->>EF: Construye params:<br/>Country=eq.Spain&Gender=eq.Male&select=Economic Activity
    EF->>DB: PostgREST query TABLE_0
    DB-->>EF: [{Economic Activity: Manufacturing}, {Economic Activity: Finance}, ...]
    EF-->>RTK: SalaryRecord[]
    RTK-->>DO: records
    DO->>DO: extractUniqueOptions → ["Finance","Manufacturing",...]
    DO->>RS: dispatch setAvailableOptions(Economic Activity, [...])
    DO->>RS: dispatch setLoadingOptions(Economic Activity, false)
    DC_EA-->>FL: StandardComboBox con opciones

    FL->>DC_OC: render(fieldId=Occupation)
    DC_OC->>DO: useDynamicOptions(Occupation)
    DO->>SEL: isEnabled? Economic Activity vacío
    SEL-->>DO: false
    DO-->>DC_OC: isEnabled=false
    DC_OC-->>FL: StandardComboBox disabled

    User->>FL: Selecciona Economic Activity = Manufacturing
    FL->>RS: dispatch updateFormValue(Economic Activity, Manufacturing)
    FL->>RS: dispatch clearDownstreamData(Economic Activity)
    Note over RS: Borra Occupation, Occupation Level,<br/>Education Level del store

    DC_OC->>DO: useDynamicOptions(Occupation) re-evalúa
    DO->>SEL: isEnabled? Country+Gender+Economic Activity tienen valor
    SEL-->>DO: true
    DO->>DO: filterValues = {Country, Gender, Economic Activity}
    DO->>RTK: getFilteredOptions con nuevo filterValues
    RTK->>EF: GET ?...formValues={"Country":"Spain","Gender":"Male","Economic Activity":"Manufacturing"}...
    EF->>DB: PostgREST con filtros Country+Gender+Economic Activity
    DB-->>EF: [{Occupation: Engineer}, {Occupation: Analyst}, ...]
    EF-->>RTK: SalaryRecord[]
    RTK-->>DO: records
    DO->>DO: extractUniqueOptions → ["Analyst","Engineer",...]
    DO->>RS: dispatch setAvailableOptions(Occupation, [...])
    DC_OC-->>FL: StandardComboBox Occupation habilitado

    User->>FL: Selecciona Occupation = Engineer
    FL->>RS: dispatch updateFormValue + clearDownstreamData(Occupation)
    Note over DC_OC: Mismo proceso para Occupation Level<br/>con filterValues = {Country, Gender,<br/>Economic Activity, Occupation}
```

## Diagrama de Estados — Ciclo de vida de un campo dinámico

```mermaid
stateDiagram-v2
    [*] --> Deshabilitado

    Deshabilitado --> EvaluandoDependencias: formValues cambia en Redux

    EvaluandoDependencias --> Deshabilitado: algún campo previo sin valor
    EvaluandoDependencias --> CargandoOpciones: todos los campos previos con valor

    CargandoOpciones --> MostrandoSkeleton: isLoading=true\nStandardComboBox loading prop
    MostrandoSkeleton --> OpcionesDisponibles: Edge Function responde\nextractUniqueOptions completo
    MostrandoSkeleton --> ErrorSinOpciones: Edge Function falla

    OpcionesDisponibles --> EsperandoSeleccion: StandardComboBox habilitado
    EsperandoSeleccion --> SeleccionConfirmada: usuario selecciona opción
    SeleccionConfirmada --> CascadeLimpieza: dispatch clearDownstreamData

    CascadeLimpieza --> Deshabilitado: campos posteriores reseteados

    ErrorSinOpciones --> Deshabilitado: re-intento posible

    note right of CargandoOpciones
        shouldSkip = false
        useGetFilteredOptionsQuery activo
        filterValues construido
    end note

    note right of OpcionesDisponibles
        availableOptions en Redux
        loadingOptions = false
        opciones deduplicadas y ordenadas
    end note

    note right of CascadeLimpieza
        delete formValues downstream
        delete availableOptions downstream
        delete loadingOptions downstream
    end note

    classDef disabledState fill:#dc2626,stroke:#fff,color:#fff
    classDef loadingState fill:#f59e0b,stroke:#fff,color:#fff
    classDef readyState fill:#15803d,stroke:#fff,color:#fff
    classDef activeState fill:#16a34a,stroke:#fff,color:#fff
    classDef processState fill:#ea580c,stroke:#fff,color:#fff
    classDef evalState fill:#0369a1,stroke:#fff,color:#fff
    classDef errorState fill:#7f1d1d,stroke:#fff,color:#fff

    class Deshabilitado disabledState
    class EvaluandoDependencias evalState
    class CargandoOpciones loadingState
    class MostrandoSkeleton loadingState
    class OpcionesDisponibles readyState
    class EsperandoSeleccion activeState
    class SeleccionConfirmada activeState
    class CascadeLimpieza processState
    class ErrorSinOpciones errorState
```

## Diagrama de Clases — Arquitectura de carga dinámica

```mermaid
classDiagram
    class DynamicComboField {
        +fieldId: FormFieldId
        +value: string
        +placeholder: string
        +onChange(value) void
        -options: string[]
        -isLoading: boolean
        -isEnabled: boolean
    }

    class UseDynamicOptions {
        +fieldId: FormFieldId
        +options: string[]
        +isLoading: boolean
        +isEnabled: boolean
        +error: string|null
        -filterValues: ComparisonFormValues|null
        -shouldSkip: boolean
        -isDynamicField: boolean
        -cachedOptions: string[]
    }

    class SelectIsFieldEnabled {
        +fieldId: FormFieldId
        +formValues: ComparisonFormValues
        -fieldIndex: number
        +evaluate() boolean
    }

    class GetFilteredOptionsQuery {
        +country: string
        +formValues: ComparisonFormValues
        +targetFields: string[]
        +skip: boolean
        +data: SalaryRecord[]
        +isLoading: boolean
        +isFetching: boolean
    }

    class EdgeFunctionGetFilteredOptions {
        -TABLE_NAME: TABLE_0
        -EQ_FIELDS: Set Gender
        -ILIKE_FIELDS: Set Occupation Occupation_Level Economic_Activity Education_Level
        -EXCLUDED_FIELDS: Set Country Monthly_Wage Years_Of_Experience Company_Size
        -VALID_COUNTRIES: Set 11 countries
        -ALLOWED_COLUMNS: Set 8 columns
        +buildPostgRESTQuery(params) URLSearchParams
        +validateCountry(country) boolean
        +validateTargetFields(fields) string[]
    }

    class SalarySlice {
        +availableOptions: Record~fieldId, string[]~
        +loadingOptions: Record~fieldId, boolean~
        +formValues: ComparisonFormValues
        +setAvailableOptions(fieldId, options) void
        +setLoadingOptions(fieldId, loading) void
        +clearDownstreamData(fromFieldId) void
    }

    class SalaryConstants {
        +DYNAMIC_FIELDS_ORDER: FormFieldId[]
        +DYNAMIC_API_FIELDS: Set~FormFieldId~
        +STATIC_FIELDS: Set~FormFieldId~
    }

    class ExtractUniqueOptions {
        +records: SalaryRecord[]
        +fieldId: keyof SalaryRecord
        +uniqueSet: Set~string~
        +extract() string[]
    }

    DynamicComboField --> UseDynamicOptions : usa hook
    UseDynamicOptions --> SelectIsFieldEnabled : useAppSelector
    UseDynamicOptions --> GetFilteredOptionsQuery : useGetFilteredOptionsQuery
    UseDynamicOptions --> SalarySlice : dispatch setAvailableOptions\nsetLoadingOptions
    UseDynamicOptions --> ExtractUniqueOptions : procesa records
    UseDynamicOptions --> SalaryConstants : DYNAMIC_FIELDS_ORDER\nDYNAMIC_API_FIELDS
    GetFilteredOptionsQuery --> EdgeFunctionGetFilteredOptions : HTTP GET
    SelectIsFieldEnabled --> SalaryConstants : DYNAMIC_FIELDS_ORDER\nSTATIC_FIELDS
    SelectIsFieldEnabled --> SalarySlice : lee formValues

    style DynamicComboField fill:#7c3aed,stroke:#fff,color:#fff
    style UseDynamicOptions fill:#7c3aed,stroke:#fff,color:#fff
    style SelectIsFieldEnabled fill:#0369a1,stroke:#fff,color:#fff
    style GetFilteredOptionsQuery fill:#ea580c,stroke:#fff,color:#fff
    style EdgeFunctionGetFilteredOptions fill:#3b82f6,stroke:#fff,color:#fff
    style SalarySlice fill:#ea580c,stroke:#fff,color:#fff
    style SalaryConstants fill:#374151,stroke:#fff,color:#fff
    style ExtractUniqueOptions fill:#15803d,stroke:#fff,color:#fff
```

## Diagrama ER — Relación entre filtros y opciones generadas

```mermaid
%%{init: {'theme':'dark', 'themeVariables': {
  'primaryColor':'#1e3a8a',
  'primaryTextColor':'#ffffff',
  'primaryBorderColor':'#60a5fa',
  'lineColor':'#9ca3af',
  'secondaryColor':'#374151',
  'tertiaryColor':'#1e3a8a',
  'edgeLabelBackground':'#1f2937',
  'attributeBackgroundColorEven':'#1f2937',
  'attributeBackgroundColorOdd':'#111827'
}}}%%
erDiagram
    DYNAMIC_FIELDS_ORDER {
        int idx_0_Country
        int idx_1_Gender
        int idx_2_Economic_Activity
        int idx_3_Occupation
        int idx_4_Occupation_Level
        int idx_5_Education_Level
    }

    FORM_VALUES {
        string Country
        string Gender
        string Economic_Activity
        string Occupation
        string Occupation_Level
        string Education_Level
    }

    FILTER_QUERY {
        string country
        object formValues
        array targetFields
    }

    SALARY_RECORD {
        string Country
        string Gender
        string Occupation
        string Occupation_Level
        string Economic_Activity
        string Education_Level
        number Monthly_Wage
    }

    AVAILABLE_OPTIONS {
        string fieldId
        array uniqueOptions
        boolean loading
    }

    POSTGREST_PARAMS {
        string Country_eq
        string Gender_eq
        string Economic_Activity_ilike
        string Occupation_ilike
        string select_columns
    }

    FORM_VALUES ||--|| FILTER_QUERY : alimenta
    FILTER_QUERY ||--|| POSTGREST_PARAMS : construye_en_Edge_Function
    POSTGREST_PARAMS ||--o{ SALARY_RECORD : filtra_TABLE_0
    SALARY_RECORD ||--|| AVAILABLE_OPTIONS : extractUniqueOptions
    AVAILABLE_OPTIONS ||--|| FORM_VALUES : habilita_campo_siguiente
    DYNAMIC_FIELDS_ORDER ||--|| FORM_VALUES : define_dependencias
```

## Mapa Mental — Sistema completo de opciones dinámicas

```mermaid
%%{init: {'theme':'dark', 'themeVariables': {
  'primaryColor':'#1e3a8a',
  'primaryTextColor':'#ffffff',
  'primaryBorderColor':'#60a5fa',
  'lineColor':'#6b7280'
}}}%%
mindmap
  root((Dynamic Options\nCarga Progresiva))
    Componentes UI
      DynamicComboField
        Componente wrapper
        Permite hook fuera de .map
        Delega render a StandardComboBox
      StandardComboBox
        disabled si isEnabled=false
        loading skeleton si isLoading
        Opciones desde availableOptions Redux
    Hook useDynamicOptions
      Paso 1 - Habilitación
        selectIsFieldEnabled
        Itera DYNAMIC_FIELDS_ORDER
        Todos los anteriores con valor
      Paso 2 - filterValues
        useMemo
        Recoge campos previos con valor
        Country obligatorio
      Paso 3 - RTK Query
        useGetFilteredOptionsQuery
        skip si shouldSkip=true
        Cache automático por params
      Paso 4 - useEffect
        Detecta records disponibles
        extractUniqueOptions
        dispatch setAvailableOptions
        dispatch setLoadingOptions
    Cascade al cambiar campo
      clearDownstreamData
        DYNAMIC_FIELDS_ORDER idx+1 en adelante
        delete formValues
        delete availableOptions
        delete loadingOptions
      Todos los posteriores
        isEnabled → false
        shouldSkip → true
        Re-evalúan al recibir valor
    Edge Function
      get-filtered-options
        Proxy server-side
        service_role_key segura
        Validaciones
          VALID_COUNTRIES whitelist
          ALLOWED_COLUMNS whitelist
          EXCLUDED_FIELDS ignorados
        Tipos de filtro
          EQ Gender
          ILIKE Economic Activity, Occupation, etc
        select solo columna pedida
    salaryConstants.ts
      DYNAMIC_FIELDS_ORDER
        Define cadena de dependencias
      DYNAMIC_API_FIELDS
        Set de campos con carga API
      STATIC_FIELDS
        Siempre habilitados
    salarySlice.ts
      availableOptions por fieldId
      loadingOptions por fieldId
      clearDownstreamData acción
    salaryUtils.ts
      extractUniqueOptions
        Itera SalaryRecord
        Set deduplicación
        sort alfabético
```
