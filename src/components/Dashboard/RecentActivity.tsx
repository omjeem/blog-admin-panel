import React from 'react';
import { FileText, MessageSquare, User } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'post',
    title: 'New blog post published',
    description: '"10 Tips for Better Writing" has been published',
    time: '2 hours ago',
    icon: FileText,
  },
  {
    id: 2,
    type: 'comment',
    title: 'New comment received',
    description: 'John Doe commented on "Getting Started with React"',
    time: '4 hours ago',
    icon: MessageSquare,
  },
  {
    id: 3,
    type: 'user',
    title: 'New user registered',
    description: 'Sarah Smith joined as an author',
    time: '6 hours ago',
    icon: User,
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="mt-6 flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== activities.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-indigo-600" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}