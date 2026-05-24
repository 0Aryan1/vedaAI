import apiClient from './client';
import type { Assignment, AssignmentFormValues, QuestionConfig } from '@/types/assignment';
import type { ApiResponse } from '@/types/api';

interface Section {
  name: string;
  questionType: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
  difficulty: string;
}

interface CreateAssignmentPayload {
  title: string;
  subject: string;
  gradeLevel: string;
  dueDate: string;
  sections: Section[];
  additionalInstructions?: string;
}

interface RawAssignment {
  _id: string;
  id?: string;
  [key: string]: unknown;
}

function mapAssignment(raw: RawAssignment): Assignment {
  return {
    ...raw,
    id: raw._id || raw.id || '',
  } as Assignment;
}

export const assignmentApi = {
  async create(payload: CreateAssignmentPayload): Promise<{ assignment: Assignment; jobId: string }> {
    try {
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      const response = await apiClient.post<ApiResponse<{ assignment: RawAssignment; jobId: string }>>(
        '/assignments',
        payload
      );
      return {
        assignment: mapAssignment(response.data.data.assignment),
        jobId: response.data.data.jobId,
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: unknown } };
      console.error('Assignment creation failed:', axiosError.response?.data);
      throw error;
    }
  },

  async getAll(): Promise<Assignment[]> {
    const response = await apiClient.get<ApiResponse<RawAssignment[]>>('/assignments');
    return response.data.data.map(mapAssignment);
  },

  async getById(id: string): Promise<Assignment> {
    const response = await apiClient.get<ApiResponse<RawAssignment>>(`/assignments/${id}`);
    return mapAssignment(response.data.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/assignments/${id}`);
  },
};

export function convertFormToPayload(
  values: AssignmentFormValues
): CreateAssignmentPayload {
  const sections = (values.questionConfigs as QuestionConfig[])
    .filter((config) => config.count > 0)
    .map((config) => ({
      name: config.label,
      questionType: config.id,
      numberOfQuestions: Number(config.count),
      marksPerQuestion: Number(config.marks),
      difficulty: 'medium',
    }));

  if (sections.length === 0) {
    throw new Error('Please add at least one question type with count greater than 0');
  }

  const title = (values.title || '').trim() || 'Create Assignment';
  const subject = (values.subject || '').trim() || 'General';
  const gradeLevel = (values.gradeLevel || '').trim() || 'General';

  if (!title || title === '') {
    throw new Error('Title is required');
  }
  if (!subject || subject === '') {
    throw new Error('Subject is required');
  }
  if (!gradeLevel || gradeLevel === '') {
    throw new Error('Grade level is required');
  }

  return {
    title,
    subject,
    gradeLevel,
    dueDate: values.dueDate,
    sections,
    additionalInstructions: values.instructions,
  };
}
