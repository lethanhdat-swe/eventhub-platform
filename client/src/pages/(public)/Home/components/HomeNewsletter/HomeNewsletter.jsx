import { Check, Mail } from 'lucide-react';
import { useState } from 'react';

function HomeNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  function handleSubscribe() {
    if (!email.trim() || !email.includes('@')) {
      setError(true);
      setTimeout(() => setError(false), 1500);
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="container">
      <div className=" relative flex items-center justify-between p-7 rounded-2xl bg-[#111118] border border-(--primary-color)/30">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
            <div className="absolute w-20 h-20 rounded-full border border-(--primary-color)/40 border-t-(--primary-color) animate-spin animation-duration-[8s]" />
            <div className="absolute w-14 h-14 rounded-full border border-(--primary-color)/20 border-b-(--primary-color)/60 animate-spin animation-duration-[6s] animation-direction-[reverse]" />

            <div className="border rounded-lg border-(--primary-color) p-2 flex items-center justify-center text-(--primary-color) z-10">
              <Mail size={30} />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#f0eaff]">
              Do not Miss Out!
            </h3>
            <p className="text-xs font-light leading-relaxed mt-0.5 text-[#8b7db8] max-w-75">
              Subscribe to our newsletter and get the latest updates on events,
              exclusive offers, and more.
            </p>
          </div>
        </div>

        <div className="flex items-center flex-1 gap-2 max-w-105">
          {!submitted ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                placeholder="Enter your email address"
                className={`
                flex-1 rounded-lg px-3 py-2.5 text-xs outline-none transition-all 
                text-[#c4b5fd] placeholder:text-[#4d3d78] bg-[#1a1430] border-[0.5px]
                ${
                  error
                    ? 'border-[#e24b4a]'
                    : 'border-[color-mix(in_srgb,var(--primary-color)_50%,transparent)]'
                }
              `}
              />
              <button
                onClick={handleSubscribe}
                className="shrink-0 rounded-lg px-5 py-2.5 text-xs font-semibold text-white active:scale-95 transition-all bg-(--primary-color) hover:brightness-85"
              >
                Subscribe
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-(--primary-color)">
              <Check />
              Subscribed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeNewsletter;
