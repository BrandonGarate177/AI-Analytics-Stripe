class OpenAIService {
    private apiKey: string;
    private baseURL = 'https://api.openai.com/v1';
  
    constructor() {
      this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
      
      if (!this.apiKey) {
        console.warn('OpenAI API key not found. Chat functionality will use mock responses.');
      }
    }
  
    // Database schema for context
    private getDatabaseSchema(): string {
      return `
  DATABASE SCHEMA:
  - customers: id, name, email, created, country, industry, company_size, lifetime_value, total_spent, subscription_status, current_plan, risk_score
  - transactions: id, customer_id, amount, currency, status, created, description, payment_method, country, product_id
  - products: id, name, price, active_subscriptions, total_revenue, growth_rate, churn_rate
  - revenue_by_month: month, revenue, customers, transactions
  - revenue_by_geography: country, country_name, revenue, percentage, customers, avg_order_value, growth_rate
  - customer_segments: segment, customer_count, revenue, avg_lifetime_value, churn_rate, growth_rate
  
  BUSINESS CONTEXT:
  - Company: TechFlow Solutions (B2B SaaS)
  - Plans: Basic ($49/mo), Pro ($149/mo), Enterprise ($499/mo), Pro + Add-ons ($249/mo)
  - Current period: 2024-Q3
  - Total customers: 2,847
  - Total revenue: $127,394.28
      `;
    }
  
    private createPrompt(userQuestion: string): string {
      return `You are an SQL expert for TechFlow Solutions, a B2B SaaS company. 
  
  ${this.getDatabaseSchema()}
  
  INSTRUCTIONS:
  1. Convert the user's question into a SQL query that answers their question
  2. Use proper SQL syntax with table joins when needed
  3. Focus on business metrics: revenue, growth, customers, churn, geographic distribution
  4. Return ONLY the SQL query, no explanations or formatting
  5. Use appropriate aggregations (SUM, COUNT, AVG) and date functions
  6. For growth calculations, compare current vs previous periods
  7. Limit results to top 10 unless specified otherwise
  
  USER QUESTION: "${userQuestion}"
  
  SQL QUERY:`;
    }
  
    async generateSQLQuery(userQuestion: string): Promise<string> {
      if (!this.apiKey) {
        // Fallback for development without API key
        return this.generateMockSQL(userQuestion);
      }
  
      try {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are an expert SQL analyst. Return only SQL queries, no explanations.'
              },
              {
                role: 'user',
                content: this.createPrompt(userQuestion)
              }
            ],
            max_tokens: 500,
            temperature: 0.1 // Low temperature for consistent SQL generation
          })
        });
  
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
  
        const data = await response.json();
        const sqlQuery = data.choices[0]?.message?.content?.trim() || '';
        
        // Clean up the SQL query (remove code block formatting if present)
        return sqlQuery.replace(/```sql\n?|```\n?/g, '').trim();
        
      } catch (error) {
        console.error('OpenAI API Error:', error);
        // Fallback to mock SQL generation
        return this.generateMockSQL(userQuestion);
      }
    }
  
    // Fallback SQL generation for development
    private generateMockSQL(userQuestion: string): string {
      const lowerQuestion = userQuestion.toLowerCase();
      
      if (lowerQuestion.includes('revenue') && lowerQuestion.includes('growth')) {
        return `
          SELECT 
            p.name as product_name,
            SUM(t.amount) as total_revenue,
            COUNT(DISTINCT t.customer_id) as customers,
            (SUM(t.amount) / LAG(SUM(t.amount)) OVER (ORDER BY p.name) - 1) * 100 as growth_rate
          FROM transactions t
          JOIN products p ON t.product_id = p.id
          WHERE t.status = 'succeeded'
          GROUP BY p.name
          ORDER BY growth_rate DESC
          LIMIT 5;
        `.trim();
      }
      
      if (lowerQuestion.includes('customer') && (lowerQuestion.includes('segment') || lowerQuestion.includes('plan'))) {
        return `
          SELECT 
            current_plan,
            COUNT(*) as customer_count,
            AVG(total_spent) as avg_spent,
            AVG(lifetime_value) as avg_lifetime_value
          FROM customers
          WHERE subscription_status = 'active'
          GROUP BY current_plan
          ORDER BY customer_count DESC;
        `.trim();
      }
      
      if (lowerQuestion.includes('geographic') || lowerQuestion.includes('country')) {
        return `
          SELECT 
            country,
            COUNT(*) as customers,
            SUM(total_spent) as revenue,
            AVG(total_spent) as avg_order_value
          FROM customers
          GROUP BY country
          ORDER BY revenue DESC
          LIMIT 10;
        `.trim();
      }
      
      // Default query
      return `
        SELECT 
          COUNT(*) as total_customers,
          SUM(total_spent) as total_revenue,
          AVG(total_spent) as avg_order_value
        FROM customers
        WHERE subscription_status = 'active';
      `.trim();
    }
  
    // Generate natural language explanation of results
    async explainResults(sqlQuery: string, results: any[], originalQuestion: string): Promise<string> {
      if (!this.apiKey) {
        return this.generateMockExplanation(results, originalQuestion);
      }
  
      try {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are a business analyst. Explain query results in a clear, professional manner with key insights.'
              },
              {
                role: 'user',
                content: `
                  Question: "${originalQuestion}"
                  SQL Query: ${sqlQuery}
                  Results: ${JSON.stringify(results, null, 2)}
                  
                  Please provide a clear business explanation of these results, highlighting key insights and actionable recommendations.
                `
              }
            ],
            max_tokens: 300,
            temperature: 0.3
          })
        });
  
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
  
        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || 'Analysis completed successfully.';
        
      } catch (error) {
        console.error('OpenAI API Error:', error);
        return this.generateMockExplanation(results, originalQuestion);
      }
    }
  
    private generateMockExplanation(results: any[], originalQuestion: string): string {
      return `Based on your question "${originalQuestion}", here are the key insights from your data:\n\n${JSON.stringify(results, null, 2)}`;
    }
  }
  
  export const openaiService = new OpenAIService();
  export default openaiService;