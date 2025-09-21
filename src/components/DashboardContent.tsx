import React from 'react';
import { TrendingUp, DollarSign, CreditCard, Users, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const metrics = [
    {
      title: 'Gross volume',
      value: '$42,394.28',
      change: '+12.5%',
      trend: 'up',
      period: 'vs last month',
      icon: DollarSign,
    },
    {
      title: 'Net volume',
      value: '$38,472.83',
      change: '+8.2%',
      trend: 'up',
      period: 'vs last month',
      icon: TrendingUp,
    },
    {
      title: 'Payments',
      value: '1,429',
      change: '-2.1%',
      trend: 'down',
      period: 'vs last month',
      icon: CreditCard,
    },
    {
      title: 'Customers',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      period: 'vs last month',
      icon: Users,
    },
  ];

  const recentPayments = [
    { id: 'pi_1234567890', customer: 'Acme Corp', amount: '$2,500.00', status: 'succeeded', date: '2 hours ago' },
    { id: 'pi_0987654321', customer: 'TechStart Inc', amount: '$1,200.00', status: 'succeeded', date: '4 hours ago' },
    { id: 'pi_1122334455', customer: 'Design Studio', amount: '$890.00', status: 'processing', date: '6 hours ago' },
    { id: 'pi_5544332211', customer: 'Marketing Co', amount: '$3,400.00', status: 'succeeded', date: '8 hours ago' },
    { id: 'pi_9988776655', customer: 'Consulting LLC', amount: '$750.00', status: 'failed', date: '10 hours ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stripe-blue">
            Export
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-stripe-blue border border-transparent rounded-md hover:bg-stripe-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stripe-blue">
            Create payment
          </button>
        </div>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <metric.icon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
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

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-stripe-blue">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Chart placeholder</p>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Card payments</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">$32,450.00</div>
                <div className="text-xs text-gray-500">76.5%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Bank transfers</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">$8,230.00</div>
                <div className="text-xs text-gray-500">19.4%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Other</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">$1,714.28</div>
                <div className="text-xs text-gray-500">4.1%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent payments */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent payments</h3>
            <button className="text-sm text-stripe-blue hover:text-stripe-purple font-medium">
              View all
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'succeeded' 
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
