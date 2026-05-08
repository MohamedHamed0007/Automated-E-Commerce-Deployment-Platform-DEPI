import { Calendar, CreditCard, Download } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';


const invoices = [
  { id: 'INV-2024-002', date: '2024-02-15', amount: 45.99, status: 'paid', description: 'DHL Express Shipment' },
  { id: 'INV-2024-001', date: '2024-02-14', amount: 38.50, status: 'paid', description: 'FedEx Standard' },
  { id: 'INV-2024-000', date: '2024-02-13', amount: 29.00, status: 'paid', description: 'Pro Subscription - Monthly' },
];

export default function Billing() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Billing History' }
      ]} />
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing History</h1>
        <p className="text-gray-600 mt-1 dark:text-white">View and download your invoices</p>
      </div>
      
      {/* Current Period */}
      <Card>
        <div className="flex items-center justify-between dark:bg-slate-800 ">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-white">Current Billing Period</p>
              <p className="font-semibold text-gray-900 dark:text-white">Feb 1 - Feb 28, 2024</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-white">Amount Due</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</p>
            <Badge variant="success" className="mt-1">Paid</Badge>
          </div>
        </div>
      </Card>
      
      {/* Payment Method */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Default Payment Method</h3>
            <p className="text-sm text-gray-600 dark:text-white">Used for automatic billing</p>
          </div>
          <Button variant="secondary" size="sm">Change</Button>
        </div>
        
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg dark:bg-slate-700">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
            <CreditCard className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">Visa •••• 4242</p>
            <p className="text-sm text-gray-600 dark:text-white">Expires 12/25</p>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
      </Card>
      
      {/* Invoice History */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice History</h3>
            <p className="text-sm text-gray-600 dark:text-white">All your past transactions</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Invoice ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.id}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">{invoice.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">{invoice.description}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">${invoice.amount.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="success">Paid</Badge>
                  </td>
                  <td className="py-4 px-4 ">
                    <Button variant="ghost" size="sm" className='dark:bg-white'>
                      <Download className="w-4 h-4 dark:text-black " />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Total Summary */}
      <Card>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-white mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">$113.49</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-white mb-1">Last Month</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">$245.75</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-white mb-1">Total Lifetime</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">$4,850.00</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
