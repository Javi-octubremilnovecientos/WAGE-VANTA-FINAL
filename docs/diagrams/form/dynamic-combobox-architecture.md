# Arquitectura de StandardComboBox y Opciones Dinámicas

## 1. Diagrama de Arquitectura y Flujo de Datos

Este diagrama muestra la arquitectura completa del sistema de ComboBox dinámicos y cómo fluyen los datos desde la interacción del usuario hasta la API de Supabase.

```mermaid
flowchart TB
    %% Capa de Usuario
    subgraph UI["Capa de Presentacion"]
        User[Usuario]
        SCB[StandardComboBox<br/>Componente UI Puro]
        Skeleton[ComboBoxSkeleton<br/>Estado de Carga]
    end

    %% Capa de Lógica
    subgraph Logic["Capa de Logica"]
        FL[FormLayout<br/>Orquestador Principal]
        DCB[DynamicComboBoxField<br/>Wrapper Inteligente]
        Hook[useDynamicOptions<br/>Hook de Carga]
    end

    %% Capa de Estado
    subgraph State["Redux Store"]
        direction LR
        Slice[salarySlice<br/>Estado del Form]
        Selectors[Selectores<br/>- isEnabled<br/>- options<br/>- isLoading]
    end

    %% Capa de Datos
    subgraph Data["Capa de Datos"]
        RTK[RTK Query<br/>getFilteredOptions]
        Utils[salaryUtils<br/>buildQueryString<br/>extractUniqueOptions]
    end

    %% API Externa
    Supabase[(Supabase<br/>TABLE_0)]

    %% Flujo de Interacción
    User -->|1. Selecciona valor| SCB
    SCB -->|onChange event| DCB
    DCB -->|handleFieldChange| FL
    FL -->|2. Dispatch| Slice

    %% Flujo de Actualización
    Slice -->|updateFormValue| Slice
    Slice -->|clearDownstreamData| Slice
    Slice -->|3. Estado actualizado| Selectors

    %% Flujo de Renderizado
    DCB -->|4. Consulta estado| Hook
    Hook -->|Lee formValues| Selectors
    Hook -->|Verifica isEnabled| Selectors

    %% Flujo de Carga de Opciones
    Hook -->|5. Si isDynamic & isEnabled| RTK
    RTK -->|6. Construye query| Utils
    Utils -->|Query PostgREST| Supabase
    Supabase -->|7. Registros filtrados| RTK
    RTK -->|8. Extrae opciones| Utils
    Utils -->|Array de strings únicos| Hook
    Hook -->|9. setAvailableOptions| Slice

    %% Flujo de Renderizado Final
    Selectors -->|10. options, loading, enabled| DCB
    DCB -->|11. Props finales| SCB
    SCB -->|12. Re-render con nuevas opciones| User

    %% Estilos
    classDef userLayer fill:#b3e5fc,stroke:#0288d1,stroke-width:2px,color:#01579b
    classDef logicLayer fill:#ffe0b2,stroke:#ef6c00,stroke-width:2px,color:#e65100
    classDef stateLayer fill:#e1bee7,stroke:#7b1fa2,stroke-width:2px,color:#4a148c
    classDef dataLayer fill:#c8e6c9,stroke:#388e3c,stroke-width:2px,color:#1b5e20
    classDef apiLayer fill:#f8bbd0,stroke:#c2185b,stroke-width:2px,color:#880e4f

    class User,SCB,Skeleton userLayer
    class FL,DCB,Hook logicLayer
    class Slice,Selectors stateLayer
    class RTK,Utils dataLayer
    class Supabase apiLayer
```

---

## 2. Diagrama de Secuencia: Selección de Economic Activity

Este diagrama muestra la secuencia temporal de eventos cuando un usuario selecciona un valor en un campo que afecta a campos dependientes.

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryTextColor':'#1a1a1a','secondaryTextColor':'#1a1a1a','tertiaryTextColor':'#1a1a1a','actorTextColor':'#000','labelTextColor':'#000','loopTextColor':'#000','noteBkgColor':'#fff','noteTextColor':'#000','activationBkgColor':'#ddd','sequenceNumberColor':'#000'}}}%%
sequenceDiagram
    autonumber
    actor User as Usuario
    participant SCB as StandardComboBox
    participant FL as FormLayout
    participant Slice as Redux Slice
    participant Hook as useDynamicOptions
    participant RTK as RTK Query
    participant Utils as salaryUtils
    participant API as Supabase API

    rect rgb(179, 229, 252)
    Note over User,API: Usuario selecciona Female en Gender
    User->>+SCB: Selecciona "Female"
    SCB->>+FL: onChange("Gender", "Female")
    FL->>+Slice: dispatch(updateFormValue)
    Slice->>Slice: formValues.Gender = "Female"
    FL->>Slice: dispatch(clearDownstreamData("Gender"))
    Slice->>Slice: Limpia Economic Activity, Occupation, etc.
    Slice-->>-FL: Estado actualizado
    FL-->>-SCB: Re-render
    SCB-->>-User: UI actualizada
    end

    rect rgb(255, 224, 178)
    Note over User,API: Carga automatica de opciones para Economic Activity
    User->>SCB: Navega a Economic Activity ComboBox
    activate Hook
    Hook->>+Slice: selectIsFieldEnabled("Economic Activity")
    Slice-->>-Hook: true (Country & Gender tienen valor)
    Hook->>+Slice: selectFormValues()
    Slice-->>-Hook: { Country: "Spain", Gender: "Female" }
    Hook->>Hook: Construye filterValues
    Note right of Hook: filterValues = {<br/>  Country: "Spain",<br/>  Gender: "Female"<br/>}
    end

    rect rgb(200, 230, 201)
    Note over Hook,API: Peticion a Supabase
    Hook->>+RTK: useGetFilteredOptionsQuery(...)
    RTK->>+Utils: buildOptionsQueryString(...)
    Utils->>Utils: Construye URL PostgREST
    Note right of Utils: Country=eq.Spain<br/>&Gender=eq.Female<br/>&select=Economic Activity
    Utils-->>-RTK: Query string
    RTK->>+API: GET /rest/v1/TABLE_0?...
    API-->>-RTK: [<br/>  { "Economic Activity": "Manufacturing" },<br/>  { "Economic Activity": "Services" },<br/>  ...<br/>]
    RTK->>+Utils: extractUniqueOptions(records, "Economic Activity")
    Utils->>Utils: Set de valores únicos + sort
    Utils-->>-RTK: ["Construction", "Manufacturing", "Services"]
    RTK-->>-Hook: options = [...]
    end

    rect rgb(225, 190, 231)
    Note over Hook,User: Actualizacion de Estado y Renderizado
    Hook->>+Slice: dispatch(setAvailableOptions)
    Slice->>Slice: availableOptions["Economic Activity"] = [...]
    Slice-->>-Hook: Estado actualizado
    deactivate Hook
    Hook-->>SCB: { options, isLoading: false, isEnabled: true }
    SCB->>SCB: Re-render con nuevas opciones
    SCB-->>User: Muestra opciones filtradas
    end

    rect rgb(248, 187, 208)
    Note over User,API: Usuario selecciona Services
    User->>+SCB: Selecciona "Services"
    SCB->>+FL: onChange("Economic Activity", "Services")
    FL->>+Slice: dispatch(updateFormValue)
    Slice->>Slice: formValues["Economic Activity"] = "Services"
    FL->>Slice: dispatch(clearDownstreamData("Economic Activity"))
    Slice->>Slice: Limpia Occupation, Occupation Level, Education Level
    Slice-->>-FL: Estado actualizado
    FL-->>-SCB: Re-render
    SCB-->>-User: UI actualizada
    Note over User: Ahora Occupation se habilitara<br/>y cargara opciones filtradas<br/>por Country + Gender + Economic Activity
    end
```

---

## 3. Diagrama de Estados: Ciclo de Vida de un Campo Dinámico

```mermaid
stateDiagram-v2
    [*] --> Disabled: Inicializacion

    Disabled --> Loading: Campos previos completados
    note right of Disabled
        disabled: true
        loading: false
        options: []
    end note

    Loading --> Ready: API responde exitosamente
    Loading --> Error: API falla
    note right of Loading
        disabled: false
        loading: true
        options: [] (skeleton visible)
    end note

    Ready --> Loading: Usuario cambia campo previo
    Ready --> Disabled: Usuario borra campo previo
    note right of Ready
        disabled: false
        loading: false
        options: [... desde API]
    end note

    Error --> Loading: Usuario reintenta
    note right of Error
        disabled: false
        loading: false
        options: []
        error: "Error al cargar opciones"
    end note

    Ready --> [*]: Usuario completa formulario
```

---

## 4. Diagrama de Dependencias entre Campos

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryTextColor':'#000','secondaryTextColor':'#000','tertiaryTextColor':'#000','edgeLabelBackground':'#fff','clusterBkg':'#fff'}}}%%
flowchart LR
    %% Campos Estaticos
    subgraph Static["Campos Estaticos<br/>(Siempre habilitados)"]
        Country[Country]
        Gender[Gender]
        YOE[Years Of Experience]
        CS[Company Size]
    end

    %% Campos Dinamicos
    subgraph Dynamic["Campos Dinamicos<br/>(Dependen de API)"]
        EA[Economic Activity]
        Occ[Occupation]
        OL[Occupation Level]
        EL[Education Level]
    end

    %% Dependencias
    Country --> EA
    Gender --> EA
    EA --> Occ
    Occ --> OL
    OL --> EL

    %% Orden de procesamiento
    Country -.->|1| Gender
    Gender -.->|2| EA
    EA -.->|3| Occ
    Occ -.->|4| OL
    OL -.->|5| EL

    %% Estilos
    classDef staticStyle fill:#90caf9,stroke:#1976d2,stroke-width:2px,color:#0d47a1
    classDef dynamicStyle fill:#fff176,stroke:#f57f17,stroke-width:2px,color:#f57f00

    class Country,Gender,YOE,CS staticStyle
    class EA,Occ,OL,EL dynamicStyle
```

---

## 5. Diagrama de Cache: RTK Query

```mermaid
flowchart TB
    subgraph Cache["Cache de RTK Query"]
        direction TB
        K1["Key: 'options-Spain-{Country:Spain,Gender:Male}'<br/>Value: ['Manufacturing', 'Services', ...]"]
        K2["Key: 'options-Spain-{Country:Spain,Gender:Female}'<br/>Value: ['Construction', 'Healthcare', ...]"]
        K3["Key: 'options-France-{Country:France,Gender:Male}'<br/>Value: ['Agriculture', 'Tourism', ...]"]
    end

    subgraph Requests["Peticiones"]
        R1[Usuario 1:<br/>Spain + Male]
        R2[Usuario 2:<br/>Spain + Female]
        R3[Usuario 3:<br/>Spain + Male]
    end

    R1 -->|1. Cache miss| API1[API Request]
    API1 --> K1
    R2 -->|2. Cache miss| API2[API Request]
    API2 --> K2
    R3 -->|3. Cache hit!| K1
    K1 -.->|Sin nueva petición| R3

    style K1 fill:#c8e6c9,stroke:#388e3c
    style K2 fill:#c8e6c9,stroke:#388e3c
    style K3 fill:#c8e6c9,stroke:#388e3c
    style R3 fill:#ffecb3,stroke:#f57f17
```

---

## Resumen de Responsabilidades

| Componente               | Responsabilidad                   | Input                                       | Output                              |
| ------------------------ | --------------------------------- | ------------------------------------------- | ----------------------------------- |
| **StandardComboBox**     | Renderizar UI del ComboBox        | `options[]`, `value`, `disabled`, `loading` | Eventos `onChange`                  |
| **DynamicComboBoxField** | Decidir origen de opciones        | `field`, `value`                            | Props para `StandardComboBox`       |
| **useDynamicOptions**    | Orquestar carga de opciones       | `fieldId`                                   | `{ options, isLoading, isEnabled }` |
| **RTK Query**            | Gestionar peticiones HTTP         | `country`, `formValues`, `targetFields`     | `SalaryRecord[]` con cache          |
| **salaryUtils**          | Construir queries y extraer datos | `formValues`, `records`                     | Query strings y arrays únicos       |
| **Redux Selectors**      | Calcular estado derivado          | State completo                              | Estados booleanos y arrays          |

---

## Notas de Implementación

### ✅ Ventajas del Diseño

1. **Separación de responsabilidades**: Cada capa tiene un propósito único
2. **Testabilidad**: Componentes puros fáciles de probar
3. **Rendimiento**: Cache automático de RTK Query + memoización de selectores
4. **Escalabilidad**: Añadir nuevos campos dinámicos es trivial

### ⚠️ Consideraciones

1. **Country es obligatorio**: Sin Country, ningún campo dinámico puede cargar opciones
2. **Limpieza en cascada**: Cambiar un campo limpia todos los campos posteriores
3. **Query progresiva**: Solo se incluyen filtros con valor en la URL
4. **Truncamiento de valores**: Occupation/Education Level se truncan a 19 chars para evitar URLs demasiado largas
