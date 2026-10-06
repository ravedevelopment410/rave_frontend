import React from 'react';
import { ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: ShieldCheck,
      title: '100% Genuine AV Products',
      description: 'Official brand warranty on interactive panels, projectors & VC gear.',
    },
    {
      icon: Award,
      title: 'Authorized AV Distributor',
      description: 'Leading provider of Toughbook, Interactive Panels & Active LEDs.',
    },
    {
      icon: Truck,
      title: 'Pan-India Express Shipping',
      description: 'Safe & insured transit delivery for commercial electronics.',
    },
    {
      icon: Sparkles,
      title: 'Expert Technical Support',
      description: 'Dedicated guidance, GST billing & post-sales service support.',
    },
  ];

  return (
    <div className="bg-white border-y border-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-none bg-gray-50/80 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-none bg-red-50 text-[#ea0028] flex items-center justify-center shrink-0 group-hover:bg-[#ea0028] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#ea0028] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
