"use client";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2c2c2c]">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your profile settings</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-5 border-b border-gray-200 pb-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffd4c4_0%,#f28b6c_44%,#1f2933_45%,#111827_100%)] text-xl font-bold text-white">
              JD
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2c2c2c]">John Doe</h2>
              <p className="text-gray-600">Teacher</p>
              <p className="text-sm text-gray-500">john.doe@example.com</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <p className="mt-1 text-gray-900">John Doe</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">john.doe@example.com</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">School</label>
              <p className="mt-1 text-gray-900">Delhi Public School, Bokaro Steel City</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Role</label>
              <p className="mt-1 text-gray-900">Teacher</p>
            </div>
          </div>

          {/* Edit Button */}
          <div className="pt-4">
            <button className="rounded-lg bg-[#f07a56] px-6 py-3 font-semibold text-white transition hover:bg-[#e85a36]">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
