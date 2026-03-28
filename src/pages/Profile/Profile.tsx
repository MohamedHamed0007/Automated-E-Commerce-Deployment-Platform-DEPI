import { User, Mail, Phone, MapPin, Camera, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import toast from 'react-hot-toast';
import type { AppDispatch, RootState } from '../../redux/store';
import { updateProfile } from '../../redux/thunk/profileThunk';

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    country: user?.address?.country || ''
  });

  const [dirty, setDirty] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        country: user.address?.country || ''
      });
      setDirty(false);
    }
  }, [user]);

  const handleField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setDirty(true);
  };

  const handleDiscard = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        country: user.address?.country || ''
      });
      setDirty(false);
      toast.success('Changes discarded');
    }
  };

  const handleSave = async () => {
    try {
      const resultAction = await dispatch(updateProfile(formData));

      if (updateProfile.fulfilled.match(resultAction)) {
        toast.success('Profile updated successfully!');
        setDirty(false);
      } else {
        const errorMsg = resultAction.payload as string;
        toast.error(errorMsg || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'ME'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* 1. HEADER CARD */}
      <Card className="dark:bg-slate-800/50 dark:border-slate-700/50 bg-white shadow-sm transition-colors border-slate-200">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20 border-4 border-white dark:border-slate-800">
              {getInitials(formData.fullName)}
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-700 rounded-full shadow-md border border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
            <input type="file" ref={fileRef} className="hidden" accept="image/*" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {user?.fullName || 'User Name'}
            </h3>
            <div className="flex flex-col gap-1">
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 opacity-70" /> {user?.email}
              </p>
              <div className="pt-1">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                  {user?.role || 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. FORM SECTIONS */}
      <div className="grid grid-cols-1 gap-6">
        <Card
          className="dark:bg-slate-800/50 dark:border-slate-700/50 bg-white border-slate-200"
          title={
            <span className="text-slate-700 dark:text-slate-200 font-bold">
              Personal Information
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              labelClass="text-slate-500 dark:text-slate-400 font-medium text-xs mb-1 uppercase tracking-wide"
              value={formData.fullName}
              onChange={handleField('fullName')}
              icon={<User className="w-4 h-4 text-slate-400" />}
              className="dark:bg-slate-900/50 dark:border-slate-700 focus:ring-blue-500/20"
            />

            <Input
              label="Phone Number"
              labelClass="text-slate-500 dark:text-slate-400 font-medium text-xs mb-1 uppercase tracking-wide"
              value={formData.phone}
              onChange={handleField('phone')}
              icon={<Phone className="w-4 h-4 text-slate-400" />}
              placeholder="+20 111 341 4805"
              className="dark:bg-slate-900/50 dark:border-slate-700"
            />
          </div>
        </Card>

        <Card
          className="dark:bg-slate-800/50 dark:border-slate-700/50 bg-white border-slate-200"
          title={
            <span className="text-slate-700 dark:text-slate-200 font-bold">Shipping Details</span>
          }
        >
          <div className="space-y-5">
            <Input
              label="Street Address"
              labelClass="text-slate-500 dark:text-slate-400 font-medium text-xs mb-1 uppercase tracking-wide"
              value={formData.street}
              onChange={handleField('street')}
              icon={<MapPin className="w-4 h-4 text-slate-400" />}
              placeholder="123 Main St"
              className="dark:bg-slate-900/50 dark:border-slate-700"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="City"
                labelClass="text-slate-500 dark:text-slate-400 font-medium text-xs mb-1 uppercase tracking-wide"
                value={formData.city}
                onChange={handleField('city')}
                placeholder="Cairo"
                className="dark:bg-slate-900/50 dark:border-slate-700"
              />

              <Input
                label="Country"
                labelClass="text-slate-500 dark:text-slate-400 font-medium text-xs mb-1 uppercase tracking-wide"
                value={formData.country}
                onChange={handleField('country')}
                icon={<Globe className="w-4 h-4 text-slate-400" />}
                placeholder="Egypt"
                className="dark:bg-slate-900/50 dark:border-slate-700"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. ACTIONS */}
      <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-700/50">
        <Button
          variant="ghost"
          onClick={handleDiscard}
          disabled={!dirty || loading}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Discard
        </Button>

        <Button
          onClick={handleSave}
          disabled={!dirty || loading}
          loading={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 px-8"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
