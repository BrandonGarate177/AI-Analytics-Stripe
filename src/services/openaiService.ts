class OpenAIService {
    private apiKey: string;
    private baseURL = 'https://api.openai.com/v1';
  
    constructor() {
      this.apiKey = process.env.REACT_APP_OPENAI_API || '';
      
      if (!this.apiKey) {
        console.warn('OpenAI API key not found. Please set REACT_APP_OPENAI_API in your .env.local file. Chat functionality will use mock responses.');
      }
    }
  
    // Business data context for analysis
    private getBusinessContext(): string {
      return `
  BUSINESS CONTEXT - TechFlow Solutions (B2B SaaS):
  
  COMPANY OVERVIEW:
  - Industry: B2B SaaS
  - Founded: 2020
  - Current Period: 2024-Q3
  - Total Customers: 2,847
  - Total Revenue: $127,394.28
  - Monthly Recurring Revenue: $42,464.76
  - Annual Run Rate: $509,577.12
  
  PRODUCT PORTFOLIO:
  - Basic Plan: $49/mo (892 active subscriptions, $28,940 revenue, 12.3% growth)
  - Pro Plan: $149/mo (1,247 active subscriptions, $45,230 revenue, 24.1% growth)
  - Enterprise: $499/mo (89 active subscriptions, $32,100 revenue, 18.7% growth)
  - Pro + Add-ons: $249/mo (456 active subscriptions, $21,124 revenue, 31.2% growth)
  
  CUSTOMER SEGMENTS:
  - Enterprise: 156 customers, $45,230 revenue, 2.1% churn rate
  - SMB: 1,834 customers, $67,890 revenue, 4.2% churn rate
  - Startup: 857 customers, $14,274 revenue, 6.8% churn rate
  
  GEOGRAPHIC DISTRIBUTION:
  - United States: 52.8% of revenue ($67,230)
  - United Kingdom: 18.4% of revenue ($23,451)
  - Canada: 12.3% of revenue ($15,670)
  - Germany: 10.1% of revenue ($12,890)
  - Australia: 6.4% of revenue ($8,155)
  
  KEY METRICS:
  - Overall Churn Rate: 3.2%
  - Conversion Rate: 3.24%
  - Average Order Value: $89.32
  - Customer Growth: 12.1% vs last month
  - Revenue Growth: 18.2% vs last quarter
      `;
    }
  
    private createAnalysisPrompt(userQuestion: string, businessData: any): string {
      return `You are a senior business analyst for TechFlow Solutions, a B2B SaaS company. 

${this.getBusinessContext()}

CURRENT BUSINESS DATA:
${JSON.stringify(businessData, null, 2)}

INSTRUCTIONS:
1. Analyze the user's question about the business data
2. Provide insights, trends, and actionable recommendations
3. Focus on business impact and strategic implications
4. Use specific metrics and percentages from the data
5. Identify key patterns, opportunities, and risks
6. Suggest next steps or areas for further investigation
7. Be concise but comprehensive in your analysis

USER QUESTION: "${userQuestion}"

ANALYSIS:`;
    }
  
    async analyzeBusinessData(userQuestion: string, businessData: any): Promise<{ analysis: string; isValid: boolean }> {
      // Validate question quality
      if (!this.isValidQuestion(userQuestion)) {
        return {
          analysis: `I'm sorry, but your question "${userQuestion}" is unclear or too short. Please provide more context or ask a specific question about your business metrics. For example:\n\n• "What's driving our revenue growth?"\n• "Which products are performing best?"\n• "Show me customer trends by geography"\n• "How are our different customer segments performing?"`,
          isValid: false
        };
      }

      if (!this.apiKey) {
        // Fallback for development without API key
        return {
          analysis: this.generateMockAnalysis(userQuestion, businessData),
          isValid: true
        };
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
                content: 'You are a senior business analyst. Provide clear, actionable insights from data analysis. Focus on business impact, trends, and recommendations. Use professional language with specific metrics and percentages when available. If the question is unclear or not related to business analytics, politely ask for clarification.'
              },
              {
                role: 'user',
                content: this.createAnalysisPrompt(userQuestion, businessData)
              }
            ],
            max_tokens: 800,
            temperature: 0.3
          })
        });
  
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
  
        const data = await response.json();
        const analysis = data.choices[0]?.message?.content?.trim() || 'Analysis completed successfully.';
        
        // Check if the response indicates the question was unclear
        const isUnclearResponse = this.isUnclearResponse(analysis);
        
        return {
          analysis,
          isValid: !isUnclearResponse
        };
        
      } catch (error) {
        console.error('OpenAI API Error:', error);
        // Fallback to mock analysis
        return {
          analysis: this.generateMockAnalysis(userQuestion, businessData),
          isValid: true
        };
      }
    }

    // Validate if the question is meaningful for business analysis
    private isValidQuestion(question: string): boolean {
      const trimmed = question.trim();
      
      // Too short or empty
      if (trimmed.length < 3) return false;
      
      // Common unclear patterns
      const unclearPatterns = [
        /^[a-z]{1,5}$/i, // Single words like "hello", "hi", "test"
        /^[^a-zA-Z]*$/, // No letters
        /^(what|how|why|when|where)\s*$/, // Just question words
        /^(yes|no|ok|okay|thanks|thank you)\s*$/i, // Simple responses
      ];
      
      return !unclearPatterns.some(pattern => pattern.test(trimmed));
    }

    // Check if the LLM response indicates the question was unclear
    private isUnclearResponse(response: string): boolean {
      const unclearIndicators = [
        'unclear',
        'not clear',
        'unclear question',
        'please clarify',
        'provide more context',
        'not specific enough',
        'apologies, but',
        'could you please provide more context',
        'could you clarify',
        'more information needed'
      ];
      
      const lowerResponse = response.toLowerCase();
      return unclearIndicators.some(indicator => lowerResponse.includes(indicator));
    }
  
    // Fallback analysis generation for development
    private generateMockAnalysis(userQuestion: string, businessData: any): string {
      const lowerQuestion = userQuestion.toLowerCase();
      
      if (lowerQuestion.includes('revenue') && lowerQuestion.includes('growth')) {
        return `📈 **Revenue Growth Analysis**

Your revenue performance shows strong growth across all product lines:

**Key Findings:**
• Pro Plan leads with 24.1% growth rate and $45,230 revenue
• Pro + Add-ons shows exceptional 31.2% growth rate
• Enterprise maintains solid 18.7% growth with high-value customers
• Basic Plan shows steady 12.3% growth for market penetration

**Strategic Insights:**
• Pro tier products are your primary growth drivers
• Add-on services have the highest growth potential
• Enterprise segment provides revenue stability
• Consider expanding Pro + Add-ons features

**Recommendations:**
• Invest more in Pro Plan marketing and features
• Develop additional add-on services
• Focus on converting Basic to Pro customers
• Maintain Enterprise customer satisfaction`;
      }
      
      if (lowerQuestion.includes('customer') && (lowerQuestion.includes('segment') || lowerQuestion.includes('plan'))) {
        return `👥 **Customer Segment Analysis**

Your customer base shows healthy distribution across segments:

**Segment Performance:**
• SMB: 1,834 customers (64.4%) - $67,890 revenue
• Startup: 857 customers (30.1%) - $14,274 revenue  
• Enterprise: 156 customers (5.5%) - $45,230 revenue

**Key Insights:**
• SMB segment provides volume and revenue stability
• Enterprise customers have highest revenue per customer
• Startup segment shows growth potential but higher churn
• Enterprise has lowest churn rate at 2.1%

**Recommendations:**
• Focus on SMB retention and expansion
• Develop startup-to-SMB upgrade path
• Maintain Enterprise customer satisfaction
• Consider startup-specific features`;
      }
      
      if (lowerQuestion.includes('geographic') || lowerQuestion.includes('country')) {
        return `🌍 **Geographic Revenue Analysis**

Your global presence shows strong market diversification:

**Market Performance:**
• United States: 52.8% of revenue ($67,230) - Primary market
• United Kingdom: 18.4% of revenue ($23,451) - Strong secondary market
• Canada: 12.3% of revenue ($15,670) - Solid North American coverage
• Germany: 10.1% of revenue ($12,890) - EU market opportunity
• Australia: 6.4% of revenue ($8,155) - High growth potential

**Strategic Insights:**
• US market dominance provides revenue stability
• UK shows strong enterprise adoption
• Germany represents untapped EU potential
• Australia has highest growth rate (28.3%)

**Recommendations:**
• Maintain US market leadership
• Expand EU presence through Germany
• Increase investment in Australian market
• Consider local partnerships in key markets`;
      }
      
      // Default analysis
      return `📊 **Business Overview Analysis**

Based on your current data, here are the key business insights:

**Overall Performance:**
• Total Revenue: $127,394.28 (18.2% growth)
• Customer Base: 2,847 customers (12.1% growth)
• Monthly Recurring Revenue: $42,464.76
• Churn Rate: 3.2% (industry-leading)

**Key Strengths:**
• Strong revenue growth across all segments
• Excellent customer retention
• Diversified geographic presence
• Healthy product portfolio

**Areas for Focus:**
• Continue Pro Plan growth momentum
• Expand add-on services
• Optimize startup-to-SMB conversion
• Explore new geographic markets`;
    }
  
  }
  
  export const openaiService = new OpenAIService();
  export default openaiService;