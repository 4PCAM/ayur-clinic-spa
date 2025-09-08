import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PillarCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  pillarType: 'agni' | 'dosha' | 'dhatu' | 'srota';
  progress?: number;
  isCompleted?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PillarCard({
  title,
  description,
  icon: Icon,
  pillarType,
  progress = 0,
  isCompleted = false,
  onClick,
  className
}: PillarCardProps) {
  const pillarClasses = {
    agni: "pillar-agni border-orange-200 dark:border-orange-800",
    dosha: "pillar-dosha border-purple-200 dark:border-purple-800", 
    dhatu: "pillar-dhatu border-green-200 dark:border-green-800",
    srota: "pillar-srota border-blue-200 dark:border-blue-800"
  };

  const iconColors = {
    agni: "text-orange-600 dark:text-orange-400",
    dosha: "text-purple-600 dark:text-purple-400",
    dhatu: "text-green-600 dark:text-green-400", 
    srota: "text-blue-600 dark:text-blue-400"
  };

  const progressColors = {
    agni: "bg-orange-500",
    dosha: "bg-purple-500",
    dhatu: "bg-green-500",
    srota: "bg-blue-500"
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-6 rounded-xl border-2 cursor-pointer transition-ayur",
        "hover:shadow-ayur-medium hover:scale-[1.02] active:scale-[0.98]",
        pillarClasses[pillarType],
        isCompleted && "ring-2 ring-primary/20",
        className
      )}
    >
      {/* Progress indicator */}
      {progress > 0 && (
        <div className="absolute top-3 right-3">
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16" cy="16" r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted"
                opacity="0.3"
              />
              <circle
                cx="16" cy="16" r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={progressColors[pillarType]}
                strokeDasharray={`${2 * Math.PI * 14}`}
                strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            {isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  progressColors[pillarType]
                )} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl transition-ayur float-gentle",
          "bg-white/80 dark:bg-black/20 shadow-ayur-soft",
          iconColors[pillarType]
        )}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-ayur">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
          
          {progress > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs">
              <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 ease-out",
                    progressColors[pillarType]
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-muted-foreground font-medium">
                {progress}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-ayur pointer-events-none" />
    </div>
  );
}