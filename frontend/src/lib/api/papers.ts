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
    try {
      const response = await apiClient.get<ApiResponse<RawQuestionPaper>>(`/papers/${id}`);
      const paper = mapPaper(response.data.data);
      return paper;
    } catch (error) {
      throw error;
    }
  },

  async getByAssignment(assignmentId: string): Promise<QuestionPaper> {
    try {
      const response = await apiClient.get<ApiResponse<RawQuestionPaper>>(`/papers/assignment/${assignmentId}`);
      const paper = mapPaper(response.data.data);
      return paper;
    } catch (error) {
      throw error;
    }
  },

  async getJobStatus(jobId: string): Promise<JobStatus> {
    try {
      const response = await apiClient.get<ApiResponse<JobStatus>>(`/papers/jobs/${jobId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
