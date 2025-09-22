import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export interface ChartData {
  type: 'bar' | 'line' | 'doughnut' | 'pie' | 'area';
  title: string;
  data: any;
  options: any;
}

export interface ChartRecommendation {
  chartType: 'bar' | 'line' | 'doughnut' | 'pie' | 'area';
  title: string;
  description: string;
  dataKey: string;
  xAxisKey?: string;
  yAxisKey?: string;
}

class ChartService {
  // Generate revenue analysis charts
  generateRevenueCharts(data: any): ChartData[] {
    const charts: ChartData[] = [];

    // Revenue by Product
    if (data.products && data.products.length > 0) {
      charts.push({
        type: 'bar',
        title: 'Revenue by Product',
        data: {
          labels: data.products.map((p: any) => p.name),
          datasets: [{
            label: 'Revenue ($)',
            data: data.products.map((p: any) => p.total_revenue),
            backgroundColor: [
              'rgba(99, 102, 241, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgba(99, 102, 241, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Revenue by Product',
              font: { size: 16, weight: 'bold' }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    // Revenue Growth Trend
    if (data.revenueByMonth && data.revenueByMonth.length > 0) {
      charts.push({
        type: 'line',
        title: 'Revenue Growth Trend',
        data: {
          labels: data.revenueByMonth.map((m: any) => m.month),
          datasets: [{
            label: 'Monthly Revenue ($)',
            data: data.revenueByMonth.map((m: any) => m.revenue),
            borderColor: 'rgba(99, 102, 241, 1)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Revenue Growth Trend',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    return charts;
  }

  // Generate customer analysis charts
  generateCustomerCharts(data: any): ChartData[] {
    const charts: ChartData[] = [];

    // Customer Segments
    if (data.customerSegments && data.customerSegments.length > 0) {
      charts.push({
        type: 'doughnut',
        title: 'Customer Distribution by Segment',
        data: {
          labels: data.customerSegments.map((s: any) => s.segment),
          datasets: [{
            data: data.customerSegments.map((s: any) => s.customer_count),
            backgroundColor: [
              'rgba(99, 102, 241, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
            ],
            borderColor: [
              'rgba(99, 102, 241, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Customer Distribution by Segment',
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              position: 'bottom',
            }
          }
        }
      });
    }

    // Customer Growth
    if (data.revenueByMonth && data.revenueByMonth.length > 0) {
      charts.push({
        type: 'line',
        title: 'Customer Growth Trend',
        data: {
          labels: data.revenueByMonth.map((m: any) => m.month),
          datasets: [{
            label: 'Total Customers',
            data: data.revenueByMonth.map((m: any) => m.customers),
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Customer Growth Trend',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    return charts;
  }

  // Generate geographic analysis charts
  generateGeographicCharts(data: any): ChartData[] {
    const charts: ChartData[] = [];

    if (data.geoData && data.geoData.length > 0) {
      // Revenue by Country
      charts.push({
        type: 'bar',
        title: 'Revenue by Country',
        data: {
          labels: data.geoData.map((g: any) => g.country_name),
          datasets: [{
            label: 'Revenue ($)',
            data: data.geoData.map((g: any) => g.revenue),
            backgroundColor: data.geoData.map((_: any, index: number) => 
              `hsl(${index * 60}, 70%, 60%)`
            ),
            borderColor: data.geoData.map((_: any, index: number) => 
              `hsl(${index * 60}, 70%, 40%)`
            ),
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Revenue by Country',
              font: { size: 16, weight: 'bold' }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });

      // Geographic Distribution Pie Chart
      charts.push({
        type: 'pie',
        title: 'Geographic Revenue Distribution',
        data: {
          labels: data.geoData.map((g: any) => g.country_name),
          datasets: [{
            data: data.geoData.map((g: any) => g.percentage),
            backgroundColor: data.geoData.map((_: any, index: number) => 
              `hsl(${index * 60}, 70%, 60%)`
            ),
            borderColor: data.geoData.map((_: any, index: number) => 
              `hsl(${index * 60}, 70%, 40%)`
            ),
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Geographic Revenue Distribution (%)',
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              position: 'bottom',
            }
          }
        }
      });
    }

    return charts;
  }

  // Generate product performance charts
  generateProductCharts(data: any): ChartData[] {
    const charts: ChartData[] = [];

    if (data.products && data.products.length > 0) {
      // Product Growth Rates
      charts.push({
        type: 'bar',
        title: 'Product Growth Rates',
        data: {
          labels: data.products.map((p: any) => p.name),
          datasets: [{
            label: 'Growth Rate (%)',
            data: data.products.map((p: any) => p.growth_rate),
            backgroundColor: data.products.map((p: any) => 
              p.growth_rate > 20 ? 'rgba(16, 185, 129, 0.8)' : 
              p.growth_rate > 10 ? 'rgba(245, 158, 11, 0.8)' : 
              'rgba(239, 68, 68, 0.8)'
            ),
            borderColor: data.products.map((p: any) => 
              p.growth_rate > 20 ? 'rgba(16, 185, 129, 1)' : 
              p.growth_rate > 10 ? 'rgba(245, 158, 11, 1)' : 
              'rgba(239, 68, 68, 1)'
            ),
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Product Growth Rates',
              font: { size: 16, weight: 'bold' }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                }
              }
            }
          }
        }
      });

      // Product Churn Rates
      charts.push({
        type: 'bar',
        title: 'Product Churn Rates',
        data: {
          labels: data.products.map((p: any) => p.name),
          datasets: [{
            label: 'Churn Rate (%)',
            data: data.products.map((p: any) => p.churn_rate),
            backgroundColor: data.products.map((p: any) => 
              p.churn_rate < 3 ? 'rgba(16, 185, 129, 0.8)' : 
              p.churn_rate < 5 ? 'rgba(245, 158, 11, 0.8)' : 
              'rgba(239, 68, 68, 0.8)'
            ),
            borderColor: data.products.map((p: any) => 
              p.churn_rate < 3 ? 'rgba(16, 185, 129, 1)' : 
              p.churn_rate < 5 ? 'rgba(245, 158, 11, 1)' : 
              'rgba(239, 68, 68, 1)'
            ),
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Product Churn Rates',
              font: { size: 16, weight: 'bold' }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }

    return charts;
  }

  // Generate transaction analysis charts
  generateTransactionCharts(data: any): ChartData[] {
    const charts: ChartData[] = [];

    if (data.transactions && data.transactions.length > 0) {
      // Transaction Status Distribution
      const statusGroups = data.transactions.reduce((acc: any, transaction: any) => {
        acc[transaction.status] = (acc[transaction.status] || 0) + 1;
        return acc;
      }, {});

      charts.push({
        type: 'doughnut',
        title: 'Transaction Status Distribution',
        data: {
          labels: Object.keys(statusGroups),
          datasets: [{
            data: Object.values(statusGroups),
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Transaction Status Distribution',
              font: { size: 16, weight: 'bold' }
            },
            legend: {
              position: 'bottom',
            }
          }
        }
      });
    }

    return charts;
  }

  // Main method to generate charts based on question type
  generateChartsForQuestion(question: string, businessData: any): ChartData[] {
    const lowerQuestion = question.toLowerCase();
    let charts: ChartData[] = [];

    // Determine chart types based on question
    if (lowerQuestion.includes('revenue') || lowerQuestion.includes('sales')) {
      charts = [...charts, ...this.generateRevenueCharts(businessData)];
    }

    if (lowerQuestion.includes('customer') || lowerQuestion.includes('user')) {
      charts = [...charts, ...this.generateCustomerCharts(businessData)];
    }

    if (lowerQuestion.includes('product') || lowerQuestion.includes('plan')) {
      charts = [...charts, ...this.generateProductCharts(businessData)];
    }

    if (lowerQuestion.includes('geographic') || lowerQuestion.includes('country') || lowerQuestion.includes('location')) {
      charts = [...charts, ...this.generateGeographicCharts(businessData)];
    }

    if (lowerQuestion.includes('transaction') || lowerQuestion.includes('payment')) {
      charts = [...charts, ...this.generateTransactionCharts(businessData)];
    }

    // If no specific charts generated, show overview
    if (charts.length === 0) {
      charts = [...this.generateRevenueCharts(businessData), ...this.generateCustomerCharts(businessData)];
    }

    return charts;
  }
}

export const chartService = new ChartService();
export default chartService;
