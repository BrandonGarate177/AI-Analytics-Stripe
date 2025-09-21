import mockData from './mockData.json';
import extendedTransactions from './extendedTransactions.json';

export interface BusinessMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalCustomers: number;
  customerGrowth: number;
  avgOrderValue: number;
  conversionRate: number;
  churnRate: number;
  mrr: number;
  arr: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  created: string;
  country: string;
  industry: string;
  company_size: string;
  lifetime_value: number;
  total_spent: number;
  subscription_status: string;
  current_plan: string;
  risk_score: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  customer_name?: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  description: string;
  payment_method: string;
  country: string;
  product_id: string;
  fee?: number;
  net?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  active_subscriptions: number;
  total_revenue: number;
  growth_rate: number;
  churn_rate: number;
  features: string[];
}

export interface GeographicData {
  country: string;
  country_name: string;
  revenue: number;
  percentage: number;
  customers: number;
  avg_order_value: number;
  growth_rate: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  customers: number;
  transactions: number;
}

class DataService {
  // Get overall business metrics
  getBusinessOverview(): BusinessMetrics {
    const current = mockData.metrics_summary.current_month;
    return {
      totalRevenue: current.revenue,
      revenueGrowth: current.revenue_growth,
      totalCustomers: current.customers,
      customerGrowth: current.customer_growth,
      avgOrderValue: current.avg_order_value,
      conversionRate: current.conversion_rate,
      churnRate: mockData.business_overview.churn_rate,
      mrr: mockData.business_overview.mrr,
      arr: mockData.business_overview.arr
    };
  }

  // Get all customers
  getCustomers(): Customer[] {
    return mockData.customers;
  }

  // Get customer by ID
  getCustomerById(customerId: string): Customer | undefined {
    return mockData.customers.find(customer => customer.id === customerId);
  }

  // Get customers by country
  getCustomersByCountry(country: string): Customer[] {
    return mockData.customers.filter(customer => 
      customer.country.toLowerCase() === country.toLowerCase()
    );
  }

  // Get customers by plan
  getCustomersByPlan(plan: string): Customer[] {
    return mockData.customers.filter(customer => 
      customer.current_plan.toLowerCase() === plan.toLowerCase()
    );
  }

  // Get high-risk customers
  getHighRiskCustomers(): Customer[] {
    return mockData.customers.filter(customer => customer.risk_score === 'high');
  }

  // Get all transactions
  getTransactions(): Transaction[] {
    return [...mockData.transactions, ...extendedTransactions];
  }

  // Get transactions by status
  getTransactionsByStatus(status: string): Transaction[] {
    const allTransactions = this.getTransactions();
    return allTransactions.filter(transaction => 
      transaction.status.toLowerCase() === status.toLowerCase()
    );
  }

  // Get transactions by customer
  getTransactionsByCustomer(customerId: string): Transaction[] {
    const allTransactions = this.getTransactions();
    return allTransactions.filter(transaction => transaction.customer_id === customerId);
  }

  // Get transactions by date range
  getTransactionsByDateRange(startDate: string, endDate: string): Transaction[] {
    const allTransactions = this.getTransactions();
    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.created);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  }

  // Get failed transactions
  getFailedTransactions(): Transaction[] {
    return this.getTransactionsByStatus('failed');
  }

  // Get successful transactions
  getSuccessfulTransactions(): Transaction[] {
    return this.getTransactionsByStatus('succeeded');
  }

  // Get all products
  getProducts(): Product[] {
    return mockData.products;
  }

  // Get top performing products
  getTopPerformingProducts(limit: number = 5): Product[] {
    return mockData.products
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, limit);
  }

  // Get products by growth rate
  getProductsByGrowth(limit: number = 5): Product[] {
    return mockData.products
      .sort((a, b) => b.growth_rate - a.growth_rate)
      .slice(0, limit);
  }

  // Get geographic revenue data
  getGeographicData(): GeographicData[] {
    return mockData.revenue_by_geography;
  }

  // Get top countries by revenue
  getTopCountriesByRevenue(limit: number = 5): GeographicData[] {
    return mockData.revenue_by_geography
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  // Get revenue trends
  getRevenueByMonth(): RevenueByMonth[] {
    return mockData.revenue_by_month;
  }

  // Get recent revenue trend
  getRecentRevenueTrend(months: number = 6): RevenueByMonth[] {
    return mockData.revenue_by_month.slice(-months);
  }

  // Calculate revenue growth
  calculateRevenueGrowth(): number {
    const revenueData = mockData.revenue_by_month;
    if (revenueData.length < 2) return 0;
    
    const current = revenueData[revenueData.length - 1].revenue;
    const previous = revenueData[revenueData.length - 2].revenue;
    
    return ((current - previous) / previous) * 100;
  }

  // Get customer segments
  getCustomerSegments() {
    return mockData.customer_segments;
  }

  // Get payment method breakdown
  getPaymentMethodBreakdown() {
    return mockData.metrics_summary.payment_methods;
  }

  // Search functionality
  searchCustomers(query: string): Customer[] {
    const lowerQuery = query.toLowerCase();
    return mockData.customers.filter(customer =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.industry.toLowerCase().includes(lowerQuery)
    );
  }

  // Analytics queries
  getTotalRevenue(): number {
    return mockData.business_overview.total_revenue;
  }

  getTotalCustomers(): number {
    return mockData.business_overview.total_customers;
  }

  getActiveSubscriptions(): number {
    return mockData.business_overview.active_subscriptions;
  }

  getChurnRate(): number {
    return mockData.business_overview.churn_rate;
  }

  getMRR(): number {
    return mockData.business_overview.mrr;
  }

  getARR(): number {
    return mockData.business_overview.arr;
  }

  // Get insights for specific questions
  getRevenueInsights(): any {
    const overview = this.getBusinessOverview();
    const topProducts = this.getTopPerformingProducts(3);
    const topCountries = this.getTopCountriesByRevenue(3);
    
    return {
      total_revenue: overview.totalRevenue,
      growth_rate: overview.revenueGrowth,
      top_products: topProducts,
      top_countries: topCountries,
      mrr: overview.mrr,
      arr: overview.arr
    };
  }

  getCustomerInsights(): any {
    const overview = this.getBusinessOverview();
    const segments = this.getCustomerSegments();
    const highRisk = this.getHighRiskCustomers();
    
    return {
      total_customers: overview.totalCustomers,
      growth_rate: overview.customerGrowth,
      conversion_rate: overview.conversionRate,
      churn_rate: overview.churnRate,
      segments: segments,
      high_risk_count: highRisk.length
    };
  }

  getProductInsights(): any {
    const products = this.getProducts();
    const topPerforming = this.getTopPerformingProducts();
    const fastestGrowing = this.getProductsByGrowth();
    
    return {
      total_products: products.length,
      top_performing: topPerforming,
      fastest_growing: fastestGrowing,
      total_subscriptions: products.reduce((sum, p) => sum + p.active_subscriptions, 0)
    };
  }

  getGeographicInsights(): any {
    const geoData = this.getGeographicData();
    const topCountries = this.getTopCountriesByRevenue();
    
    return {
      total_countries: geoData.length,
      top_countries: topCountries,
      geographic_distribution: geoData
    };
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Format percentage
  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

export const dataService = new DataService();
export default dataService;
