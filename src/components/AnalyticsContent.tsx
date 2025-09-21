import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Filter, Download, Calendar, Send, MessageCircle, Bot, User } from 'lucide-react';
import dataService from '../data/dataService';
import openaiService from '../services/openaiService';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AnalyticsContent: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hi! I'm your analytics assistant. I have access to all your TechFlow Solutions business data. Ask me anything about your metrics, revenue trends, customer behavior, or business performance. For example, you could ask 'What's driving our revenue growth?' or 'Which products are performing best?'",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState<any>(null);

  useEffect(() => {
    // Load business data on component mount
    const overview = dataService.getBusinessOverview();
    const products = dataService.getProducts();
    const geoData = dataService.getGeographicData();
    const customers = dataService.getCustomers();
    const transactions = dataService.getTransactions();
    
    setBusinessData({
      overview,
      products,
      geoData,
      customers,
      transactions,
      revenueInsights: dataService.getRevenueInsights(),
      customerInsights: dataService.getCustomerInsights(),
      productInsights: dataService.getProductInsights(),
      geographicInsights: dataService.getGeographicInsights()
    });
  }, []);

  // Enhanced responses using real data
  const getDataDrivenResponse = (question: string): string => {
    if (!businessData) return "I'm still loading your data. Please try again in a moment.";
    
    const { overview, revenueInsights, customerInsights, productInsights, geographicInsights } = businessData;
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('revenue') || lowerQuestion.includes('sales')) {
      const topProducts = revenueInsights.top_products.slice(0, 3);
      const topCountries = revenueInsights.top_countries.slice(0, 3);
      
      return `📈 **TechFlow Solutions Revenue Analysis**\n\nYour revenue performance is excellent! Here's the breakdown:\n\n**Overall Performance:**\n• Total Revenue: ${dataService.formatCurrency(revenueInsights.total_revenue)}\n• Growth Rate: ${dataService.formatPercentage(revenueInsights.growth_rate)} vs last quarter\n• Monthly Recurring Revenue: ${dataService.formatCurrency(revenueInsights.mrr)}\n• Annual Run Rate: ${dataService.formatCurrency(revenueInsights.arr)}\n\n**Top Revenue Drivers:**\n${topProducts.map((p: any) => `• ${p.name}: ${dataService.formatCurrency(p.total_revenue)} (${dataService.formatPercentage(p.growth_rate)} growth)`).join('\n')}\n\n**Geographic Performance:**\n${topCountries.map((c: any) => `• ${c.country_name}: ${dataService.formatCurrency(c.revenue)} (${dataService.formatPercentage(c.percentage)} of total)`).join('\n')}\n\n**Key Insight:** Your Pro Plan is your strongest performer with exceptional growth, while Enterprise shows solid high-value customer acquisition.`;
    }
    
    if (lowerQuestion.includes('customer') || lowerQuestion.includes('user')) {
      const segments = customerInsights.segments;
      const highRiskCount = customerInsights.high_risk_count;
      
      return `👥 **Customer Intelligence Report**\n\nYour customer base is growing strongly with healthy metrics:\n\n**Customer Overview:**\n• Total Customers: ${customerInsights.total_customers.toLocaleString()}\n• Growth Rate: ${dataService.formatPercentage(customerInsights.growth_rate)} vs last month\n• Conversion Rate: ${dataService.formatPercentage(customerInsights.conversion_rate)}\n• Churn Rate: ${dataService.formatPercentage(customerInsights.churn_rate)} (excellent!)\n\n**Customer Segments:**\n${segments.map((s: any) => `• ${s.segment}: ${s.customer_count} customers, ${dataService.formatCurrency(s.revenue)} revenue (${dataService.formatPercentage(s.growth_rate)} growth)`).join('\n')}\n\n**Risk Management:**\n• High-risk customers: ${highRiskCount} (requires attention)\n• Overall retention is strong across all segments\n\n**Recommendation:** Focus on converting more Startup customers to SMB tier as they mature.`;
    }
    
    if (lowerQuestion.includes('product') || lowerQuestion.includes('plan')) {
      const products = productInsights.top_performing;
      const fastestGrowing = productInsights.fastest_growing;
      
      return `🚀 **Product Performance Analysis**\n\nYour product portfolio is performing excellently:\n\n**Revenue Leaders:**\n${products.map((p: any) => `• ${p.name}: ${dataService.formatCurrency(p.total_revenue)}\n  - ${p.active_subscriptions} active subscriptions\n  - ${dataService.formatPercentage(p.growth_rate)} growth rate\n  - ${dataService.formatPercentage(p.churn_rate)} churn rate`).join('\n\n')}\n\n**Growth Champions:**\n${fastestGrowing.slice(0, 2).map((p: any) => `• ${p.name}: ${dataService.formatPercentage(p.growth_rate)} growth`).join('\n')}\n\n**Key Insights:**\n• Pro Plan has optimal balance of volume and value\n• Enterprise shows premium positioning success\n• Add-on services have exceptional growth potential\n• Basic Plan provides solid customer acquisition funnel\n\n**Strategy:** Consider expanding add-on offerings and enterprise features.`;
    }
    
    if (lowerQuestion.includes('trend') || lowerQuestion.includes('forecast')) {
      const revenueGrowth = dataService.calculateRevenueGrowth();
      const recentTrend = dataService.getRecentRevenueTrend(3);
      
      return `📊 **Trend Analysis & Forecasting**\n\nYour business shows strong positive momentum:\n\n**Revenue Trends:**\n• Current month-over-month growth: ${dataService.formatPercentage(revenueGrowth)}\n• Quarterly growth rate: ${dataService.formatPercentage(overview.revenueGrowth)}\n• Average order value: ${dataService.formatCurrency(overview.avgOrderValue)}\n\n**Recent Performance:**\n${recentTrend.map((m: any) => `• ${m.month}: ${dataService.formatCurrency(m.revenue)} (${m.customers} customers)`).join('\n')}\n\n**Predictive Insights:**\n• Current trajectory suggests ${dataService.formatCurrency(overview.totalRevenue * 1.18)} potential next quarter\n• Customer acquisition is accelerating\n• Geographic diversification reducing risk\n• Product mix optimizing for higher value\n\n**Forecast:** Maintain current growth strategy while preparing infrastructure for scale.`;
    }
    
    if (lowerQuestion.includes('geography') || lowerQuestion.includes('location') || lowerQuestion.includes('country')) {
      const topCountries = geographicInsights.top_countries;
      
      return `🌍 **Geographic Revenue Intelligence**\n\nYour global presence is well-distributed with clear opportunities:\n\n**Market Performance:**\n${topCountries.map((c: any) => `• **${c.country_name}**: ${dataService.formatCurrency(c.revenue)}\n  - ${dataService.formatPercentage(c.percentage)} of total revenue\n  - ${c.customers} customers\n  - ${dataService.formatCurrency(c.avg_order_value)} average order value\n  - ${dataService.formatPercentage(c.growth_rate)} growth rate`).join('\n\n')}\n\n**Strategic Insights:**\n• US market dominance provides stability\n• UK shows excellent enterprise potential\n• Australia has highest growth rate - prime for expansion\n• Germany represents untapped EU opportunity\n• Canada provides solid North American coverage\n\n**Recommendations:**\n• Increase marketing investment in Australia and Germany\n• Consider EU-specific enterprise packages\n• Explore partnerships in high-growth markets`;
    }

    if (lowerQuestion.includes('failed') || lowerQuestion.includes('decline') || lowerQuestion.includes('problem')) {
      const failedTransactions = dataService.getFailedTransactions();
      const highRiskCustomers = dataService.getHighRiskCustomers();
      
      return `⚠️ **Risk Analysis & Problem Areas**\n\nHere are the areas requiring attention:\n\n**Failed Transactions:**\n• Total failed: ${failedTransactions.length} transactions\n• Most recent failures: ${failedTransactions.slice(0, 2).map(t => `${t.customer_name} (${dataService.formatCurrency(t.amount)})`).join(', ')}\n\n**High-Risk Customers:**\n• Count: ${highRiskCustomers.length} customers\n• Potential revenue at risk: ${dataService.formatCurrency(highRiskCustomers.reduce((sum, c) => sum + c.total_spent, 0))}\n\n**Churn Analysis:**\n• Overall churn rate: ${dataService.formatPercentage(overview.churnRate)} (industry-leading)\n• Highest risk segment: Startup customers\n\n**Action Items:**\n• Follow up on failed payments immediately\n• Implement retention campaigns for high-risk accounts\n• Consider payment method alternatives for international customers`;
    }
    
    // Default response for other questions
    return `🤖 **TechFlow Solutions Analytics**\n\nBased on your current data, here are the key highlights:\n\n**Business Health:**\n• Total Revenue: ${dataService.formatCurrency(overview.totalRevenue)} (${dataService.formatPercentage(overview.revenueGrowth)} growth)\n• Customer Base: ${overview.totalCustomers.toLocaleString()} customers (${dataService.formatPercentage(overview.customerGrowth)} growth)\n• Conversion Rate: ${dataService.formatPercentage(overview.conversionRate)}\n• Monthly Recurring Revenue: ${dataService.formatCurrency(overview.mrr)}\n\n**Top Insights:**\n• Pro Plan and Enterprise driving most revenue\n• Strong geographic diversification across 5 markets\n• Excellent customer retention and low churn\n• Healthy growth trajectory across all metrics\n\n**Question about "${question}":** I'd be happy to dive deeper into this specific area. Try asking about revenue drivers, customer segments, product performance, or geographic trends for detailed analysis!`;
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Step 1: Generate SQL query using OpenAI
      const sqlQuery = await openaiService.generateSQLQuery(currentQuestion);
      
      // Step 2: Execute the SQL query on our data (simplified frontend execution)
      const queryResults = executeQueryOnData(sqlQuery);
      
      // Step 3: Generate explanation using OpenAI
      const explanation = await openaiService.explainResults(sqlQuery, queryResults, currentQuestion);
      
      // Step 4: Create response with SQL query, results, and explanation
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `🤖 **AI Analysis Complete**\n\n**Generated SQL Query:**\n\`\`\`sql\n${sqlQuery}\n\`\`\`\n\n**Results:**\n${explanation}\n\n**Data Summary:**\n${JSON.stringify(queryResults, null, 2)}`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error processing question:', error);
      
      // Fallback to your existing data-driven response
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getDataDrivenResponse(currentQuestion),
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this helper function to execute queries on frontend data
  const executeQueryOnData = (sqlQuery: string): any[] => {
    if (!businessData) return [];
    
    // Simplified SQL execution - in a real app, this would be done on the backend
    // For now, we'll interpret common query patterns and return relevant data
    
    const lowerQuery = sqlQuery.toLowerCase();
    
    if (lowerQuery.includes('products') && lowerQuery.includes('revenue')) {
      return businessData.products.map((p: any) => ({
        product_name: p.name,
        total_revenue: p.total_revenue,
        customers: p.active_subscriptions,
        growth_rate: p.growth_rate
      }));
    }
    
    if (lowerQuery.includes('customers') && lowerQuery.includes('plan')) {
      const planGroups = businessData.customers.reduce((acc: any, customer: any) => {
        if (!acc[customer.current_plan]) {
          acc[customer.current_plan] = {
            current_plan: customer.current_plan,
            customer_count: 0,
            avg_spent: 0,
            total_spent: 0
          };
        }
        acc[customer.current_plan].customer_count++;
        acc[customer.current_plan].total_spent += customer.total_spent;
        return acc;
      }, {});
      
      return Object.values(planGroups).map((group: any) => ({
        ...group,
        avg_spent: group.total_spent / group.customer_count
      }));
    }
    
    if (lowerQuery.includes('country') || lowerQuery.includes('geographic')) {
      return businessData.geoData;
    }
    
    // Default: return overview metrics
    return [businessData.overview];
  };

  // Dynamic metrics from real data
  const analyticsMetrics = businessData ? [
    {
      title: 'Total Revenue',
      value: dataService.formatCurrency(businessData.overview.totalRevenue),
      change: `+${dataService.formatPercentage(businessData.overview.revenueGrowth)}`,
      trend: 'up',
      period: 'vs last quarter',
      icon: DollarSign,
    },
    {
      title: 'Conversion Rate',
      value: dataService.formatPercentage(businessData.overview.conversionRate),
      change: '+0.8%',
      trend: 'up',
      period: 'vs last month',
      icon: TrendingUp,
    },
    {
      title: 'Active Users',
      value: businessData.overview.totalCustomers.toLocaleString(),
      change: `+${dataService.formatPercentage(businessData.overview.customerGrowth)}`,
      trend: 'up',
      period: 'vs last month',
      icon: Users,
    },
    {
      title: 'Avg. Order Value',
      value: dataService.formatCurrency(businessData.overview.avgOrderValue),
      change: '-2.4%',
      trend: 'down',
      period: 'vs last month',
      icon: BarChart3,
    },
  ] : [];

  // Dynamic product and geographic data
  const topPerformingProducts = businessData ? businessData.products.map((product: any) => ({
    name: product.name,
    revenue: dataService.formatCurrency(product.total_revenue),
    growth: `+${dataService.formatPercentage(product.growth_rate)}`,
    customers: product.active_subscriptions
  })) : [];

  const geographicData = businessData ? businessData.geoData.map((geo: any) => ({
    country: geo.country_name,
    revenue: dataService.formatCurrency(geo.revenue),
    percentage: `${geo.percentage.toFixed(1)}%`
  })) : [];

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Deep insights into your business performance and growth metrics.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stripe-blue">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stripe-blue">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-stripe-blue border border-transparent rounded-md hover:bg-stripe-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stripe-blue">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-stripe-blue/10 rounded-lg">
                  <metric.icon className="w-5 h-5 text-stripe-blue" />
                </div>
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
              <p className="text-xs text-gray-400 mt-1">{metric.period}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Chat Interface */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-stripe-blue to-stripe-purple rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Chat with Your Metrics</h3>
            <span className="px-2 py-1 text-xs font-medium bg-stripe-blue/10 text-stripe-blue rounded-full">
              AI-Powered
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Ask questions about your analytics data and get instant insights</p>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-gray-100 ml-2' 
                    : 'bg-gradient-to-br from-stripe-blue to-stripe-purple mr-2'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`rounded-lg px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-stripe-blue text-white'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}>
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-stripe-blue/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stripe-blue to-stripe-purple flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmitMessage} className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask a question about your metrics... (e.g., 'What's driving our revenue growth?')"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stripe-blue focus:border-transparent placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-stripe-blue text-white rounded-lg hover:bg-stripe-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stripe-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
          
          {/* Suggested Questions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Try asking:</span>
            {['What\'s driving revenue growth?', 'Which products perform best?', 'Customer trends?', 'Geographic insights?'].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                disabled={isLoading}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-stripe-blue bg-stripe-blue/10 rounded-md">Revenue</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">Orders</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">Customers</button>
            </div>
          </div>
          <div className="h-80 bg-gradient-to-br from-stripe-blue/5 to-stripe-purple/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-stripe-blue/40" />
              <p className="text-gray-500 text-lg font-medium">Interactive Revenue Chart</p>
              <p className="text-gray-400 text-sm mt-2">Chart integration would go here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Products */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPerformingProducts.map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.customers} customers</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.revenue}</p>
                    <p className="text-sm text-green-600">{product.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Revenue */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Geography</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {geographicData.map((location: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-stripe-blue/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-stripe-blue">
                        {location.country.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{location.country}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{location.revenue}</p>
                    <p className="text-sm text-gray-500">{location.percentage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics</h3>
            <button className="text-sm text-stripe-blue hover:text-stripe-purple font-medium">
              View detailed report →
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Growth Analysis</h4>
              <p className="text-sm text-gray-600">Identify trends and growth opportunities in your data</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Customer Insights</h4>
              <p className="text-sm text-gray-600">Understand customer behavior and segmentation</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Predictive Analytics</h4>
              <p className="text-sm text-gray-600">AI-powered forecasting and recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsContent;
