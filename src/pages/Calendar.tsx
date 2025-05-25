import { debugLog } from '@/lib/logger';

import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { CalendarPageHeader } from '@/components/calendar/CalendarPageHeader';
import { CalendarPageContent } from '@/components/calendar/CalendarPageContent';
import { useCalendar } from '@/hooks/use-calendar';

// Use function declaration for the component
function CalendarPage() {
  const { 
    viewMode,
    currentMonth,
    currentYear,
    tradeDays,
    tradesByDay,
    lastUpdateTimestamp,
    hebrewMonths,
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    handleMonthSelect,
    handleBackToYear
  } = useCalendar();

  // Log loaded data on render for debugging
  useEffect(() => {
    debugLog("Calendar render state:", { 
      tradesByDayCount: Object.keys(tradesByDay).length,
      lastUpdate: new Date(lastUpdateTimestamp).toLocaleTimeString(),
      viewMode
    });
    
    // Debug data by logging keys
    if (Object.keys(tradesByDay).length > 0) {
      debugLog("Calendar days with data:", Object.keys(tradesByDay).join(", "));
      
      // Check a sample day
      const sampleKey = Object.keys(tradesByDay)[0];
      debugLog(`Sample day ${sampleKey} has ${tradesByDay[sampleKey].length} trades`);
    }
  }, [tradesByDay, lastUpdateTimestamp, viewMode]);

  // Current date for reference
  const currentDate = new Date();
  const systemCurrentMonth = hebrewMonths[currentDate.getMonth()];
  const systemCurrentYear = currentDate.getFullYear();

  return (
    <Layout>
      <div className="tradervue-container py-6 bg-dots">
        <div className="flex flex-col max-w-5xl mx-auto">
          <CalendarPageHeader 
            viewMode={viewMode}
            currentYear={currentYear}
            prevYear={prevYear}
            nextYear={nextYear}
          />
          
          <CalendarPageContent 
            viewMode={viewMode}
            currentMonth={currentMonth}
            currentYear={currentYear}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            systemCurrentMonth={systemCurrentMonth}
            systemCurrentYear={systemCurrentYear}
            handleMonthSelect={handleMonthSelect}
            handleBackToYear={handleBackToYear}
            tradeDays={tradeDays}
            tradesByDay={tradesByDay}
          />
        </div>
      </div>
    </Layout>
  );
}

export default CalendarPage;
