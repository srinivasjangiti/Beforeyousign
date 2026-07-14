# Entity Relationship (ER) Diagram

This diagram displays the active core database tables powering the application, intentionally filtering out unused tables to accurately reflect the live system boundaries.

```mermaid
erDiagram
    %% Core Functional Entities
    User {
        string id PK
        string email UK
        string name
        string role
        datetime createdAt
    }

    Contract {
        string id PK
        string userId FK
        string name
        string content
        string status
        datetime createdAt
    }

    Analysis {
        string id PK
        string contractId FK
        string userId FK
        int riskScore
        json redFlags
        json clauses
        datetime createdAt
    }

    AnalyzedContract {
        string id PK
        string fileName
        string contractType
        int riskScore
        int redFlagsCount
        int clausesCount
        datetime createdAt
    }
    
    %% Partially Active / Supporting Entities
    Activity {
        string id PK
        string contractId FK
        string userId FK
        string type
        string description
    }

    %% Prototype / Future Scope Entities
    Comment {
        string id PK "PROTOTYPE"
        string contractId FK
        string content
        boolean resolved
    }

    Notification {
        string id PK "PROTOTYPE"
        string userId FK
        string title
        string message
    }

    %% Relationships
    User ||--o{ Contract : "owns"
    User ||--o{ Analysis : "requests"
    User ||--o{ Activity : "performs"
    User ||--o{ Notification : "receives (future)"
    
    Contract ||--o{ Analysis : "has"
    Contract ||--o{ Activity : "logs"
    Contract ||--o{ Comment : "has discussions (future)"
```
