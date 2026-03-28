import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Breadcrumb } from "../../components/Breadcrumb";
import toast from "react-hot-toast";
 
// ── types ──────────────────────────────────────────────────────────────────
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  avatar?: string; // base64
}
 
interface Prefs {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}
 
// ── helpers ────────────────────────────────────────────────────────────────
function loadProfile(): ProfileData {
  // حاول تجيب البيانات المحفوظة أولاً
  const saved = localStorage.getItem("profileData");
  if (saved) return JSON.parse(saved);
 
  // fallback: جيب الـ email من signupData لو موجود
  const signup = localStorage.getItem("signupData");
  const signupEmail = signup ? JSON.parse(signup).email : "";
  const signupName  = signup ? JSON.parse(signup).fullName ?? "" : "";
  const parts       = signupName.trim().split(" ");
 
  return {
    firstName: parts[0] ?? "",
    lastName:  parts.slice(1).join(" ") ?? "",
    email:     signupEmail,
    phone:     "",
    street:    "",
    city:      "",
    state:     "",
    zip:       "",
  };
}
 
function loadPrefs(): Prefs {
  const saved = localStorage.getItem("profilePrefs");
  if (saved) return JSON.parse(saved);
  return { emailNotifications: true, smsNotifications: true, marketingEmails: false };
}
 
function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "ME";
}
 
// ──────────────────────────────────────────────────────────────────────────
export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>(loadProfile);
  const [prefs,   setPrefs]   = useState<Prefs>(loadPrefs);
  const [dirty,   setDirty]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
 
  // track dirty state
  useEffect(() => { setDirty(true); }, [profile, prefs]);
  // skip first render
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; setDirty(false); }
  }, []);
 
  const handleField = (field: keyof ProfileData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfile((p) => ({ ...p, [field]: e.target.value }));
    };
 
  const handlePref = (key: keyof Prefs) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrefs((p) => ({ ...p, [key]: e.target.checked }));
    };
 
  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
 
  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem("profileData", JSON.stringify(profile));
    localStorage.setItem("profilePrefs", JSON.stringify(prefs));
    setSaving(false);
    setDirty(false);
    toast.success("Profile saved successfully!");
  };
 
  const handleCancel = () => {
    setProfile(loadProfile());
    setPrefs(loadPrefs());
    setDirty(false);
  };
 
  const prefItems = [
    { key: "emailNotifications" as const, title: "Email Notifications", desc: "Receive updates about your shipments" },
    { key: "smsNotifications"   as const, title: "SMS Notifications",   desc: "Get text alerts for deliveries"           },
    { key: "marketingEmails"    as const, title: "Marketing Emails",    desc: "Receive promotional offers and discounts"  },
  ];
 
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: "Dashboard", href: "/user" }, { label: "Profile" }]} />
 
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Manage your account information</p>
        </div>
        {dirty && (
          <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            Unsaved changes
          </span>
        )}
      </div>
 
      {/* Profile Picture */}
      <Card className="dark:bg-slate-800 dark:border-slate-600">
        <div className="flex items-center gap-6">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold select-none">
                {getInitials(profile.firstName, profile.lastName)}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-slate-700 rounded-full border-2 border-gray-200 dark:border-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              <Camera className="w-4 h-4 text-gray-600 dark:text-slate-400" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-gray-600 dark:text-slate-400">{profile.email}</p>
            <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
              Member since {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </Card>
 
      {/* Personal Information */}
      <Card className="dark:bg-slate-800 dark:border-slate-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Personal Information
        </h3>
        <div className="space-y-4 dark:text-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <Input 
              label="First Name" 
              value={profile.firstName}
              onChange={handleField("firstName")}
              icon={<User className="w-5 h-5" />}
            />
            <Input
              label="Last Name"
              value={profile.lastName}
              onChange={handleField("lastName")}
              icon={<User className="w-5 h-5" />}
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={handleField("email")}
            icon={<Mail className="w-5 h-5" />}
          />
          <Input
            label="Phone Number"
            value={profile.phone}
            onChange={handleField("phone")}
            icon={<Phone className="w-5 h-5" />}
            placeholder="+20 (10) 000-0000"
          />
        </div>
      </Card>
 
      {/* Default Address */}
      <Card className="dark:bg-slate-800 dark:border-slate-600 dark:text-slate-800 ">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Default Shipping Address
        </h3>
        <div className="space-y-4">
          <Input
            label="Street Address"
            value={profile.street}
            onChange={handleField("street")}
            icon={<MapPin className="w-5 h-5" />}
            placeholder="123 Main St"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="City"     value={profile.city}  onChange={handleField("city")}  placeholder="Cairo"  />
            <Input label="State"    value={profile.state} onChange={handleField("state")} placeholder="Cairo Governorate" />
            <Input label="ZIP Code" value={profile.zip}   onChange={handleField("zip")}   placeholder="11511" />
          </div>
        </div>
      </Card>
 
      {/* Preferences */}
      <Card className="dark:bg-slate-800 dark:border-slate-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preferences</h3>
        <div className="space-y-3">
          {prefItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">{item.desc}</p>
              </div>
              {/* custom toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={prefs[item.key]}
                  onChange={handlePref(item.key)}
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-slate-600 rounded-full peer
                  peer-checked:bg-blue-600
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-white after:rounded-full after:h-5 after:w-5
                  after:transition-all peer-checked:after:translate-x-5
                  transition-colors duration-200" />
              </label>
            </div>
          ))}
        </div>
      </Card>
 
      {/* Actions */}
      <div className="flex gap-3 pb-6">
        <Button onClick={handleSave} loading={saving} disabled={!dirty || saving}>
          Save Changes
        </Button>
        <Button variant="ghost" onClick={handleCancel} disabled={!dirty}>
          Cancel
        </Button>
      </div>
    </div>
  );
}