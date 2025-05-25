import { debugLog } from '@/lib/logger';

import { useState, useCallback } from 'react';

interface UseVideoProgressProps {
  courseId: string;
  lessonId: number | null;
  recordLessonWatched?: (courseId: string, lessonId: string) => Promise<boolean>;
  videoTitle: string;
}

export function useVideoProgress({
  courseId,
  lessonId,
  recordLessonWatched,
  videoTitle
}: UseVideoProgressProps) {
  const [videoCompleted, setVideoCompleted] = useState(false);
  
  // Handle video progress tracking
  const handleVideoProgress = useCallback((event: any) => {
    debugLog(`Video progress for lesson "${videoTitle}":`, event);
  }, [videoTitle]);
  
  // Handle video completion
  const handleVideoEnded = useCallback(async () => {
    debugLog(`Video completed: ${videoTitle}`);
    
    if (lessonId && recordLessonWatched) {
      try {
        const result = await recordLessonWatched(courseId, lessonId.toString());
        if (result) {
          setVideoCompleted(true);
          debugLog(`Lesson ${lessonId} marked as watched for course ${courseId}`);
        }
      } catch (error) {
        console.error('Failed to record lesson watched:', error);
      }
    }
  }, [courseId, lessonId, recordLessonWatched, videoTitle]);
  
  return {
    videoCompleted,
    handleVideoProgress,
    handleVideoEnded
  };
}
