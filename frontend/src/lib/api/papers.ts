import apiClient from './client';
import type { QuestionPaper } from '@/types/question-paper';
import type { ApiResponse } from '@/types/api';

interface JobStatus {
  status: 'waiting' | 'active' | 'completed' | 'failed';
  percentage: number;
  message: string;
  paperId?: string | null;
  failedReason?: string | null;
}

interface RawQuestionPaper {
  _id: string;
  id?: string;
  duration?: number | string;
  durationMinutes?: number;
  [key: string]: unknown;
}

function mapPaper(raw: RawQuestionPaper): QuestionPaper {
  return {
    ...raw,
    id: raw._id || raw.id || '',
    durationMinutes: typeof raw.duration === 'string' ? parseInt(raw.duration) : raw.durationMinutes || raw.duration || 0,
  } as QuestionPaper;
}

export const paperApi = {
  async getById(id: string): Promise<QuestionPaper> {
    console.log('[paperApi] Fetching paper with id:', id);
    try {
      const response = await apiClient.get<ApiResponse<RawQuestionPaper>>(`/papers/${id}`);
      console.log('[paperApi] Response received:', response.data);
      const paper = mapPaper(response.data.data);
      console.log('[paperApi] Paper mapped successfully:', paper.title);
      return paper;
    } catch (error) {
      console.error('[paperApi] Error fetching paper:', error);
      throw error;
    }
  },

  async getByAssignment(assignmentId: string): Promise<QuestionPaper> {
    console.log('[paperApi] Fetching paper for assignment:', assignmentId);
    try {
      const response = await apiClient.get<ApiResponse<RawQuestionPaper>>(`/papers/assignment/${assignmentId}`);
      console.log('[paperApi] Response received:', response.data);
      const paper = mapPaper(response.data.data);
      console.log('[paperApi] Paper mapped successfully:', paper.title);
      return paper;
    } catch (error) {
      console.error('[paperApi] Error fetching paper by assignment:', error);
      throw error;
    }
  },

  async getJobStatus(jobId: string): Promise<JobStatus> {
    console.log('[paperApi] Fetching job status for:', jobId);
    try {
      const response = await apiClient.get<ApiResponse<JobStatus>>(`/papers/jobs/${jobId}`);
      console.log('[paperApi] Job status received:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('[paperApi] Error fetching job status:', error);
      throw error;
    }
  },
};
