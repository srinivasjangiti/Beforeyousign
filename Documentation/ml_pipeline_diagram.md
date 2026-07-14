# ML Pipeline Diagram

This diagram visualizes your exact semantic retrieval engine architecture, highlighting the separation between the offline dataset generation and the online inference process.

```mermaid
flowchart TD
    %% Styling
    classDef offline fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px,color:#0f172a,stroke-dasharray: 5 5
    classDef online fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#0f172a
    classDef mlEngine fill:#fefce8,stroke:#eab308,stroke-width:2px,color:#0f172a
    classDef data fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#0f172a
    classDef ui fill:#faf5ff,stroke:#a855f7,stroke-width:2px,color:#0f172a

    subgraph Offline [Offline Setup Phase]
        LEDGAR[(LEDGAR Dataset\n250 Clauses)]:::data
        GenEmbedOff[Embedding Generation\nall-MiniLM-L6-v2]:::mlEngine
        VectorStore[(Precomputed Vector Store\nJSON File)]:::data
        
        LEDGAR -->|Raw Text & Metadata| GenEmbedOff
        GenEmbedOff -->|384-dimensional vectors| VectorStore
    end
    
    Offline:::offline

    subgraph Online [Online Runtime Inference]
        UserClause[User Selected Clause]:::ui
        GenEmbedOn[Embedding Generation\nall-MiniLM-L6-v2]:::mlEngine
        CosineSim{Cosine Similarity\nCalculation}:::mlEngine
        TopK[Top-K Retrieval\nK=3]:::mlEngine
        Benchmarking[Clause Benchmarking\nRisk Variance]:::data
        UI[AnalysisResult UI]:::ui

        UserClause -->|Input String| GenEmbedOn
        GenEmbedOn -->|Query Vector| CosineSim
        
        %% Connect offline store to online math
        VectorStore -.->|Load into Memory| CosineSim
        
        CosineSim -->|Sort by Score| TopK
        TopK -->|Append Corpus Stats| Benchmarking
        Benchmarking --> UI
    end
    
    Online:::online
```
