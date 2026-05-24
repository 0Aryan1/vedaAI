export async function extractTextFromFile(file: File): Promise<string> {
  try {
    if (file.type === "application/pdf") {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: unknown) => {
            if (typeof item === 'object' && item !== null && 'str' in item) {
              return (item as { str: string }).str;
            }
            return '';
          })
          .join(" ");
        text += pageText + "\n";
      }

      return text.trim();
    } else if (file.type === "text/plain") {
      return file.text();
    }
    return "";
  } catch (error) {
    console.error("Error extracting text from file:", error);
    return "";
  }
}
