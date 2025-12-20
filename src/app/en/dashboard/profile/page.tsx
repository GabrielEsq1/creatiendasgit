"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, Briefcase, Globe, Building, Camera, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePageEN() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
        bio: "",
        website: "",
        industry: "",
        profilePicture: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (data.user) {
                setProfile({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    phone: data.user.phone || "",
                    position: data.user.position || "",
                    bio: data.user.bio || "",
                    website: data.user.website || "",
                    industry: data.user.industry || "",
                    profilePicture: data.user.profilePicture || "",
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                alert('✅ Profile updated successfully');
                await loadProfile(); // Reload to confirm
            } else {
                const error = await res.json();
                alert(`❌ Error: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('❌ Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Image is too large. Max 2MB.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Only images are allowed.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;

            try {
                const res = await fetch('/api/user/profile/photo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ photoData: base64 }),
                });

                if (res.ok) {
                    setProfile({ ...profile, profilePicture: base64 });
                    alert('✅ Photo updated');
                } else {
                    alert('❌ Error uploading photo');
                }
            } catch (error) {
                console.error('Error uploading photo:', error);
                alert('❌ Error uploading photo');
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header with Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/en/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your professional B2B information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>

                    <div className="px-8 pb-8">
                        {/* Avatar */}
                        <div className="flex items-end -mt-16 mb-6">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {profile.profilePicture ? (
                                        <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-16 w-16 text-gray-400" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="photo-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                    aria-label="Upload profile photo"
                                />
                                <button
                                    onClick={() => document.getElementById('photo-upload')?.click()}
                                    className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                                    title="Change photo"
                                >
                                    <Camera className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="ml-6 mb-2">
                                <h2 className="text-2xl font-bold text-gray-900">{profile.name || 'User'}</h2>
                                <p className="text-gray-600">{profile.position || 'No Title'}</p>
                            </div>
                        </div>

                        {/* Form Sections */}
                        <div className="space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-3 focus:border-blue-500 focus:outline-none"
                                                placeholder="you@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                disabled
                                                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-3 bg-gray-100 text-gray-600"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Title/Position
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={profile.position}
                                                onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-3 focus:border-blue-500 focus:outline-none"
                                                placeholder="CEO, Director, etc."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Building className="h-5 w-5 text-blue-600" />
                                    Professional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Industry/Sector
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.industry}
                                            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                            placeholder="Technology, Marketing, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Website
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="url"
                                                value={profile.website}
                                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-3 focus:border-blue-500 focus:outline-none"
                                                placeholder="https://yourcompany.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Professional Bio
                                    </label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none resize-none"
                                        rows={4}
                                        placeholder="Describe your professional experience, specialties, and what you offer to other B2B professionals..."
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1 text-right">
                                        {profile.bio.length}/500 characters
                                    </p>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => router.push('/en/dashboard')}
                                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Account Information</h4>
                    <p className="text-sm text-blue-700">
                        Your account is active and working correctly. If you need to update your info, please contact support.
                    </p>
                </div>
            </div>
        </div>
    );
}
