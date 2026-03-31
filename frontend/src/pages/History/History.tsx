import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Download, Eye, Package, Loader2, Trash2, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Badge } from '../../components/Badge';
import { useAppDispatch, useAppSelector } from '../../redux/hookredux';
import { getUserShipments, deleteShipment } from '../../redux/thunk/shipmentThunk';
import type { IShipment } from '../../types';
import toast from 'react-hot-toast';

const statusConfig: Record<
  string,
  { label: string; variant: 'warning' | 'info' | 'success' | 'default' }
> = {
  draft: { label: 'Draft', variant: 'warning' },
  compared: { label: 'Compared', variant: 'info' },
  booked: { label: 'Booked', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'default' }
};

const ITEMS_PER_PAGE = 8;

function getCourierName(shipment: IShipment): string {
  if (!shipment.selectedRate) return '—';
  return `${shipment.selectedRate.carrier} - ${shipment.selectedRate.service}`;
}

function getCourierPrice(shipment: IShipment): number {
  if (!shipment.selectedRate) return 0;
  return shipment.selectedRate.finalRate;
}

export default function History() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shipments, loading } = useAppSelector((state) => state.shipment);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // State for Custom Delete Modal
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null }>({
    show: false,
    id: null
  });

  useEffect(() => {
    dispatch(getUserShipments());
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = shipments.length;
    const delivered = shipments.filter((s) => s.status === 'delivered').length;
    const inTransit = shipments.filter((s) => s.status === 'booked').length;
    const totalSpent = shipments.reduce((sum, s) => sum + getCourierPrice(s), 0);
    return { total, delivered, inTransit, totalSpent };
  }, [shipments]);

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return shipments;
    return shipments.filter((s) => s.status === statusFilter.toLowerCase());
  }, [shipments, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewShipment = (shipment: IShipment) => {
    navigate(`/user/tracking/${shipment._id}`);
  };

  // Open Custom Modal
  const confirmDelete = (id: string) => {
    setDeleteModal({ show: true, id });
  };

  // Perform Delete Action
  const handleRemoveShipment = async () => {
    if (!deleteModal.id) return;

    const id = deleteModal.id;
    setDeleteModal({ show: false, id: null }); // Close modal immediately

    try {
      await dispatch(deleteShipment(id)).unwrap();
      toast.success('Shipment removed successfully');
    } catch (error: any) {
      toast.error(error || 'Failed to remove shipment');
    }
  };

  const handleExport = () => {
    const rows = [
      ['Tracking ID', 'From', 'To', 'Courier', 'Status', 'Price'],
      ...filtered.map((s) => [
        s.trackingNumber || s._id,
        s.senderAddress.city,
        s.receiverAddress.city,
        getCourierName(s),
        s.status,
        `$${getCourierPrice(s).toFixed(2)}`
      ])
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipment-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusOptions = ['All', 'Draft', 'Compared', 'Booked', 'Cancelled'];

  return (
    <div className="space-y-6 mx-auto container text-gray-900 dark:text-gray-100 relative">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/user' }, { label: 'Shipment History' }]} />

      {/* Custom Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setDeleteModal({ show: false, id: null })}
          />

          {/* Modal Body */}
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setDeleteModal({ show: false, id: null })}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Remove Shipment?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                Are you sure you want to remove this shipment? This action cannot be undone and will
                remove all associated tracking data.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="ghost"
                  className="flex-1 border border-slate-200 dark:border-slate-700"
                  onClick={() => setDeleteModal({ show: false, id: null })}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600 border-none shadow-lg shadow-red-200 dark:shadow-none"
                  onClick={handleRemoveShipment}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shipment History</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View and manage all your past shipments
          </p>
        </div>

        <div className="flex gap-3 relative">
          <Button variant="secondary" onClick={() => setShowFilterMenu((v) => !v)}>
            <Filter className="w-4 h-4 mr-1" />
            Filter
            {statusFilter !== 'All' && (
              <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                {statusFilter}
              </span>
            )}
          </Button>

          {/* Filter Dropdown */}
          {showFilterMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
              {statusOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setStatusFilter(opt);
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    statusFilter === opt
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Shipments</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-blue-400">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Delivered</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.delivered}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">In Transit</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.inTransit}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-green-400">
            ${stats.totalSpent.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
          </div>
        ) : shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No Shipments Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Your shipment history will appear here after you place an order.
            </p>
            <Button onClick={() => navigate('/user/newshipment')}>
              Create Your First Shipment
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {['Tracking ID', 'Route', 'Courier', 'Price', 'Status', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="text-center py-4 px-4 font-medium text-gray-600 dark:text-gray-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((shipment) => (
                    <tr
                      key={shipment._id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 align-middle text-center">
                        <p className="font-mono font-medium text-gray-900 dark:text-white text-xs mt-1.5">
                          {shipment.trackingNumber || shipment._id}
                        </p>
                      </td>

                      <td className="py-4 px-4 align-middle text-center">
                        <p className="text-gray-900 dark:text-gray-200 mt-1">
                          {shipment.senderAddress.city}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          → {shipment.receiverAddress.city}
                        </p>
                      </td>

                      <td className="py-4 px-4 align-middle text-center">
                        <span className="text-gray-900 dark:text-gray-200 inline-block mt-1.5">
                          {getCourierName(shipment)}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-middle text-center">
                        <span className="font-semibold text-gray-900 dark:text-white inline-block mt-1.5">
                          ${getCourierPrice(shipment).toFixed(2)}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-middle text-center">
                        <div className="mt-1 flex justify-center">
                          <Badge variant={statusConfig[shipment.status]?.variant ?? 'default'}>
                            {statusConfig[shipment.status]?.label ?? shipment.status}
                          </Badge>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-middle">
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 px-3 dark:text-white dark:hover:bg-gray-700"
                            onClick={() => handleViewShipment(shipment)}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>

                          {(shipment.status === 'draft' || shipment.status === 'compared') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 px-3 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                              onClick={() => confirmDelete(shipment._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}
                </span>{' '}
                to{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium text-gray-900 dark:text-white">{filtered.length}</span>{' '}
                shipments
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? 'primary' : 'secondary'}
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200'
                        : 'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                    }
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
