import apiClient from './client';
import type { QuestionPaper } from '@/types/question-paper';
import type { ApiResponse } from '@/types/api';

interface JobStatus {
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  failedReason?: string;
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
    const response = await apiClient.get<ApiResponse<RawQuestionPaper>>(`/papers/${id}`);
    return mapPaper(response.data.data);
  },

  async getByAssignment(assignmentId: string): Promise<QuestionPaper> {
    const response = await apiClient.get<ApiResponse<RawQuestionPaper>>(`/papers/assignment/${assignmentId}`);
    return mapPaper(response.data.data);
  },

  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await apiClient.get<ApiResponse<JobStatus>>(`/papers/jobs/${jobId}`);
    return response.data.data;
  },
};
