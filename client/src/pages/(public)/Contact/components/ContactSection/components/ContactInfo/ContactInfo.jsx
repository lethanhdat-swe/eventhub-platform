import { useEffect, useState } from 'react';
import { Clock, Mail, MapPin, Phone, User } from 'lucide-react';
import { siteSettingService } from '@/lib/services/siteSetting/siteSettingService';

function ContactInfo() {
  const [siteSetting, setSiteSetting] = useState(null);

  useEffect(() => {
    const fetchSiteSetting = async () => {
      try {
        const data = await siteSettingService.getSiteSetting();
        if (data) setSiteSetting(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSiteSetting();
  }, []);

  const contactInfo = [
    {
      id: 1,
      icon: MapPin,
      title: 'Địa chỉ',
      lines: [siteSetting?.address || ''],
    },
    {
      id: 2,
      icon: Phone,
      title: 'Hotline',
      lines: [
        siteSetting?.hotline || '',
        siteSetting?.workingHours ? `(${siteSetting.workingHours} mỗi ngày)` : '',
      ].filter(Boolean),
    },
    {
      id: 3,
      icon: Mail,
      title: 'Email hỗ trợ',
      lines: [siteSetting?.supportEmail || ''],
    },
    {
      id: 4,
      icon: Clock,
      title: 'Giờ làm việc',
      lines: [
        'Thứ 2 - Chủ nhật',
        siteSetting?.workingHours ? `${siteSetting.workingHours} (kể cả ngày lễ)` : '',
      ].filter(Boolean),
    },
  ];

  return (
    <div className="py-1 px-6 border-l border-(--text-primary)/20">
      <div className="flex items-center gap-3">
        <User size={20} color="var(--primary-color)" />
        <h1 className="uppercase text-(--text-primary) font-medium text-xl">
          thông tin liên hệ
        </h1>
      </div>

      <div className="flex flex-col gap-8 mt-8">
        {contactInfo.map(({ id, icon: Icon, title, lines }) => (
          <div key={id} className="flex items-start gap-4 group">
            <div className="p-3 rounded-lg border border-(--primary-color)/30 text-(--primary-color) transition-all duration-300 group-hover:bg-(--primary-color)/10 group-hover:border-(--primary-color)/60 group-hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.2)]">
              <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-(--text-primary) font-medium transition-colors duration-300 group-hover:text-(--primary-color)">{title}</p>
              {lines.map((line, i) => (
                <p key={i} className="text-sm text-(--text-primary)/70 transition-colors duration-300 group-hover:text-(--text-primary)/50">{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 mt-15">
        <h1 className="text-(--text-primary) text-xl uppercase">tìm đường đến chúng tôi</h1>

        {siteSetting?.mapUrl && (
          <iframe
            src={siteSetting.mapUrl}
            width="100%"
            height="350"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)', display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </div>
  );
}

export default ContactInfo;
