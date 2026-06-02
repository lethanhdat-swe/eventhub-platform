export function getStatusConfig(
  status,
  token,
  errorDetail
) {
  switch (status) {
    case 'loading':
      return {
        title: 'Đang xác thực',
        description:
          'Vui lòng chờ trong giây lát, chúng tôi đang kiểm tra liên kết xác thực của bạn.',
      };

    case 'success':
      return {
        title: 'Xác thực thành công',
        description:
          'Email của bạn đã được xác thực. Tài khoản hiện đã sẵn sàng để sử dụng.',
      };

    case 'failed':
    default:
      return {
        title: 'Xác thực thất bại',
        description: !token
          ? 'Không tìm thấy token trên đường dẫn. Hãy mở lại đúng liên kết trong email.'
          : errorDetail ||
            'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại hoặc liên hệ hỗ trợ.',
      };
  }
}