import { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CubeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { DashboardStats } from "../../types/admin";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Loader from "../../components/ui/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data
const mockData: DashboardStats = {
  totalSales: 15680,
  totalOrders: 156,
  totalUsers: 432,
  totalProducts: 89,
  recentOrders: [
    {
      id: 1,
      orderNumber: "ORD-2023-001",
      customer: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      },
      products: [
        {
          id: 1,
          name: "Snake Plant",
          quantity: 2,
          price: 29.99,
        },
      ],
      totalAmount: 59.98,
      status: "delivered",
      paymentStatus: "paid",
      createdAt: "2023-10-15T08:30:00Z",
      updatedAt: "2023-10-16T14:20:00Z",
      shippingAddress: {
        street: "123 Main St",
        city: "Anytown",
        state: "ST",
        zipCode: "12345",
        country: "Country",
      },
    },
    {
      id: 2,
      orderNumber: "ORD-2023-002",
      customer: {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
      },
      products: [
        {
          id: 3,
          name: "Monstera Deliciosa",
          quantity: 1,
          price: 49.99,
        },
      ],
      totalAmount: 49.99,
      status: "shipped",
      paymentStatus: "paid",
      createdAt: "2023-10-16T10:15:00Z",
      updatedAt: "2023-10-17T09:30:00Z",
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Somewhere",
        state: "ST",
        zipCode: "67890",
        country: "Country",
      },
    },
  ],
  topProducts: [
    {
      id: 1,
      name: "Snake Plant",
      sales: 42,
      revenue: 1259.58,
    },
    {
      id: 2,
      name: "Fiddle Leaf Fig",
      sales: 38,
      revenue: 1139.62,
    },
    {
      id: 3,
      name: "Monstera Deliciosa",
      sales: 35,
      revenue: 1749.65,
    },
  ],
  salesByMonth: [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 1900 },
    { month: "Mar", sales: 2400 },
    { month: "Apr", sales: 1800 },
    { month: "May", sales: 2100 },
    { month: "Jun", sales: 1700 },
    { month: "Jul", sales: 1900 },
    { month: "Aug", sales: 2300 },
    { month: "Sep", sales: 2500 },
    { month: "Oct", sales: 2800 },
    { month: "Nov", sales: 3200 },
    { month: "Dec", sales: 3500 },
  ],
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Using mock data for now
        setTimeout(() => {
          setStats(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader size="lg" text="Loading dashboard data..." />;
  }

  if (!stats) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-medium text-gray-900">Overview</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          change={12}
          color="text-green-600"
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders.toString()}
          icon={<ShoppingBagIcon className="h-6 w-6" />}
          change={8}
          color="text-blue-600"
        />
        <StatCard
          title="Customers"
          value={stats.totalUsers.toString()}
          icon={<UserGroupIcon className="h-6 w-6" />}
          change={5}
          color="text-purple-600"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts.toString()}
          icon={<CubeIcon className="h-6 w-6" />}
          change={-2}
          color="text-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sales Overview
          </h3>
          <div className="h-72">
            <Bar
              data={{
                labels: stats.salesByMonth.map((item) => item.month),
                datasets: [
                  {
                    label: "Monthly Sales",
                    data: stats.salesByMonth.map((item) => item.sales),
                    backgroundColor: "rgb(88, 167, 17, 0.8)",
                    borderColor: "rgb(88, 167, 17)",
                    borderWidth: 1,
                    borderRadius: 4,
                    hoverBackgroundColor: "rgb(88, 167, 17)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    titleFont: {
                      size: 13,
                    },
                    bodyFont: {
                      size: 12,
                    },
                    padding: 10,
                    displayColors: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(229, 231, 235, 0.5)",
                    },
                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Products
          </h3>
          <div className="space-y-4">
            {stats.topProducts.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} units</p>
                </div>
                <p className="font-medium text-green-600">
                  ${product.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
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

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  color: string;
}

const StatCard = ({ title, value, icon, change, color }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
          {Math.abs(change)}%
        </span>
        <span className="ml-1 text-sm text-gray-500">vs last month</span>
      </div>
    </div>
  );
};

export default Dashboard;
