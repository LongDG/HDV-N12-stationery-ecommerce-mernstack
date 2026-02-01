import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="swiss-container">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Về HDV Stationery</h1>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chuyên cung cấp văn phòng phẩm chất lượng cao với dịch vụ tận tâm và giá cả hợp lý
          </p>
        </div>

        {/* Company Info */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Về Chúng Tôi</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              HDV Stationery được thành lập với sứ mệnh cung cấp các sản phẩm văn phòng phẩm chất lượng cao, 
              phục vụ nhu cầu học tập và làm việc của khách hàng.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Với nhiều năm kinh nghiệm trong ngành, chúng tôi cam kết mang đến những sản phẩm tốt nhất 
              với giá cả phải chăng và dịch vụ khách hàng tận tâm.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Cam Kết Chất Lượng</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Sản phẩm chính hãng, chất lượng cao
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Giá cả cạnh tranh, minh bạch
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Giao hàng nhanh chóng, đúng hẹn
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Hỗ trợ khách hàng 24/7
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Đổi trả dễ dàng, bảo hành uy tín
              </li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Thống Kê Hoạt Động</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">1000+</div>
              <div className="text-gray-600">Sản phẩm</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-600">Khách hàng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Thương hiệu</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3+</div>
              <div className="text-gray-600">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Thông Tin Kỹ Thuật</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl mb-4">⚛️</div>
              <h4 className="font-bold text-gray-900 mb-2">Frontend</h4>
              <p className="text-gray-600">React.js với Tailwind CSS</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="font-bold text-gray-900 mb-2">Backend</h4>
              <p className="text-gray-600">Node.js với Express</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl mb-4">🗄️</div>
              <h4 className="font-bold text-gray-900 mb-2">Database</h4>
              <p className="text-gray-600">MongoDB Atlas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

