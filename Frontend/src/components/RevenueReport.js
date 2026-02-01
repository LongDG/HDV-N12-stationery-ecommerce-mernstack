import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RevenueReport = ({ onClose }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/orders/analytics?period=${dateRange}`);
      setReportData(response.data.data);
      
      // Calculate summary
      const totalRevenue = response.data.data.reduce((sum, item) => sum + item.revenue, 0);
      const totalOrders = response.data.data.reduce((sum, item) => sum + item.orderCount, 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      setSummary({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        days: response.data.data.length
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const exportToCSV = () => {
    const headers = ['Ngày', 'Số đơn hàng', 'Doanh thu'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => [
        row._id,
        row.orderCount,
        row.revenue
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao_cao_doanh_thu_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Báo cáo Doanh thu</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin-bottom: 20px; }
            .summary-item { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BÁO CÁO DOANH THU</h1>
            <p>Kỳ báo cáo: ${dateRange === '7d' ? '7 ngày qua' : dateRange === '30d' ? '30 ngày qua' : '90 ngày qua'}</p>
            <p>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          
          <div class="summary">
            <h2>Tổng quan</h2>
            <div class="summary-item"><strong>Tổng doanh thu:</strong> ${formatPrice(summary.totalRevenue)}</div>
            <div class="summary-item"><strong>Tổng đơn hàng:</strong> ${summary.totalOrders}</div>
            <div class="summary-item"><strong>Giá trị đơn hàng trung bình:</strong> ${formatPrice(summary.avgOrderValue)}</div>
            <div class="summary-item"><strong>Số ngày có dữ liệu:</strong> ${summary.days}</div>
          </div>

          <h2>Chi tiết theo ngày</h2>
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Số đơn hàng</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map(row => `
                <tr>
                  <td>${formatDate(row._id)}</td>
                  <td>${row.orderCount}</td>
                  <td>${formatPrice(row.revenue)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">📊 Báo cáo Doanh thu</h3>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn kỳ báo cáo
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">7 ngày qua</option>
                <option value="30d">30 ngày qua</option>
                <option value="90d">90 ngày qua</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                📥 Xuất CSV
              </button>
              <button
                onClick={printReport}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                🖨️ In báo cáo
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⏳</div>
              <p>Đang tạo báo cáo...</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 font-bold text-lg">{formatPrice(summary.totalRevenue)}</div>
                  <div className="text-blue-600 text-sm">Tổng doanh thu</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-600 font-bold text-lg">{summary.totalOrders}</div>
                  <div className="text-green-600 text-sm">Tổng đơn hàng</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-purple-600 font-bold text-lg">{formatPrice(summary.avgOrderValue)}</div>
                  <div className="text-purple-600 text-sm">Giá trị TB/đơn</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-orange-600 font-bold text-lg">{summary.days}</div>
                  <div className="text-orange-600 text-sm">Ngày có dữ liệu</div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border rounded-lg">
                <div className="px-4 py-3 border-b">
                  <h4 className="font-medium">Chi tiết theo ngày</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4">Ngày</th>
                        <th className="text-left py-3 px-4">Số đơn hàng</th>
                        <th className="text-left py-3 px-4">Doanh thu</th>
                        <th className="text-left py-3 px-4">Giá trị TB/đơn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((row, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{formatDate(row._id)}</td>
                          <td className="py-3 px-4">{row.orderCount}</td>
                          <td className="py-3 px-4 font-medium">{formatPrice(row.revenue)}</td>
                          <td className="py-3 px-4">
                            {row.orderCount > 0 ? formatPrice(row.revenue / row.orderCount) : '0₫'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {reportData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Không có dữ liệu trong kỳ báo cáo này
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;