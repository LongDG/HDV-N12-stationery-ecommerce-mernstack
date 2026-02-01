import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, user } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập thì redirect về trang chủ
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      // Đăng nhập
      try {
        const result = await login({
          email: formData.email,
          password: formData.password
        });
        
        if (result.success) {
          navigate('/');
        } else {
          setError(result.message || 'Đăng nhập thất bại');
        }
      } catch (err) {
        setError('Đăng nhập thất bại. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    } else {
      // Đăng ký
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp!');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự!');
        setLoading(false);
        return;
      }

      try {
        const { confirmPassword, ...registerData } = formData;
        const result = await register(registerData);
        
        if (result.success) {
          navigate('/');
        } else {
          setError(result.message || 'Đăng ký thất bại');
        }
      } catch (err) {
        setError('Đăng ký thất bại. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="Auth">
      <div className="Auth-container">
        <div className="Auth-card">
          <div className="Auth-header">
            <button
              className={`Auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Đăng nhập
            </button>
            <button
              className={`Auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Đăng ký
            </button>
          </div>

          <div className="Auth-content">
            <h2 className="Auth-title">
              {isLogin ? 'Chào mừng bạn quay trở lại!' : 'Tạo tài khoản mới'}
            </h2>
            <p className="Auth-subtitle">
              {isLogin ? 'Đăng nhập để tiếp tục' : 'Điền thông tin để đăng ký'}
            </p>

            {error && (
              <div className="Auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="Auth-form">
              {!isLogin && (
                <div className="Form-group">
                  <label htmlFor="name">Họ và tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="Form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>

              <div className="Form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isLogin ? "Nhập mật khẩu của bạn" : "Nhập mật khẩu (tối thiểu 6 ký tự)"}
                  required
                  minLength={6}
                />
              </div>

              {!isLogin && (
                <div className="Form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    required={!isLogin}
                    minLength={6}
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="Auth-button"
                disabled={loading}
              >
                {loading 
                  ? (isLogin ? 'Đang đăng nhập...' : 'Đang đăng ký...') 
                  : (isLogin ? 'Đăng nhập' : 'Đăng ký')
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

