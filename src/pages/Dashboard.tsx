import React from 'react';
import { FileText, MessageSquare, Tags, Image } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', views: 4000, comments: 2400 },
  { name: 'Feb', views: 3000, comments: 1398 },
  { name: 'Mar', views: 2000, comments: 9800 },
  { name: 'Apr', views: 2780, comments: 3908 },
  { name: 'May', views: 1890, comments: 4800 },
  { name: 'Jun', views: 2390, comments: 3800 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value="156"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Comments"
          value="2,345"
          icon={MessageSquare}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Categories & Tags"
          value="48"
          icon={Tags}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Media Files"
          value="892"
          icon={Image}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}