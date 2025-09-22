import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Filter, Download, Calendar, Send, MessageCircle, Bot, User } from 'lucide-react';
import dataService from '../data/dataService';
import openaiService from '../services/openaiService';
import chartService, { ChartData } from '../services/chartService';
import ChartComponent from './ChartComponent';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  charts?: ChartData[];
}

const AnalyticsContent: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your analytics assistant. I have access to all your TechFlow Solutions business data and can generate interactive charts to visualize your insights.\n\n**Ask me specific questions about:**\n• Revenue trends and growth drivers\n• Customer segments and behavior\n• Product performance and metrics\n• Geographic distribution\n• Transaction analysis\n\n**Example questions:**\n• \"What's driving our revenue growth?\"\n• \"Which products are performing best?\"\n• \"Show me customer trends by geography\"\n• \"How are our different customer segments performing?\"\n\nI'll provide detailed analysis and generate relevant charts to help you understand your data better!",
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
      // Step 1: Generate AI analysis
      const analysisResult = await openaiService.analyzeBusinessData(currentQuestion, businessData);
      
      // Step 2: Only generate charts if the analysis is valid
      let charts: ChartData[] = [];
      if (analysisResult.isValid) {
        charts = chartService.generateChartsForQuestion(currentQuestion, businessData);
      }
      
      // Step 3: Create response with analysis and charts (only if valid)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: analysisResult.analysis,
        timestamp: new Date(),
        charts: charts
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error processing question:', error);
      
      // Determine error type and provide appropriate response
      let errorMessage = '';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = `**API Configuration Required**\n\nTo use the AI-powered analytics, please:\n\n1. Create a \`.env.local\` file in your project root\n2. Add your OpenAI API key: \`REACT_APP_OPENAI_API_KEY=your-api-key-here\`\n3. Restart your development server\n\n**Please try asking a specific question about your business metrics.**`;
        } else if (error.message.includes('API error')) {
          errorMessage = `**API Error**\n\nThere was an issue connecting to the AI service. This might be due to:\n\n• Network connectivity issues\n• API rate limiting\n• Invalid API key\n\n**Please try again with a specific question about your business metrics.**`;
        } else {
          errorMessage = `**Processing Error**\n\nAn unexpected error occurred while processing your question.\n\n**Error:** ${error.message}\n\n**Please try rephrasing your question or ask about specific metrics like revenue, customers, or products.**`;
        }
      } else {
        errorMessage = `**Unknown Error**\n\nAn unexpected error occurred. Please try again.\n\n**Please ask a specific question about your business metrics.**`;
      }
      
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: errorMessage,
        timestamp: new Date()
        // No charts for error responses
      };
      
      setChatMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
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
              
              {/* Charts for assistant messages */}
              {message.type === 'assistant' && message.charts && message.charts.length > 0 && (
                <div className="w-full mt-4 space-y-4">
                  {message.charts.map((chart, index) => (
                    <ChartComponent key={index} chartData={chart} />
                  ))}
                </div>
              )}
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
