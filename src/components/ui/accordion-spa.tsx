import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface AccordionSPAProps {
  items: AccordionItem[];
  defaultOpen?: string;
  className?: string;
}

export function AccordionSPA({ items, defaultOpen, className }: AccordionSPAProps) {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpen || null);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleItem = (itemId: string) => {
    setOpenItem(current => current === itemId ? null : itemId);
  };

  useEffect(() => {
    // Smooth scroll to opened section
    if (openItem && contentRefs.current[openItem]) {
      setTimeout(() => {
        contentRefs.current[openItem]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [openItem]);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => {
        const isOpen = openItem === item.id;
        
        return (
          <div
            key={item.id}
            className={cn(
              "border rounded-xl overflow-hidden bg-card shadow-ayur-soft transition-ayur",
              item.className
            )}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={cn(
                "w-full px-6 py-4 text-left flex items-center justify-between",
                "hover:bg-muted/50 transition-ayur focus:outline-none focus:ring-2 focus:ring-primary/20",
                isOpen && "bg-muted/30"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div className={cn(
                    "p-2 rounded-lg transition-ayur",
                    isOpen ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {item.icon}
                  </div>
                )}
                <h3 className={cn(
                  "font-semibold text-lg transition-ayur",
                  isOpen ? "text-primary" : "text-foreground"
                )}>
                  {item.title}
                </h3>
              </div>
              <ChevronDown 
                className={cn(
                  "h-5 w-5 transition-ayur",
                  isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                )}
              />
            </button>
            
            <div
              ref={(el) => {
                contentRefs.current[item.id] = el;
              }}
              className={cn(
                "accordion-content",
                isOpen ? "h-auto opacity-100" : "h-0 opacity-0"
              )}
              data-state={isOpen ? "open" : "closed"}
            >
              <div className="p-6 pt-0 border-t bg-muted/10">
                {item.children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}