import { useState } from 'react';
import {
  CheckCircle,
  Lock,
  Mail,
  Phone,
  Send,
  User,
  XCircle,
} from 'lucide-react';
import { contactService } from '@/lib/services/contact';

const INITIAL_FORM = { fullName: '', email: '', phoneNumber: '', message: '' };

function ContactForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = 'Họ và tên là bắt buộc.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ.';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc.';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (10–11 chữ số).';
    }
    if (!formData.message.trim())
      newErrors.message = 'Nội dung liên hệ không được để trống.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await contactService.create(formData);
      setSuccessMessage(
        'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi bạn sớm nhất có thể.'
      );
      setFormData(INITIAL_FORM);
    } catch {
      setErrorMessage('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <Send color="var(--primary-color)" />
        <h1 className="text-(--text-primary) text-xl uppercase font-medium">
          gửi liên hệ cho chúng tôi
        </h1>
      </div>

      <form
        className="flex flex-col gap-6 mt-7"
        onSubmit={handleSubmit}
        noValidate
      >
        {}
        <div className="flex flex-col items-start gap-2">
          <label
            htmlFor="fullName"
            className="text-(--text-primary) font-light"
          >
            Họ và tên <span className="ml-1 text-red-500">*</span>
          </label>
          <div
            className={`group flex w-full items-center gap-4 border px-4 py-3 rounded-lg transition-all duration-300
                        ${errors.fullName ? 'border-red-500' : 'border-(--text-primary)/10 hover:border-(--text-primary)/30 focus-within:border-(--primary-color) focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]'}`}
          >
            <User
              size={20}
              className={`transition-colors duration-300 ${errors.fullName ? 'text-red-500' : 'text-gray-500 group-focus-within:text-(--primary-color)'}`}
            />
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              className="w-full text-sm text-(--text-primary) bg-transparent outline-none placeholder:text-gray-600"
            />
          </div>
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        {}
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="email" className="text-(--text-primary) font-light">
            Email <span className="ml-1 text-red-500">*</span>
          </label>
          <div
            className={`group flex w-full items-center gap-4 border px-4 py-3 rounded-lg transition-all duration-300
                        ${errors.email ? 'border-red-500' : 'border-(--text-primary)/10 hover:border-(--text-primary)/30 focus-within:border-(--primary-color) focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]'}`}
          >
            <Mail
              size={20}
              className={`transition-colors duration-300 ${errors.email ? 'text-red-500' : 'text-gray-500 group-focus-within:text-(--primary-color)'}`}
            />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className="w-full text-sm text-(--text-primary) bg-transparent outline-none placeholder:text-gray-600"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {}
        <div className="flex flex-col items-start gap-2">
          <label
            htmlFor="phoneNumber"
            className="text-(--text-primary) font-light"
          >
            Số điện thoại <span className="ml-1 text-red-500">*</span>
          </label>
          <div
            className={`group flex w-full items-center gap-4 border px-4 py-3 rounded-lg transition-all duration-300
                        ${errors.phoneNumber ? 'border-red-500' : 'border-(--text-primary)/10 hover:border-(--text-primary)/30 focus-within:border-(--primary-color) focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]'}`}
          >
            <Phone
              size={20}
              className={`transition-colors duration-300 ${errors.phoneNumber ? 'text-red-500' : 'text-gray-500 group-focus-within:text-(--primary-color)'}`}
            />
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại của bạn"
              className="w-full text-sm text-(--text-primary) bg-transparent outline-none placeholder:text-gray-600"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {}
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="message" className="text-(--text-primary) font-light">
            Nội dung liên hệ <span className="ml-1 text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Bạn cần hỗ trợ vấn đề gì?"
            className={`w-full text-sm text-(--text-primary) bg-transparent outline-none placeholder:text-gray-600 border px-4 py-3 rounded-lg transition-all duration-300 h-40 resize-none
                            ${errors.message ? 'border-red-500' : 'border-(--text-primary)/10 hover:border-(--text-primary)/30 focus:border-(--primary-color) focus:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]'}`}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message}</p>
          )}
        </div>

        {}
        {successMessage && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 text-sm">
            <CheckCircle size={18} className="shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
            <XCircle size={18} className="shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {}
        <button
          type="submit"
          disabled={loading}
          className="uppercase bg-(--primary-color) flex items-center justify-center gap-2 p-4 rounded-lg w-full transition-all duration-300 hover:brightness-110 hover:shadow-[0_4px_20px_rgba(var(--primary-rgb),0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          <p className="font-medium text-white">
            {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
          </p>
          <Send size={18} color="white" />
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
