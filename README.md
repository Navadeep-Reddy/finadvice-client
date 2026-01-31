## Project Description

Design and build a scalable, secure, and intelligent FinTech platform that enables real-time **financial decision-making** for small businesses by ingesting heterogeneous data sources (transactions, user behavior, external signals), handling uncertainty and incomplete information, ensuring privacy and regulatory compliance, and delivering explainable, actionable outcomes. The system demonstrates strong system architecture, data handling, security, and performance, while incorporating AI for prediction, optimization, and reasoning, without relying solely on AI as the core solution.

<div align="center">
  <img src="https://github.com/Navadeep-Reddy/ProjectScreenshots/blob/main/FinadviceClient/landing_page.png?raw=true" alt="Landing Page" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;"/>
  <p><b>landing_page.png</b></p>
</div>

<div align="center">
  <img src="https://github.com/Navadeep-Reddy/ProjectScreenshots/blob/main/FinadviceClient/credit-assesment.png?raw=true" alt="Credit Assessment" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;"/>
  <p><b>credit-assesment.png</b></p>
</div>

<div align="center">
  <img src="https://github.com/Navadeep-Reddy/ProjectScreenshots/blob/main/FinadviceClient/dashboard.png?raw=true" alt="Dashboard" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;"/>
  <p><b>dashboard.png</b></p>
</div>

<div align="center">
  <img src="https://github.com/Navadeep-Reddy/ProjectScreenshots/blob/main/FinadviceClient/decisionmaker.png?raw=true" alt="Decision Maker" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;"/>
  <p><b>decisionmaker.png</b></p>
</div>

<div align="center">
  <img src="https://github.com/Navadeep-Reddy/ProjectScreenshots/blob/main/FinadviceClient/transactions.png?raw=true" alt="Transactions" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;"/>
  <p><b>transactions.png</b></p>
</div>


## Features

*   **Unified Transaction Processing**: Seamlessly ingests data from Account Aggregators (Setu) and manual inputs so you have a single source of truth.
*   **Proactive Regulation Alerts**: Automatically monitors and interprets new financial regulations and government schemes relevant to your business.
*   **AI-Driven Forecasting**: Leverages Prophet ML models to predict cash flow trends and determine credit capacity on a weekly basis.
*   **Smart Decision Support**: Includes an LLM-powered assistant to help validate business expenses against your actual financial metrics.
*   **Comprehensive Dashboard**: Visualizes real-time financial health, transaction history, and credit potential.

## Architecture

### Transaction Flow
```mermaid
graph LR
    subgraph Sources
        Setu[Setu Account Aggregator]
        Manual[Manual Entry]
    end
    
    subgraph Messaging
        RMQ(RabbitMQ)
    end
    
    subgraph Processing
        Express[Express Service]
    end
    
    subgraph Storage
        DB[(PostgreSQL)]
    end

    Setu -->|Transaction Event| RMQ
    Manual -->|Transaction Entry| RMQ
    RMQ -->|Consume| Express
    Express -->|Standardize & Remove Uncertainty| DB
```

### Regulation Intelligence Flow
```mermaid
graph TD
    BrowseAI[Browse AI] -->|Regulations & Scheme Changes| RMQ(RabbitMQ)
    RMQ -->|Consume| FastAPI[FastAPI Backend]
    
    subgraph "Vector Search & Reasoning"
        FastAPI -->|Chunk Data| VectorDB[(pgVector)]
        VectorDB -->|Similarity Search| LLM[LLM Engine]
        LLM -->|Generate Actionable Outcomes| DB[(PostgreSQL)]
    end
```

### Forecasting Flow
```mermaid
graph TD
    Cron[Weekly Cronjob] -->|Trigger| Prophet[FastAPI + Prophet Model]
    DB[(PostgreSQL)] -->|Fetch Transactions| Prophet
    Prophet -->|Generate| CashForecast[Cash Forecast]
    CashForecast -->|Derive| CreditModel[Credit Capacity Model]
    CashForecast -->|Store| DB
    CreditModel -->|Store| DB
```

### Client Application Flow
```mermaid
graph TD
    User((User)) --> Client[Client App]
    
    subgraph "Data Access"
        Client -->|Fetch Insights & Credit Model| DB[(PostgreSQL)]
        Client -->|Fetch Transactions & Graphs| Supabase[(Supabase)]
    end
    
    subgraph "Decision Support"
        Client -->|Verify Spending| Assistant[LLM Assistant]
        Assistant -->|Tool Calls| Metrics[Financial Metrics]
    end
```
