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
    <div className="bg-emerald-50/60 border-y border-emerald-100/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-emerald-100/60 hover:shadow-md hover:border-emerald-300 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-emerald-800 transition-colors">
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
