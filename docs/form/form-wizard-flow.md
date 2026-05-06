# Form Wizard Flow (Step 1 → 3) — Diagramas

## Diagrama de Flujo

```mermaid
graph TD
    A([Usuario llega al FormLayout]) --> B[StepSlider muestra progreso\ncurrentStep desde Redux]
    B --> C{currentStep}

    C -- 0 --> D[Step 1: Country · Gender · Monthly Wage]
    C -- 1 --> E[Step 2: Economic Activity · Occupation · Occupation Level]
    C -- 2 --> F[Step 3: Education Level · Years of Experience · Company Size]

    D --> G{field.type}
    G -- select con options estáticas --> H[StandardComboBox\nopciones hardcodeadas]
    G -- number --> I[NumberInput\ncommit diferido en blur/Enter]

    H --> J[handleFieldChange - fieldId · value]
    I --> K{¿commit o keystroke?}
    K -- keystroke --> L[onInputChange → editingValues local]
    K -- blur / Enter --> J

    J --> M[dispatch updateFormValue]
    M --> N{fieldId === Country?}
    N -- Sí --> O[dispatch setPrimaryCountry\n+ dispatch clearDownstreamData]
    N -- No --> P[valor guardado en formValues]
    O --> P

    P --> Q{isNextDisabled?}
    Q -- algún required vacío --> R[Botón Next deshabilitado]
    Q -- todos completos --> S[Botón Next habilitado]

    S --> T[Usuario pulsa Next]
    T --> U[handleNext: blur NumberInput\n+ dispatch setCurrentStep +1\n+ setEditingValues vacío]
    U --> E

    E --> V{field.options.length === 0?}
    V -- Sí --> W[DynamicComboField\nuseDynamicOptions fieldId]
    V -- No --> H

    W --> X{isEnabled?\nselectIsFieldEnabled}
    X -- No --> Y[StandardComboBox disabled\n+ skeleton si loading]
    X -- Sí --> Z[useGetFilteredOptionsQuery\n→ Edge Function get-filtered-options]

    Z --> AA[SalaryRecord Array]
    AA --> AB[extractUniqueOptions\nopciones únicas ordenadas]
    AB --> AC[dispatch setAvailableOptions\ndispatch setLoadingOptions false]
    AC --> AD[StandardComboBox con opciones reales]

    AD --> AE[Usuario selecciona opción]
    AE --> AF[handleFieldChange]
    AF --> AG[dispatch updateFormValue\n+ dispatch clearDownstreamData]
    AG --> AH{Campos posteriores\nlimpios → se re-evalúan]

    F --> AI{isLastStep}
    AI -- Sí --> AJ[Mostrar botón Save as template]
    AJ --> AK{isAuthenticated?}
    AK -- No --> AL[AuthModal login]
    AK -- Sí --> AM{canSaveTemplate?}
    AM -- No --> AN[UpgradeModal]
    AM -- Sí --> AO[TemplateModal save]

    AI -- Sí --> AP[Botón submit Go to comparison sheet]
    AP --> AQ[handleSubmit → onNavigateToSheet]

    style A fill:#374151,stroke:#fff,color:#fff
    style D fill:#1e3a8a,stroke:#fff,color:#fff
    style E fill:#1e3a8a,stroke:#fff,color:#fff
    style F fill:#1e3a8a,stroke:#fff,color:#fff
    style H fill:#15803d,stroke:#fff,color:#fff
    style I fill:#15803d,stroke:#fff,color:#fff
    style J fill:#ea580c,stroke:#fff,color:#fff
    style M fill:#ea580c,stroke:#fff,color:#fff
    style O fill:#dc2626,stroke:#fff,color:#fff
    style P fill:#ea580c,stroke:#fff,color:#fff
    style R fill:#dc2626,stroke:#fff,color:#fff
    style S fill:#16a34a,stroke:#fff,color:#fff
    style T fill:#374151,stroke:#fff,color:#fff
    style U fill:#ea580c,stroke:#fff,color:#fff
    style W fill:#7c3aed,stroke:#fff,color:#fff
    style X fill:#f59e0b,stroke:#fff,color:#fff
    style Y fill:#dc2626,stroke:#fff,color:#fff
    style Z fill:#3b82f6,stroke:#fff,color:#fff
    style AA fill:#3b82f6,stroke:#fff,color:#fff
    style AB fill:#0369a1,stroke:#fff,color:#fff
    style AC fill:#ea580c,stroke:#fff,color:#fff
    style AD fill:#15803d,stroke:#fff,color:#fff
    style AG fill:#dc2626,stroke:#fff,color:#fff
    style AL fill:#dc2626,stroke:#fff,color:#fff
    style AN fill:#dc2626,stroke:#fff,color:#fff
    style AO fill:#16a34a,stroke:#fff,color:#fff
    style AQ fill:#16a34a,stroke:#fff,color:#fff
```

## Diagrama de Secuencia — Step 1 (campos estáticos)

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
    participant FL as FormLayout.tsx
    participant SS as StandardComboBox
    participant NI as NumberInput
    participant RS as salarySlice (Redux)

    User->>FL: Abre Step 1
    FL->>RS: selectCurrentStep → 0
    FL->>RS: selectFormValues
    FL->>SS: render Country (opciones estáticas)
    FL->>SS: render Gender (opciones estáticas)
    FL->>NI: render Monthly Wage

    User->>SS: Selecciona Country = "Spain"
    SS->>FL: onChange("Spain")
    FL->>RS: dispatch updateFormValue(Country, Spain)
    FL->>RS: dispatch setPrimaryCountry("Spain")
    FL->>RS: dispatch clearDownstreamData("Country")
    Note over RS: Borra Gender, Economic Activity,<br/>Occupation, Occupation Level,<br/>Education Level del store

    User->>SS: Selecciona Gender = "Male"
    SS->>FL: onChange("Male")
    FL->>RS: dispatch updateFormValue(Gender, Male)
    FL->>RS: dispatch clearDownstreamData("Gender")

    User->>NI: Escribe "2500"
    NI->>FL: onInputChange("2500") → editingValues local
    Note over FL: isNextDisabled re-evalúa:<br/>formValues.Country ✓<br/>formValues.Gender ✓<br/>editingValues.MonthlyWage ✓<br/>→ botón Next habilitado

    User->>NI: blur / Enter
    NI->>FL: onChange("2500")
    FL->>RS: dispatch updateFormValue(Monthly Wage, 2500)

    User->>FL: Pulsa Next
    FL->>NI: blur() forzado
    FL->>RS: dispatch setCurrentStep(1)
    FL->>FL: setEditingValues({})
```

## Diagrama de Secuencia — Step 2 (campos dinámicos)

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
    participant FL as FormLayout.tsx
    participant DC as DynamicComboField
    participant DO as useDynamicOptions
    participant SEL as salarySelectors
    participant RTK as useGetFilteredOptionsQuery
    participant EF as Edge Function<br/>get-filtered-options
    participant RS as salarySlice (Redux)

    FL->>DC: render DynamicComboField(Economic Activity)
    DC->>DO: useDynamicOptions("Economic Activity")
    DO->>SEL: selectIsFieldEnabled → true<br/>(Country + Gender tienen valor)
    DO->>DO: construye filterValues<br/>{ Country, Gender }
    DO->>RTK: getFilteredOptions({ country, formValues, targetFields })
    RTK->>EF: GET functions/v1/get-filtered-options?...
    EF-->>RTK: SalaryRecord[]
    RTK-->>DO: records
    DO->>DO: extractUniqueOptions(records, "Economic Activity")
    DO->>RS: dispatch setAvailableOptions(Economic Activity, [...])
    DO->>RS: dispatch setLoadingOptions(Economic Activity, false)
    DO-->>DC: options=[ ], isLoading=false, isEnabled=true
    DC->>FL: StandardComboBox con opciones reales

    FL->>DC: render DynamicComboField(Occupation)
    DC->>DO: useDynamicOptions("Occupation")
    DO->>SEL: selectIsFieldEnabled → false<br/>(Economic Activity vacío)
    DO-->>DC: isEnabled=false
    DC->>FL: StandardComboBox disabled

    User->>FL: Selecciona Economic Activity = "Manufacturing"
    FL->>RS: dispatch updateFormValue(Economic Activity, Manufacturing)
    FL->>RS: dispatch clearDownstreamData("Economic Activity")
    Note over RS: Borra Occupation, Occupation Level,<br/>Education Level del store

    Note over DC: useDynamicOptions("Occupation") re-evalúa<br/>→ isEnabled=true, lanza nueva query
    DC->>DO: useDynamicOptions("Occupation")
    DO->>RTK: getFilteredOptions({ Country, Gender, Economic Activity })
    RTK->>EF: GET functions/v1/get-filtered-options?...
    EF-->>RTK: SalaryRecord[] filtrados
    RTK-->>DO: records
    DO->>DO: extractUniqueOptions(records, "Occupation")
    DO->>RS: dispatch setAvailableOptions(Occupation, [...])
    DC->>FL: StandardComboBox Occupation habilitado

    User->>FL: Selecciona Occupation y Occupation Level
    FL->>RS: dispatch updateFormValue (x2)
    FL->>RS: dispatch clearDownstreamData (x2)
    FL->>RS: dispatch setCurrentStep(2)
```

## Diagrama de Estados — Habilitación de Campos

```mermaid
stateDiagram-v2
    [*] --> Step1Activo

    Step1Activo --> CountryVacio: render
    CountryVacio --> CountrySeleccionado: usuario selecciona país
    CountrySeleccionado --> CascadeLimpiada: clearDownstreamData Country

    CascadeLimpiada --> GenderVacio
    GenderVacio --> GenderSeleccionado: usuario selecciona género
    GenderSeleccionado --> SalarioEnEdicion: usuario escribe salario

    SalarioEnEdicion --> SalarioCommiteado: blur o Enter
    SalarioCommiteado --> Step1Completo: todos los required con valor

    Step1Completo --> Step2Activo: usuario pulsa Next

    Step2Activo --> EconomicActivityCargando: useDynamicOptions lanza query
    EconomicActivityCargando --> EconomicActivityListo: Edge Function responde
    EconomicActivityListo --> EconomicActivitySeleccionado: usuario selecciona

    EconomicActivitySeleccionado --> OccupationHabilitado: clearDownstreamData
    OccupationHabilitado --> OccupationCargando: nueva query con filtros
    OccupationCargando --> OccupationListo: Edge Function responde
    OccupationListo --> OccupationSeleccionado: usuario selecciona

    OccupationSeleccionado --> OccupationLevelHabilitado
    OccupationLevelHabilitado --> OccupationLevelSeleccionado: usuario selecciona
    OccupationLevelSeleccionado --> Step2Completo

    Step2Completo --> Step3Activo: usuario pulsa Next

    Step3Activo --> EducationLevelCargando: useDynamicOptions lanza query
    EducationLevelCargando --> EducationLevelListo: Edge Function responde
    EducationLevelListo --> EducationLevelSeleccionado: usuario selecciona

    EducationLevelSeleccionado --> CamposEstaticosStep3
    CamposEstaticosStep3 --> Step3Completo: Years + Company Size seleccionados

    Step3Completo --> ResultadoFinal: Go to comparison sheet

    classDef activeStep fill:#1e3a8a,stroke:#fff,color:#fff
    classDef emptyField fill:#374151,stroke:#fff,color:#fff
    classDef loadingField fill:#f59e0b,stroke:#fff,color:#fff
    classDef readyField fill:#15803d,stroke:#fff,color:#fff
    classDef selectedField fill:#16a34a,stroke:#fff,color:#fff
    classDef cascade fill:#dc2626,stroke:#fff,color:#fff
    classDef complete fill:#ea580c,stroke:#fff,color:#fff
    classDef final fill:#7c3aed,stroke:#fff,color:#fff

    class Step1Activo,Step2Activo,Step3Activo activeStep
    class CountryVacio,GenderVacio,SalarioEnEdicion emptyField
    class EconomicActivityCargando,OccupationCargando,EducationLevelCargando loadingField
    class EconomicActivityListo,OccupationListo,EducationLevelListo readyField
    class CountrySeleccionado,GenderSeleccionado,SalarioCommiteado,EconomicActivitySeleccionado,OccupationSeleccionado,OccupationLevelSeleccionado,EducationLevelSeleccionado,CamposEstaticosStep3 selectedField
    class CascadeLimpiada cascade
    class Step1Completo,Step2Completo,Step3Completo complete
    class ResultadoFinal final
```

## Diagrama de Clases

```mermaid
classDiagram
    class FormLayout {
        +currentStep: number
        +formValues: ComparisonFormValues
        +isAuthenticated: boolean
        -editingValues: Record~string,string~
        -authModalOpen: boolean
        -templateModalOpen: boolean
        -upgradeModalOpen: boolean
        +handleFieldChange(fieldId, value) void
        +handleInputChange(fieldId, value) void
        +handleNext() void
        +handleBack() void
        +handleSubmit(e) void
        +isNextDisabled: boolean
    }

    class DynamicComboField {
        +fieldId: FormFieldId
        +value: string
        +onChange(value) void
        -options: string[]
        -isLoading: boolean
        -isEnabled: boolean
    }

    class StandardComboBox {
        +id: string
        +value: string
        +options: SelectOption[]
        +disabled: boolean
        +loading: boolean
        +onChange(value) void
        -internalSelected: SelectOption
        -query: string
        -filteredOptions: SelectOption[]
    }

    class NumberInput {
        +id: string
        +value: string
        +onChange(value) void
        +onInputChange(value) void
        -localValue: string
        +commit() void
    }

    class StepSlider {
        +currentStep: number
        +totalSteps: number
        +getProgressPercentage(index) number
    }

    class UseDynamicOptions {
        +fieldId: FormFieldId
        +options: string[]
        +isLoading: boolean
        +isEnabled: boolean
        +error: string|null
        -filterValues: ComparisonFormValues
        -shouldSkip: boolean
    }

    class SalarySlice {
        +formValues: ComparisonFormValues
        +currentStep: number
        +availableOptions: Record~string,string[]~
        +loadingOptions: Record~string,boolean~
        +selectedCountries: string[]
        +updateFormValue(fieldId, value) void
        +setCurrentStep(step) void
        +setPrimaryCountry(country) void
        +clearDownstreamData(fromFieldId) void
        +setAvailableOptions(fieldId, options) void
        +setLoadingOptions(fieldId, loading) void
    }

    class SalaryApi {
        +getFilteredOptions(params) SalaryRecord[]
    }

    class SalarySelectors {
        +selectIsFieldEnabled(state, fieldId) boolean
        +selectAvailableOptionsFor(state, fieldId) string[]
        +selectIsFieldLoading(state, fieldId) boolean
        +selectCanAddCountry(state) boolean
    }

    class SalaryConstants {
        +formSteps: FormStep[]
        +DYNAMIC_FIELDS_ORDER: FormFieldId[]
        +DYNAMIC_API_FIELDS: Set~FormFieldId~
        +STATIC_FIELDS: Set~FormFieldId~
    }

    FormLayout --> DynamicComboField : renderiza campos dinámicos
    FormLayout --> StandardComboBox : renderiza campos estáticos
    FormLayout --> NumberInput : renderiza campo numérico
    FormLayout --> StepSlider : muestra progreso
    FormLayout --> SalarySlice : dispatch + useAppSelector
    DynamicComboField --> UseDynamicOptions : usa hook
    DynamicComboField --> StandardComboBox : delega render
    UseDynamicOptions --> SalarySelectors : selectIsFieldEnabled
    UseDynamicOptions --> SalaryApi : useGetFilteredOptionsQuery
    UseDynamicOptions --> SalarySlice : dispatch setAvailableOptions
    SalarySelectors --> SalaryConstants : DYNAMIC_FIELDS_ORDER
    SalaryApi --> SalaryConstants : tipos FormFieldId

    style FormLayout fill:#1e3a8a,stroke:#fff,color:#fff
    style DynamicComboField fill:#7c3aed,stroke:#fff,color:#fff
    style StandardComboBox fill:#15803d,stroke:#fff,color:#fff
    style NumberInput fill:#15803d,stroke:#fff,color:#fff
    style StepSlider fill:#374151,stroke:#fff,color:#fff
    style UseDynamicOptions fill:#7c3aed,stroke:#fff,color:#fff
    style SalarySlice fill:#ea580c,stroke:#fff,color:#fff
    style SalaryApi fill:#3b82f6,stroke:#fff,color:#fff
    style SalarySelectors fill:#0369a1,stroke:#fff,color:#fff
    style SalaryConstants fill:#374151,stroke:#fff,color:#fff
```

## Diagrama de Entidad-Relación — Estructura de datos del wizard

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
    SALARY_SLICE_STATE {
        number currentStep
        string selectedCountries
        object formValues
        object availableOptions
        object loadingOptions
    }

    COMPARISON_FORM_VALUES {
        string Country
        string Gender
        string Monthly_Wage
        string Economic_Activity
        string Occupation
        string Occupation_Level
        string Education_Level
        string Years_Of_Experience
        string Company_Size
    }

    FORM_STEP {
        number stepNumber
        array fields
    }

    FORM_FIELD {
        string id
        string type
        boolean required
        string placeholder
        array options
    }

    SALARY_RECORD {
        string Country
        string Gender
        string Occupation
        string Occupation_Level
        string Economic_Activity
        string Education_Level
        number Monthly_Wage
        number Year
    }

    AVAILABLE_OPTIONS {
        string fieldId
        array options
        boolean loading
    }

    SALARY_SLICE_STATE ||--|| COMPARISON_FORM_VALUES : contiene
    SALARY_SLICE_STATE ||--o{ AVAILABLE_OPTIONS : gestiona
    FORM_STEP ||--|{ FORM_FIELD : tiene
    COMPARISON_FORM_VALUES ||..|| SALARY_RECORD : keys_coinciden_con_columnas
    AVAILABLE_OPTIONS ||..|| SALARY_RECORD : extraída_de
```

## Mapa Mental

```mermaid
%%{init: {'theme':'dark', 'themeVariables': {
  'primaryColor':'#1e3a8a',
  'primaryTextColor':'#ffffff',
  'primaryBorderColor':'#60a5fa',
  'lineColor':'#6b7280'
}}}%%
mindmap
  root((Form Wizard\nStep 1→3))
    FormLayout.tsx
      Estado local
        editingValues
        authModalOpen
        templateModalOpen
        upgradeModalOpen
      Navegación
        handleNext
        handleBack
        handleSubmit
      Validación
        isNextDisabled
        required fields check
        formValues + editingValues
    Step 1 - Estático
      Country
        StandardComboBox
        setPrimaryCountry
        clearDownstreamData
      Gender
        StandardComboBox
        clearDownstreamData
      Monthly Wage
        NumberInput
        commit diferido blur/Enter
        onInputChange tiempo real
    Step 2 - Dinámico
      DynamicComboField
        useDynamicOptions
          selectIsFieldEnabled
          filterValues construction
          useGetFilteredOptionsQuery
          extractUniqueOptions
          setAvailableOptions
          setLoadingOptions
      Economic Activity
        depende de Country + Gender
      Occupation
        depende de + Economic Activity
      Occupation Level
        depende de + Occupation
    Step 3 - Mixto
      Education Level
        dinámico
        depende de todos los anteriores
      Years Of Experience
        estático hardcodeado
      Company Size
        estático hardcodeado
      Save as template
        usePlanLimits
        TemplateModal
        UpgradeModal
    Redux - salarySlice
      updateFormValue
      clearDownstreamData
        cascade cleanup
        formValues
        availableOptions
        loadingOptions
      setCurrentStep
      setAvailableOptions
      setLoadingOptions
    API - Edge Functions
      get-filtered-options
        query PostgREST
        filtra TABLE_0
        retorna SalaryRecord[]
      salaryApi RTK Query
        cache por filtros
        skip si deshabilitado
    salaryConstants.ts
      formSteps array
      DYNAMIC_FIELDS_ORDER
      DYNAMIC_API_FIELDS
      STATIC_FIELDS
```
