import React, { useState } from 'react';
import { Package, MapPin, User, Upload, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input/Input';
import { Textarea } from '../../components/Textarea/Textarea';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Select } from '../../components/Select/Select';
import { StepProgress } from '../../components/StepProgress/StepProgress';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const steps = [
  { label: 'Package Details', description: 'Size & weight' },
  { label: 'Addresses', description: 'Sender & receiver' },
  { label: 'AI Scan', description: 'Optional' },
  { label: 'Confirmation', description: 'Review' },
];

const packageTypes = [
  { value: 'document', label: 'Document' },
  { value: 'parcel', label: 'Parcel' },
  { value: 'package', label: 'Package' },
  { value: 'freight', label: 'Freight' },
];

const weightUnits = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'lb', label: 'Pounds (lb)' },
];

export default function NewShipment() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    packageType: 'parcel',
    weight: '',
    weightUnit: 'kg',
    length: '',
    width: '',
    height: '',
    description: '',
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    senderCity: '',
    senderState: '',
    senderZip: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverCity: '',
    receiverState: '',
    receiverZip: '',
    aiImage: null as File | null,
  });

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const canProceed = () => {
    if (currentStep === 0) return formData.weight.trim() !== '';
    if (currentStep === 1)
      return (
        formData.senderName.trim() &&
        formData.senderPhone.trim() &&
        formData.senderAddress.trim() &&
        formData.receiverName.trim() &&
        formData.receiverPhone.trim() &&
        formData.receiverAddress.trim()
      );
    return true;
  };

  const generateShipmentId = () => {
    const year = new Date().getFullYear();
    const num = Math.floor(Math.random() * 900) + 100;
    return `SH-${year}-${num}`;
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error('Please fill all required fields in this step.', {
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      const shipmentId = generateShipmentId();

      const shipmentData = {
        id: shipmentId,
        status: 'pending',
        courier: 'Pending',
        from: formData.senderCity,
        to: formData.receiverCity,
        estimatedDelivery: 'TBD',
        currentLocation: formData.senderCity,
        progress: 10,
        events: [
          {
            status: 'Shipment created',
            location: formData.senderCity,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            completed: true,
            current: true,
          },
        ],
        details: formData, 
      };

      localStorage.setItem(shipmentId, JSON.stringify(shipmentData));
      navigate(`/user/compare/${shipmentData.id}`, { state: { shipment: shipmentData } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, aiImage: e.target.files![0] }));
    }
  };

  const packageTypeLabel =
    packageTypes.find((p) => p.value === formData.packageType)?.label ?? '';

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/user' },
          { label: 'New Shipment' },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Shipment
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Fill in the details to compare shipping rates
        </p>
      </div>

      <Card>
        <div className="mb-8">
          <StepProgress steps={steps} currentStep={currentStep} />
        </div>

        {/* STEP 1 — Package Details */}
        {currentStep === 0 && (
          <div className="space-y-6  ">
            <div className="flex items-center gap-3 mb-6 ">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600  dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Package Details
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tell us about your package
                </p>
              </div>
            </div>

            <Select
              label="Package Type"
              options={packageTypes}
              value={formData.packageType}
              onChange={(e) => update('packageType', e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Weight"
                value={formData.weight}
                onChange={(e) => update('weight', e.target.value)}
                required
              />
              <Select
                label="Unit"
                options={weightUnits}
                value={formData.weightUnit}
                onChange={(e) => update('weightUnit', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                type="number"
                label="Length (cm)"
                value={formData.length}
                onChange={(e) => update('length', e.target.value)}
              />
              <Input
                type="number"
                label="Width (cm)"
                value={formData.width}
                onChange={(e) => update('width', e.target.value)}
              />
              <Input
                type="number"
                label="Height (cm)"
                value={formData.height}
                onChange={(e) => update('height', e.target.value)}
              />
            </div>

            <Textarea
              label="Package Description"
              rows={3}
              value={formData.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>
        )}

        {/* STEP 2 — Addresses */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Sender */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Sender Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Where is the package coming from?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.senderName}
                  onChange={(e) => update('senderName', e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 234 567 890"
                  value={formData.senderPhone}
                  onChange={(e) => update('senderPhone', e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Street Address"
                  placeholder="123 Main St"
                  value={formData.senderAddress}
                  onChange={(e) => update('senderAddress', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <Input
                  label="City"
                  placeholder="New York"
                  value={formData.senderCity}
                  onChange={(e) => update('senderCity', e.target.value)}
                />
                <Input
                  label="State / Province"
                  placeholder="NY"
                  value={formData.senderState}
                  onChange={(e) => update('senderState', e.target.value)}
                />
                <Input
                  label="ZIP / Postal Code"
                  placeholder="10001"
                  value={formData.senderZip}
                  onChange={(e) => update('senderZip', e.target.value)}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Receiver */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Receiver Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Where is the package going?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Jane Smith"
                  value={formData.receiverName}
                  onChange={(e) => update('receiverName', e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="+44 20 1234 5678"
                  value={formData.receiverPhone}
                  onChange={(e) => update('receiverPhone', e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Street Address"
                  placeholder="456 Baker St"
                  value={formData.receiverAddress}
                  onChange={(e) => update('receiverAddress', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <Input
                  label="City"
                  placeholder="London"
                  value={formData.receiverCity}
                  onChange={(e) => update('receiverCity', e.target.value)}
                />
                <Input
                  label="State / Province"
                  placeholder="England"
                  value={formData.receiverState}
                  onChange={(e) => update('receiverState', e.target.value)}
                />
                <Input
                  label="ZIP / Postal Code"
                  placeholder="NW1 6XE"
                  value={formData.receiverZip}
                  onChange={(e) => update('receiverZip', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — AI Scan */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Package Scan (Optional)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Let our AI estimate dimensions from a photo
                </p>
              </div>
            </div>

            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-800/50
                hover:border-blue-400 dark:hover:border-blue-500
                rounded-xl p-12 text-center transition-colors"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formData.aiImage ? formData.aiImage.name : 'Upload package image'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Drop your image here or click to browse
                </p>
                <div className="mt-4">
                  <Button variant="secondary" type="button">
                    Choose File
                  </Button>
                </div>
              </label>
            </div>

            {formData.aiImage && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  ✓ Image uploaded successfully
                </p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Tip:</strong> Place a standard object next to your package for accurate measurements.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4 — Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Review Your Shipment
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confirm all details before comparing rates
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Package Details */}
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Package Details</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Type:</strong> {packageTypeLabel}</div>
                  <div><strong>Weight:</strong> {formData.weight ? `${formData.weight} ${formData.weightUnit}` : '—'}</div>
                  <div><strong>Dimensions:</strong> {formData.length && formData.width && formData.height ? `${formData.length} × ${formData.width} × ${formData.height} cm` : '—'}</div>
                  {formData.description && <div><strong>Description:</strong> {formData.description}</div>}
                </div>
              </div>

              {/* AI Scan */}
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">AI Scan</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.aiImage ? `📎 ${formData.aiImage.name}` : 'No image uploaded (optional)'}
                </p>
              </div>

              {/* Sender */}
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Sender</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {formData.senderName || '—'}</div>
                  <div><strong>Phone:</strong> {formData.senderPhone || '—'}</div>
                  <div><strong>Address:</strong> {formData.senderAddress || '—'}</div>
                  <div><strong>City / State / ZIP:</strong> {[formData.senderCity, formData.senderState, formData.senderZip].filter(Boolean).join(', ') || '—'}</div>
                </div>
              </div>

              {/* Receiver */}
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Receiver</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {formData.receiverName || '—'}</div>
                  <div><strong>Phone:</strong> {formData.receiverPhone || '—'}</div>
                  <div><strong>Address:</strong> {formData.receiverAddress || '—'}</div>
                  <div><strong>City / State / ZIP:</strong> {[formData.receiverCity, formData.receiverState, formData.receiverZip].filter(Boolean).join(', ') || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Compare Rates' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}