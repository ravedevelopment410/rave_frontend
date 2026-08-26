import React from 'react';

const WhatsAppButton = () => {
  const phoneNumber = '919814903739';
  const defaultMessage = encodeURIComponent('Hello Aravez Team! I am interested in your commercial AV products and would like more information.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center cursor-pointer focus:outline-none"
      aria-label="Chat with us on WhatsApp"
    >
      {/* Floating Circle Button with Authentic WhatsApp Icon */}
      <div className="relative flex items-center justify-center">
        {/* Pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] animate-ping opacity-30 group-hover:opacity-50" />

        {/* WhatsApp Button Container */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-emerald-950/40 transform group-hover:scale-110 group-active:scale-95 transition-all duration-300 border-2 border-white">
          {/* Authentic High-Res WhatsApp SVG */}
          <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1C7.71573 1 1 7.71573 1 16C1 18.7301 1.7303 21.2882 3.00392 23.4913L1.51654 28.924C1.36531 29.4764 1.84931 29.9604 2.40173 29.8092L7.8344 28.3218C10.0375 29.5954 12.5956 30.3257 15.3257 30.3257L16 31ZM9.95754 8.78465C9.64506 8.09025 9.31752 8.07624 9.02058 8.06424C8.77708 8.05424 8.49758 8.05424 8.21808 8.05424C7.93858 8.05424 7.48458 8.15924 7.10058 8.57824C6.71658 8.99724 5.63358 10.0102 5.63358 12.0722C5.63358 14.1342 7.13558 16.1262 7.34558 16.4062C7.55558 16.6862 10.2456 21.0312 14.5026 22.7222C18.0386 24.1272 18.7566 23.8472 19.5256 23.7772C20.2946 23.7072 21.9966 22.7632 22.3466 21.7842C22.6966 20.8052 22.6966 19.9662 22.5916 19.7912C22.4866 19.6162 22.2071 19.5112 21.7881 19.3012C21.3691 19.0912 19.3081 18.0772 18.9241 17.9372C18.5401 17.7972 18.2606 17.7272 17.9811 18.1462C17.7016 18.5652 16.9156 19.4912 16.6706 19.7712C16.4256 20.0512 16.1806 20.0862 15.7616 19.8762C15.3426 19.6662 13.9936 19.2242 12.3926 17.7972C11.1446 16.6862 10.3016 15.3142 10.0566 14.8952C9.81158 14.4762 10.0306 14.2502 10.2416 14.0402C10.4306 13.8512 10.6626 13.5482 10.8726 13.3032C11.0826 13.0582 11.1526 12.8832 11.2926 12.6032C11.4326 12.3232 11.3626 12.0782 11.2576 11.8682C11.1526 11.6582 10.3201 9.57905 9.95754 8.78465Z" fill="white"/>
          </svg>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
