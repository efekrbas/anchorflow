import React from 'react';
import clsx from 'clsx';

/**
 * Skeleton loading component following design-taste-frontend Rule 5:
 * "Skeletal loaders matching layout sizes (avoid generic circular spinners)"
 * and design-spells skill: "Skeleton shimmer — shifting light reflections"
 */
const SkeletonLoader = ({ variant = 'dashboard' }) => {
  if (variant === 'dashboard') {
    return (
      <div className="space-y-8 animate-fade-in" aria-busy="true" aria-label="Loading dashboard content">
        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="glass-card rounded-2xl p-6 space-y-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-3 w-24"></div>
                  <div className="skeleton h-8 w-32"></div>
                </div>
                <div className="skeleton w-12 h-12 rounded-xl"></div>
              </div>
              <div className="skeleton h-8 w-full rounded-sm"></div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-xl"></div>
            <div className="space-y-2">
              <div className="skeleton h-5 w-36"></div>
              <div className="skeleton h-3 w-48"></div>
            </div>
          </div>
          <div className="skeleton h-[250px] w-full rounded-xl"></div>
        </div>

        {/* Table Skeleton */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="skeleton h-5 w-44"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <div className="skeleton w-8 h-8 rounded-lg"></div>
                <div className="skeleton h-4 w-20 flex-shrink-0"></div>
                <div className="skeleton h-4 flex-1"></div>
                <div className="skeleton h-4 w-16"></div>
                <div className="skeleton h-6 w-16 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="space-y-3 p-6" aria-busy="true" aria-label="Loading table data">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="skeleton w-8 h-8 rounded-lg"></div>
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 flex-1"></div>
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-6 w-16 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
