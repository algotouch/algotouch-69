import { debugLog } from '@/lib/logger';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MonthCalendar from '@/components/MonthCalendar';
import { TradeRecord } from '@/lib/trade-analysis';
import SelectedDayTrades from '@/components/calendar/SelectedDayTrades';
import { MonthHeader } from '@/components/calendar/MonthHeader';

interface MonthCalendarSectionProps {
  currentMonth: string;
  currentYear: number;
  prevMonth: () => void;
  nextMonth: () => void;
  systemCurrentMonth?: string;
  systemCurrentYear?: number;
  onBackToYear?: () => void;
  tradesData?: Record<string, TradeRecord[]>;
}

export const MonthCalendarSection = ({ 
  currentMonth, 
  currentYear, 
  prevMonth, 
  nextMonth,
  systemCurrentMonth,
  systemCurrentYear,
  onBackToYear,
  tradesData = {}
}: MonthCalendarSectionProps) => {
  const isCurrentMonth = currentMonth === systemCurrentMonth && currentYear === systemCurrentYear;
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  
  // Hebrew month names for getting the month index
  const hebrewMonths = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  
  // Get month index
  const monthIndex = hebrewMonths.indexOf(currentMonth);
  
  // Reset selected day when month changes
  useEffect(() => {
    setSelectedDay(null);
  }, [currentMonth, currentYear]);
  
  // Log for debugging
  useEffect(() => {
    debugLog(`MonthCalendarSection: Rendering ${currentMonth} ${currentYear}, monthIndex=${monthIndex}`);
    debugLog(`MonthCalendarSection: Total trade days in store: ${Object.keys(tradesData).length}`);
    
    // Filter trades only for this month and year
    const filteredDays = Object.keys(tradesData).filter(key => {
      const parts = key.split('-');
      return parts.length === 3 && 
             parseInt(parts[1]) === monthIndex && 
             parseInt(parts[2]) === currentYear;
    });
    
    debugLog(`MonthCalendarSection: Filtered trade days for this month: ${filteredDays.length}`);
    
    if (filteredDays.length > 0) {
      debugLog("Sample days with trades:", filteredDays.slice(0, 3));
      
      // Log details about the first few days
      filteredDays.slice(0, 3).forEach(day => {
        const trades = tradesData[day];
        debugLog(`Day ${day} has ${trades.length} trades with profit: $${
          trades.reduce((sum, trade) => sum + (trade.Net || 0), 0).toFixed(2)
        }`);
      });
    } else {
      debugLog(`No trades found for ${currentMonth} ${currentYear}`);
    }
  }, [tradesData, currentMonth, currentYear, monthIndex]);
  
  const handleDayClick = (day: number) => {
    // New format: Create a key with day-month-year
    const dayKey = `${day}-${monthIndex}-${currentYear}`;
    debugLog("Day clicked:", dayKey, "Has trades:", tradesData[dayKey]?.length || 0);
    
    // Set the selected day
    setSelectedDay(dayKey);
  };
  
  // Get selected day trades
  const selectedDayTrades = selectedDay && tradesData[selectedDay] ? tradesData[selectedDay] : [];
  
  return (
    <div className="col-span-2">
      <MonthHeader prevMonth={prevMonth} nextMonth={nextMonth} />
      
      <MonthCalendar 
        month={currentMonth} 
        year={currentYear} 
        status={isCurrentMonth ? "Active" : "Open"} 
        onBackToYear={onBackToYear}
        tradesData={tradesData}
        onDayClick={handleDayClick}
      />
      
      {/* Display selected day trades */}
      <SelectedDayTrades 
        selectedDay={selectedDay} 
        selectedDayTrades={selectedDayTrades} 
        month={currentMonth} 
      />
    </div>
  );
};
