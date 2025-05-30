
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LoadingSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded-md animate-pulse w-1/3"></div>
          <div className="h-8 bg-muted rounded-md animate-pulse w-1/2"></div>
          <div className="h-4 bg-muted rounded-md animate-pulse w-3/4 mt-4"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingSkeleton;
