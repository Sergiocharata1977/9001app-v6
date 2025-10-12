'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import LegajoService from '@/services/legajoService';
import React from 'react';

interface RatioCardProps {
  title: string;
  value: number;
  ratioName?: string;
  description?: string;
  format?: 'ratio' | 'percentage' | 'currency';
  showInterpretation?: boolean;
}

/**
 * Tarjeta individual para mostrar un ratio financiero
 */
const RatioCard: React.FC<RatioCardProps> = ({
  title,
  value,
  ratioName,
  description,
  format = 'ratio',
  showInterpretation = true
}) => {
  // Formatear valor según el tipo
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'percentage':
        return LegajoService.formatPercentage(val);
      case 'currency':
        return LegajoService.formatCurrency(val);
      case 'ratio':
      default:
        return LegajoService.formatRatio(val);
    }
  };

  // Obtener color e interpretación
  const color = ratioName ? LegajoService.getRatioColor(ratioName, value) : 'gray';
  const interpretation = ratioName ? LegajoService.getRatioInterpretation(ratioName, value) : null;

  // Mapear colores a clases de Tailwind
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700'
  };

  const badgeVariants = {
    green: 'default',
    blue: 'secondary',
    yellow: 'outline',
    orange: 'outline',
    red: 'destructive',
    gray: 'outline'
  };

  return (
    <Card className={cn('transition-all hover:shadow-md', colorClasses[color as keyof typeof colorClasses])}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-medium">{title}</h4>
          {showInterpretation && interpretation && (
            <Badge variant={badgeVariants[color as keyof typeof badgeVariants] as any} className="text-xs">
              {interpretation}
            </Badge>
          )}
        </div>
        
        <p className="text-2xl font-bold mb-1">
          {formatValue(value, format)}
        </p>
        
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RatioCard;

