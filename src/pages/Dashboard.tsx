"use client"
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
import axios from 'axios';
import { BACKEND_URL } from '../utils';
import { useEffect, useState } from 'react';

const data = [
  { name: 'Jan', views: 4000, comments: 2400 },
  { name: 'Feb', views: 3000, comments: 1398 },
  { name: 'Mar', views: 2000, comments: 9800 },
  { name: 'Apr', views: 2780, comments: 3908 },
  { name: 'May', views: 1890, comments: 4800 },
  { name: 'Jun', views: 2390, comments: 3800 },
];

export interface MetaTitleInterface {
  _id: String,
  title: String,
  createdAt: String,
  description : String
}
interface MetaDataInterface {
  posts: Number,
  comments: Number,
  tags: Number,
  media: Number,
  recent: MetaTitleInterface[]
}

const metaDataInitial: MetaDataInterface = {
  posts: 156,
  comments: 20,
  tags: 50,
  media: 100,
  recent: [
    {
      _id: "1",
      title: "Why The Boys TV Show Is Better Than the Comics",
      createdAt: "2025-02-28T11:49:33.191Z",
      description : "Dummy"
    },
    {
      _id: "2",
      title: "Megas XLR: The Gundam Love Letter We Didn’t Know We Needed",
      createdAt: "2025-02-28T11:28:52.381Z",
      description : "Dummy"
    }
  ]
}

function Dashboard() {
  const [metaData, setMetaData] = useState<MetaDataInterface>(metaDataInitial)

  async function fetchMetaData() {
    try {
      const response = await axios.get(`${BACKEND_URL}/meta`)
      const data = response.data
      setMetaData(data)
    } catch (err: any) {
      console.log("Error while fetching details", err.message)
    }
  }

  useEffect(() => {
    fetchMetaData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value={metaData.posts.toString()}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Comments"
          value={metaData.comments.toString()}
          icon={MessageSquare}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Authors & Tags"
          value={metaData.tags.toString()}
          icon={Tags}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Media Files"
          value={metaData.media.toString()}
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
        <RecentActivity activities={metaData.recent} />
      </div>
    </div>
  );
}

export default Dashboard;