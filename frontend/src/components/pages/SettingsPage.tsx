"use client";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[#2c2c2c]">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#2c2c2c]">Account Settings</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 py-4">
              <div>
                <p className="font-semibold text-gray-900">Change Password</p>
                <p className="text-sm text-gray-600">Update your password regularly for security</p>
              </div>
              <button className="rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-900 transition hover:bg-gray-200">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 py-4">
              <div>
                <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button className="rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-900 transition hover:bg-gray-200">
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#2c2c2c]">Notifications</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-semibold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <input type="checkbox" defaultChecked className="size-5 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-semibold text-gray-900">Assignment Updates</p>
                <p className="text-sm text-gray-600">Get notified about assignment status</p>
              </div>
              <input type="checkbox" defaultChecked className="size-5 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-8">
          <h2 className="text-2xl font-bold text-red-900">Danger Zone</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-red-900">Delete Account</p>
                <p className="text-sm text-red-700">This action cannot be undone</p>
              </div>
              <button className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
