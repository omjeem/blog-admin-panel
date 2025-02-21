import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="site-title" className="block text-sm font-medium text-gray-700">
                Site Title
              </label>
              <input
                type="text"
                id="site-title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="My Blog"
              />
            </div>
            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">
                Tagline
              </label>
              <input
                type="text"
                id="tagline"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="Just another WordPress site"
              />
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                id="timezone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="UTC"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700">
                Meta Description
              </label>
              <textarea
                id="meta-description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="A brief description of your site for search engines"
              />
            </div>
            <div>
              <label htmlFor="meta-keywords" className="block text-sm font-medium text-gray-700">
                Meta Keywords
              </label>
              <input
                type="text"
                id="meta-keywords"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue="blog, writing, technology"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Social Media</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                Twitter URL
              </label>
              <input
                type="url"
                id="twitter"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://twitter.com/yourusername"
              />
            </div>
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                Facebook URL
              </label>
              <input
                type="url"
                id="facebook"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                Instagram URL
              </label>
              <input
                type="url"
                id="instagram"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://instagram.com/youraccount"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}