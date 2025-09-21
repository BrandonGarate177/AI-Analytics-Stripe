# Mock Data Structure Documentation

This directory contains comprehensive mock data for the TechFlow Solutions Stripe dashboard clone, designed to simulate a realistic B2B SaaS business with detailed analytics.

## Files Overview

### `mockData.json`
Main data file containing:
- **Business Overview**: Company metadata, KPIs, and summary metrics
- **Customers**: 5 detailed customer profiles with realistic business information
- **Transactions**: Payment history with various statuses and details
- **Products**: 4 subscription tiers with pricing and performance metrics
- **Revenue Trends**: Monthly time-series data for the past 9 months
- **Geographic Data**: Revenue breakdown by country with growth metrics
- **Customer Segments**: Enterprise, SMB, and Startup categorization
- **Payment Methods**: Breakdown of payment preferences

### `extendedTransactions.json`
Additional transaction records with:
- Detailed payment information (card brands, fees, net amounts)
- Various transaction statuses (succeeded, failed, processing, requires_action)
- Multiple currencies (USD, GBP, EUR, CAD)
- Different payment methods (card, bank_transfer, digital_wallet)

### `dataService.ts`
Comprehensive data access layer providing:
- **Type-safe interfaces** for all data structures
- **Query methods** for filtering and searching data
- **Analytics functions** for business insights
- **Formatting utilities** for currency, percentages, and dates
- **Aggregation methods** for complex business calculations

## Data Schema

### Customer Object
```typescript
{
  id: string;
  name: string;
  email: string;
  created: string; // ISO date
  country: string; // 2-letter country code
  industry: string;
  company_size: "Enterprise" | "SMB" | "Startup";
  lifetime_value: number;
  total_spent: number;
  subscription_status: "active" | "cancelled";
  current_plan: "basic" | "pro" | "enterprise";
  risk_score: "low" | "medium" | "high";
}
```

### Transaction Object
```typescript
{
  id: string;
  customer_id: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "processing" | "requires_action";
  created: string; // ISO date
  payment_method: "card" | "bank_transfer" | "digital_wallet";
  country: string;
  product_id: string;
  fee?: number;
  net?: number;
}
```

### Product Object
```typescript
{
  id: string;
  name: string;
  price: number;
  active_subscriptions: number;
  total_revenue: number;
  growth_rate: number; // percentage
  churn_rate: number; // percentage
  features: string[];
}
```

## Business Context

**TechFlow Solutions** is a fictional B2B SaaS company offering:

### Products
1. **Basic Plan** ($49/month) - Essential features for small teams
2. **Pro Plan** ($149/month) - Advanced features for growing businesses  
3. **Enterprise Package** ($499/month) - Full-featured solution for large organizations
4. **Pro + Add-ons** ($249/month) - Pro plan with additional services

### Key Metrics
- **Total Revenue**: $127,394.28 (+18.2% growth)
- **Customers**: 2,847 (+12.1% growth)
- **MRR**: $42,464.76
- **ARR**: $509,577.12
- **Churn Rate**: 3.2% (industry-leading)

### Geographic Presence
- **United States**: 52.8% of revenue
- **United Kingdom**: 18.4% of revenue
- **Canada**: 12.3% of revenue
- **Germany**: 10.1% of revenue
- **Australia**: 6.4% of revenue

## Usage in Chat Interface

The data service provides intelligent responses to user queries about:

- **Revenue Analysis**: Growth trends, top performers, geographic breakdown
- **Customer Insights**: Segmentation, churn analysis, risk assessment
- **Product Performance**: Subscription metrics, growth rates, feature analysis
- **Geographic Intelligence**: Market performance, expansion opportunities
- **Trend Forecasting**: Predictive analytics, growth projections
- **Risk Management**: Failed transactions, high-risk customers

## Example Queries

The AI assistant can answer questions like:
- "What's driving our revenue growth?"
- "Which products are performing best?"
- "Show me customer trends by segment"
- "What are our geographic opportunities?"
- "Which customers are at risk of churning?"
- "How are our payment methods performing?"

## Data Realism

The mock data includes realistic business scenarios:
- **Seasonal growth patterns** in monthly revenue
- **Geographic distribution** reflecting typical SaaS markets
- **Product performance** showing natural subscription tier adoption
- **Customer risk factors** based on payment history and engagement
- **Failed transactions** and retry scenarios
- **Currency variations** for international customers
- **Industry-specific** customer profiles and use cases

This comprehensive dataset enables the AI chat interface to provide meaningful, data-driven insights that would be valuable for actual business decision-making.
