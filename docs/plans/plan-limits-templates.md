# Plan Limits & Feature Access — Diagramas

## Diagrama de Flujo — Guardar Template (foco en control de plan)

```mermaid
graph TD
    A([Usuario pulsa Save as template]) --> B{isAuthenticated?}
    B -- No - Guest --> C[Abre AuthModal\nmodo login]
    B -- Sí --> D[Abre TemplateModal\nmode=save]

    C --> Z([Fin: usuario debe\nautenticarse primero])

    D --> E[PlanLimitBadge\ntemplates.length / maxTemplates]
    D --> F{canSaveTemplate?}

    F -- false\nlímite alcanzado --> G[Muestra bloque\nTemplate limit reached]
    G --> H[Botón: Upgrade to Premium]
    H --> I[onClose + onUpgradeRequired]
    I --> J[UpgradeModal - feature=save_templates]
    J --> K{Usuario pulsa\nUpgrade to Premium?}
    K -- Sí --> L[navigate - /plans]
    K -- No --> M([Cierra UpgradeModal])

    F -- true\npuede guardar --> N[Muestra preview\nformValues actuales]
    N --> O[Botón: Save Template]
    O --> P[handleSaveTemplate]
    P --> Q[Construir objeto Template\ndesde formValues]
    Q --> R[updatedTemplates = ...templates, newTemplate]
    R --> S[useUpdateUserData\ntemplates: updatedTemplates]
    S --> T[Construir payload completo\nname + premium + comparisons\n+ payData + avatarUrl + templates]
    T --> U[PUT auth/v1/user\ndata: fullUserData]
    U --> V[(Supabase\nuser_metadata)]
    V --> W[SupabaseUser response]
    W --> X[mapSupabaseResponseToUser]
    X --> Y[dispatch patchUser\nRedux sincronizado]
    Y --> YY[onClose]

    style A fill:#374151,stroke:#fff,color:#fff
    style B fill:#f59e0b,stroke:#fff,color:#fff
    style C fill:#dc2626,stroke:#fff,color:#fff
    style D fill:#1e3a8a,stroke:#fff,color:#fff
    style E fill:#374151,stroke:#fff,color:#fff
    style F fill:#f59e0b,stroke:#fff,color:#fff
    style G fill:#dc2626,stroke:#fff,color:#fff
    style H fill:#dc2626,stroke:#fff,color:#fff
    style I fill:#dc2626,stroke:#fff,color:#fff
    style J fill:#dc2626,stroke:#fff,color:#fff
    style L fill:#0369a1,stroke:#fff,color:#fff
    style N fill:#15803d,stroke:#fff,color:#fff
    style O fill:#15803d,stroke:#fff,color:#fff
    style P fill:#ea580c,stroke:#fff,color:#fff
    style Q fill:#ea580c,stroke:#fff,color:#fff
    style R fill:#ea580c,stroke:#fff,color:#fff
    style S fill:#7c3aed,stroke:#fff,color:#fff
    style T fill:#7c3aed,stroke:#fff,color:#fff
    style U fill:#3b82f6,stroke:#fff,color:#fff
    style V fill:#3b82f6,stroke:#fff,color:#fff
    style W fill:#3b82f6,stroke:#fff,color:#fff
    style X fill:#ea580c,stroke:#fff,color:#fff
    style Y fill:#16a34a,stroke:#fff,color:#fff
    style YY fill:#16a34a,stroke:#fff,color:#fff
    style Z fill:#dc2626,stroke:#fff,color:#fff
    style M fill:#374151,stroke:#fff,color:#fff
```

## Diagrama de Secuencia — Templates según plan

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
    participant PL as usePlanLimits
    participant SEL as selectCanSaveTemplate<br/>(salarySelectors)
    participant PLM as planLimits.ts
    participant TM as TemplateModal.tsx
    participant UM as UpgradeModal.tsx
    participant UUD as useUpdateUserData
    participant SB as Supabase REST
    participant RS as authSlice (Redux)

    User->>FL: Pulsa "Save as template"
    FL->>PL: canSaveTemplate, maxTemplates
    PL->>SEL: useAppSelector(selectCanSaveTemplate)
    SEL->>RS: auth.isAuthenticated, auth.user.premium,<br/>auth.user.templates.length
    SEL->>PLM: getPlanLimits(isAuthenticated, isPremium)
    PLM-->>SEL: PlanLimits { maxTemplates: 0|1|4 }
    SEL-->>PL: templates.length < maxTemplates → boolean

    alt Usuario no autenticado (Guest)
        FL->>FL: setAuthModalOpen(true)
        Note over FL: Nunca llega a TemplateModal
    else Usuario autenticado
        FL->>TM: open(mode=save, canSaveTemplate, maxTemplates)
        TM->>TM: render PlanLimitBadge(current, max)

        alt canSaveTemplate === false (límite alcanzado)
            TM->>TM: render bloque "Template limit reached"
            User->>TM: Pulsa "Upgrade to Premium"
            TM->>FL: onUpgradeRequired()
            FL->>UM: open(feature=save_templates)
            User->>UM: Pulsa "Upgrade to Premium"
            UM->>UM: navigate('/plans')
        else canSaveTemplate === true
            TM->>TM: render preview formValues
            User->>TM: Pulsa "Save Template"
            TM->>TM: handleSaveTemplate()
            TM->>TM: Construir Template desde formValues
            TM->>TM: updatedTemplates = [...templates, newTemplate]
            TM->>UUD: updateUserData({ templates: updatedTemplates })
            UUD->>UUD: Construir fullUserData completo<br/>(merge con todos los campos del user)
            UUD->>SB: PUT /auth/v1/user { data: fullUserData }
            SB-->>UUD: SupabaseUser actualizado
            UUD->>UUD: mapSupabaseResponseToUser
            UUD->>RS: dispatch patchUser(mappedUser)
            RS-->>RS: user.templates actualizado en Redux
            TM->>FL: onClose()
        end
    end
```

## Diagrama de Estados — Usuario según plan y acceso a templates

```mermaid
stateDiagram-v2
    [*] --> Guest

    Guest --> Free: signIn exitoso\nisAuthenticated=true\npremium=false
    Guest --> Premium: signIn exitoso\nisAuthenticated=true\npremium=true

    Free --> Premium: usuario compra plan\ndispatch updatePremium(true)
    Premium --> Free: downgrade\ndispatch updatePremium(false)

    Free --> Guest: logout\ndispatch logout()
    Premium --> Guest: logout\ndispatch logout()

    state Guest {
        [*] --> NoTemplates
        NoTemplates --> BloqueadoAuth: pulsa Save template
        BloqueadoAuth --> [*]: AuthModal abierto
        note right of NoTemplates
            maxTemplates = 0
            canSaveTemplate = false
            Bloqueado en FormLayout
        end note
    }

    state Free {
        [*] --> Template0de1
        Template0de1 --> Template1de1: guarda 1 template
        Template1de1 --> LimiteAlcanzadoFree: intenta guardar más
        LimiteAlcanzadoFree --> UpgradeModalFree: TemplateModal abre UpgradeModal
        note right of Template0de1
            maxTemplates = 1
            canSaveTemplate = 0 menor 1 = true
        end note
        note right of Template1de1
            canSaveTemplate = 1 menor 1 = false
        end note
    }

    state Premium {
        [*] --> Templates0de4
        Templates0de4 --> Templates1de4: guarda template
        Templates1de4 --> Templates2de4: guarda template
        Templates2de4 --> Templates3de4: guarda template
        Templates3de4 --> Templates4de4: guarda template
        Templates4de4 --> LimiteAlcanzadoPremium: intenta guardar más
        note right of Templates0de4
            maxTemplates = 4
            canSaveTemplate = true hasta llegar a 4
        end note
    }

    classDef guestState fill:#374151,stroke:#fff,color:#fff
    classDef freeState fill:#1e3a8a,stroke:#fff,color:#fff
    classDef premiumState fill:#7c3aed,stroke:#fff,color:#fff
    classDef blockedState fill:#dc2626,stroke:#fff,color:#fff
    classDef okState fill:#15803d,stroke:#fff,color:#fff

    class Guest guestState
    class Free freeState
    class Premium premiumState
    class BloqueadoAuth,LimiteAlcanzadoFree,LimiteAlcanzadoPremium,UpgradeModalFree blockedState
    class Template0de1,Templates0de4,Templates1de4,Templates2de4,Templates3de4 okState
```

## Diagrama de Clases — Capas del sistema de planes

```mermaid
classDiagram
    class PlanLimits {
        +maxCountries: number
        +maxTemplates: number
        +maxComparisons: number
        +maxChartViews: number
        +canExport: boolean
        +hasAccurateData: boolean
    }

    class PlanLimitsLib {
        +GUEST_LIMITS: PlanLimits
        +FREE_LIMITS: PlanLimits
        +PREMIUM_LIMITS: PlanLimits
        +getPlanLimits(isAuthenticated, isPremium) PlanLimits
        +getCurrentPlanType(isAuthenticated, isPremium) PlanType
        +getPlanName(planType) string
    }

    class SalarySelectors {
        +selectCanSaveTemplate(state) boolean
        +selectMaxTemplates(state) number
        +selectCanSaveComparison(state) boolean
        +selectCanAddCountry(state) boolean
        +selectCanExport(state) boolean
        +selectCanAccessMultipleChartViews(state) boolean
    }

    class UsePlanLimits {
        +canSaveTemplate: boolean
        +maxTemplates: number
        +canSaveComparison: boolean
        +canAddCountry: boolean
        +canExport: boolean
        +isPremium: boolean
        +isAuthenticated: boolean
    }

    class FormLayout {
        +canSaveTemplate: boolean
        +maxTemplates: number
        +isAuthenticated: boolean
        -templateModalOpen: boolean
        -upgradeModalOpen: boolean
        +openTemplateModal(mode) void
    }

    class TemplateModal {
        +canSaveTemplate: boolean
        +maxTemplates: number
        +onUpgradeRequired() void
        +handleSaveTemplate() Promise~void~
        +handleLoadTemplate(template) void
    }

    class PlanLimitBadge {
        +current: number
        +max: number
        +label: string
        +onUpgradeClick() void
        +isLimitReached: boolean
    }

    class UpgradeModal {
        +feature: PremiumFeature
        +handleUpgrade() void
        +getFeatureMessage() string
    }

    class UseUpdateUserData {
        +updateUserData(partial) Promise~User~
        -buildFullPayload(user, partial) UserData
    }

    class AuthSlice {
        +isAuthenticated: boolean
        +user.premium: boolean
        +user.templates: Template[]
        +patchUser(user) void
        +updatePremium(value) void
    }

    PlanLimitsLib --> PlanLimits : crea instancias
    SalarySelectors --> PlanLimitsLib : getPlanLimits
    SalarySelectors --> AuthSlice : lee isAuthenticated + premium + templates
    UsePlanLimits --> SalarySelectors : useAppSelector
    FormLayout --> UsePlanLimits : consume
    FormLayout --> TemplateModal : pasa canSaveTemplate + maxTemplates
    FormLayout --> UpgradeModal : abre si límite
    TemplateModal --> PlanLimitBadge : muestra contador
    TemplateModal --> UseUpdateUserData : persiste template
    UseUpdateUserData --> AuthSlice : dispatch patchUser

    style PlanLimits fill:#374151,stroke:#fff,color:#fff
    style PlanLimitsLib fill:#374151,stroke:#fff,color:#fff
    style SalarySelectors fill:#0369a1,stroke:#fff,color:#fff
    style UsePlanLimits fill:#7c3aed,stroke:#fff,color:#fff
    style FormLayout fill:#1e3a8a,stroke:#fff,color:#fff
    style TemplateModal fill:#1e3a8a,stroke:#fff,color:#fff
    style PlanLimitBadge fill:#15803d,stroke:#fff,color:#fff
    style UpgradeModal fill:#dc2626,stroke:#fff,color:#fff
    style UseUpdateUserData fill:#ea580c,stroke:#fff,color:#fff
    style AuthSlice fill:#ea580c,stroke:#fff,color:#fff
```

## Diagrama de Entidad-Relación — Estructura de planes y templates

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
    USER {
        string id
        string email
        boolean isAuthenticated
        boolean premium
        array templates
        array comparisons
    }

    PLAN_TYPE {
        string type
        number maxTemplates
        number maxComparisons
        number maxCountries
        number maxChartViews
        boolean canExport
        boolean hasAccurateData
    }

    TEMPLATE {
        number id
        string country
        string gender
        number monthlyWage
        string economicActivity
        string occupation
        string position
        string educationLevel
        string companySize
        number experienceYears
    }

    PLAN_LIMITS_CONSTANTS {
        string GUEST
        string FREE
        string PREMIUM
    }

    USER ||--o{ TEMPLATE : guarda
    USER ||--|| PLAN_TYPE : tiene_segun_premium
    PLAN_TYPE ||--|| PLAN_LIMITS_CONSTANTS : definido_en
    PLAN_TYPE ||..o{ TEMPLATE : limita_cantidad
```

## Mapa Mental — Sistema de planes y templates

```mermaid
%%{init: {'theme':'dark', 'themeVariables': {
  'primaryColor':'#1e3a8a',
  'primaryTextColor':'#ffffff',
  'primaryBorderColor':'#60a5fa',
  'lineColor':'#6b7280'
}}}%%
mindmap
  root((Plan Limits\nTemplates))
    Fuente de verdad
      authSlice.ts
        isAuthenticated
        user.premium
        user.templates array
    Capa 1 - Datos puros
      lib/planLimits.ts
        GUEST_LIMITS maxTemplates=0
        FREE_LIMITS maxTemplates=1
        PREMIUM_LIMITS maxTemplates=4
        getPlanLimits función pura
    Capa 2 - Selectores Reselect
      salarySelectors.ts
        selectCanSaveTemplate
          templates.length menor maxTemplates
        selectMaxTemplates
          devuelve límite del plan
        Memoizado con createSelector
    Capa 3 - Hook unificado
      usePlanLimits.ts
        canSaveTemplate boolean
        maxTemplates number
        Agrupa todos los permisos
    Capa 4 - Guardia de autenticación
      FormLayout.tsx
        isAuthenticated check
        Guest → AuthModal
        Logged → TemplateModal
    Capa 5 - Guardia de plan
      TemplateModal.tsx
        canSaveTemplate check
        PlanLimitBadge X de Y
        Límite alcanzado → UpgradeModal
        Disponible → handleSaveTemplate
    Persistencia
      useUpdateUserData.ts
        Merge seguro de user_metadata
        PUT /auth/v1/user
        dispatch patchUser
    Upgrade Path
      UpgradeModal.tsx
        Mensaje contextual por feature
        Botón navega a /plans
      PlanCard.tsx
        Muestra límites por plan
        Botón Buy plan → /billing
```
