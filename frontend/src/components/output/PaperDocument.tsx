import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { QuestionPaper } from "@/types/question-paper";

const styles = StyleSheet.create({
  document: {
    backgroundColor: '#ffffff',
  },
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  meta: {
    fontSize: 11,
    marginBottom: 5,
    color: '#333333',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginTop: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
    padding: 6,
  },
  sectionInstruction: {
    fontSize: 11,
    marginBottom: 12,
    color: '#555555',
  },
  question: {
    marginBottom: 12,
    paddingLeft: 10,
  },
  questionText: {
    fontSize: 11,
    marginBottom: 4,
  },
  options: {
    fontSize: 10,
    marginLeft: 12,
    marginTop: 4,
  },
  option: {
    marginBottom: 2,
  },
  marks: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  difficulty: {
    fontSize: 9,
    color: '#888888',
  },
});

export function PaperDocument({ paper }: { paper: QuestionPaper }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View>
          <Text style={styles.title}>{paper.title}</Text>
          <Text style={styles.subtitle}>{paper.subject}</Text>
          <Text style={styles.meta}>Grade/Class: {paper.className || 'N/A'}</Text>
          <Text style={styles.meta}>Total Marks: {paper.totalMarks}</Text>
          <Text style={styles.meta}>Duration: {paper.durationMinutes} minutes</Text>
          <Text style={styles.meta}>Due Date: {new Date(paper.dueDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.divider} />

        {/* Student Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <Text style={styles.meta}>Name: _________________________</Text>
          <Text style={styles.meta}>Roll No: _________________________</Text>
          <Text style={styles.meta}>Date: _________________________</Text>
        </View>

        {/* Question Sections */}
        {paper.sections.map((section) => (
          <View key={section.id} style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>
              Section {section.id}: {section.title}
            </Text>
            <Text style={styles.sectionInstruction}>{section.instruction}</Text>

            {/* Questions */}
            {section.questions.map((question) => (
              <View key={question.id} style={styles.question}>
                <Text style={styles.questionText}>
                  <Text style={{ fontWeight: 'bold' }}>{question.id}.</Text> {question.text}
                </Text>

                {/* Options for MCQ */}
                {question.options && question.options.length > 0 && (
                  <View style={styles.options}>
                    {question.options.map((option, idx) => (
                      <Text key={idx} style={styles.option}>
                        ({String.fromCharCode(65 + idx)}) {option}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Question metadata */}
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.marks}>
                    [{question.marks} mark{question.marks > 1 ? 's' : ''}]
                  </Text>
                  <Text style={{ ...styles.difficulty, marginLeft: 16 }}>
                    Difficulty: {question.difficulty}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
