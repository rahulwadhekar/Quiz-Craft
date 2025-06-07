import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePDF } from "../../context/PdfContext";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import "../CSSFiles/Result.css";

function Result() {
  const {
    pdfText,
    questionCount,
    questionList,
    setQuestionList,
    questionType,
  } = usePDF();
  const navigate = useNavigate();

  const [answer, setAnswer] = useState("");
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [showSummaryPreview, setShowSummaryPreview] = useState(false);

  // Dialog state
  const [dialog, setDialog] = useState({ show: false, title: "", message: "", onConfirm: null });

  useEffect(() => {
    async function generateQuestions() {
      if (!pdfText || !pdfText.trim()) return;

      setGenerating(true);

      const apiKey = "";

      const prompts = {
        single: `Generate exactly ${questionCount} MCQs (Single Option) from the text below.
Each question must have:
Q: Your question
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Answer: (Only one correct option like A) or B))`,

        multiple: `Generate ${questionCount} MCQs (Multiple Correct Answers) from the text.
Each question must include:
Q: Question
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Answer: A), C) (include all correct options, comma-separated)`,

        fill: `Generate ${questionCount} Fill-in-the-Blank questions from the content.
Each line should be:
Q: The capital of India is ______.
Answer: New Delhi`,

        truefalse: `Generate ${questionCount} True or False questions from the content.
Format each like:
Q: The earth is flat.
Answer: False`,
      };

      const finalPrompt = `${prompts[questionType]}

Content:
${pdfText.slice(0, 1500).replace(/\s+/g, " ")}`;

      try {
        const response = await axios({
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: {
            contents: [{ parts: [{ text: finalPrompt }] }],
          },
        });

        const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiText) {
          setAnswer("⚠️ Empty response.");
          setDialog({
            show: true,
            title: "Warning",
            message: "Received empty response from API.",
          });
          setGenerating(false);
          return;
        }

        setAnswer(aiText);

        // Parse questions
        const lines = aiText.split("\n").filter(Boolean);
        const questions = [];
        let current = {};

        for (let line of lines) {
          line = line.trim();

          if (line.startsWith("Q:")) {
            if (current.question) questions.push(current);
            current = { question: line.slice(2).trim() };
          } else if (line.startsWith("A)")) {
            current.A = line.slice(2).trim();
          } else if (line.startsWith("B)")) {
            current.B = line.slice(2).trim();
          } else if (line.startsWith("C)")) {
            current.C = line.slice(2).trim();
          } else if (line.startsWith("D)")) {
            current.D = line.slice(2).trim();
          } else if (line.toLowerCase().startsWith("answer:")) {
            current.correct = line.split(":")[1].trim();
          }
        }

        if (current.question) questions.push(current);

        if (questions.length === 0) {
          setDialog({
            show: true,
            title: "No Questions Generated",
            message: "No questions were generated from the text. Please revise and submit your text again.",
          });
          setGenerating(false);
          return;
        }

        setQuestionList(questions);

        setDialog({
          show: true,
          title: "Success",
          message: `Generated ${questions.length} questions successfully!`,
        });

        // Auto Summary
        const summaryText = `Summary of Generated Questions:
- Type: ${questionType.toUpperCase()}
- Count: ${questionCount}
- Extracted from PDF content using Gemini AI
- Parsed into structured format
- Suitable for quizzes, tests, learning sessions
- Each question contains ${
          questionType === "fill" ? "a blank and answer" : "options and answers"
        }`;

        setSummary(summaryText);
      } catch (error) {
        console.error("❌ API Error:", error);
        setAnswer("❌ Failed to generate answer.");
        setDialog({
          show: true,
          title: "Error",
          message: "Failed to generate questions due to an API error.",
        });
      }

      setGenerating(false);
    }

    generateQuestions();
  }, [pdfText, questionCount, questionType, setQuestionList]);

  const handleTakeQuiz = () => {
    if (questionList.length === 0) {
      setDialog({
        show: true,
        title: "No Questions",
        message: "No questions generated. Please generate questions before taking the quiz.",
      });
      return;
    }
    navigate("/quiz");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(answer, 180);
    doc.text(lines, 10, 10);
    doc.save(`QuizCraft-${questionType}-Questions.pdf`);

    setDialog({
      show: true,
      title: "Download Complete",
      message: "Questions PDF downloaded successfully!",
    });
  };

  const handleDownloadSummaryPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(summary, 180);
    doc.text(lines, 10, 10);
    doc.save(`QuizCraft-${questionType}-Summary.pdf`);

    setDialog({
      show: true,
      title: "Download Complete",
      message: "Summary PDF downloaded successfully!",
    });
  };

  const closeDialog = () => {
    setDialog({ show: false, title: "", message: "", onConfirm: null });
  };

  return (
    <div className="result-container">
      <h2>📘 Extracted Result ({questionType.toUpperCase()})</h2>
      <div className="result-box">
        {generating ? (
          <p>Generating questions...</p>
        ) : (
          <ReactMarkdown>{answer}</ReactMarkdown>
        )}
      </div>

      <div className="button-group">
        <button onClick={() => navigate("/")}>Go Back</button>
        {!generating && answer && (
          <>
            <button onClick={handleDownloadPDF}>Download PDF</button>
            <button onClick={handleTakeQuiz}>Take Quiz</button>
          </>
        )}
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <h3>📄 Summary</h3>
        <textarea readOnly rows={10} value={summary} className="summary-textarea" />
        <div className="summary-buttons">
          <button onClick={() => setShowSummaryPreview(true)}>Preview</button>
          <button onClick={handleDownloadSummaryPDF}>Download Summary</button>
        </div>
      </div>

      {showSummaryPreview && (
        <div className="preview-box">
          <h4>📃 Summary Preview</h4>
          <pre>{summary}</pre>
          <button onClick={() => setShowSummaryPreview(false)}>Close</button>
        </div>
      )}

      {/* Dialog Box */}
      {dialog.show && (
        <div className="dialog-backdrop" onClick={closeDialog}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h3>{dialog.title}</h3>
            <p>{dialog.message}</p>
            <button onClick={closeDialog}>Okay</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Result;
