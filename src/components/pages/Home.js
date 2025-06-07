import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useNavigate } from "react-router-dom";
import "../../Utils/pdfworker";
import "../CSSFiles/Home.css";
import { usePDF } from "../../context/PdfContext";

function Home() {
  const { pdfText, setPdfText, setQuestionCount, questionType, setQuestionType } = usePDF();
  const navigate = useNavigate();
  const [localQuestionCount, setLocalQuestionCount] = useState(5);
  const [showDialog, setShowDialog] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      try {
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(" ").replace(/\s+/g, " ");
          fullText += `\n\nPage ${i}:\n${pageText}`;
        }
        setPdfText(fullText);
      } catch (error) {
        console.error("Error reading PDF:", error);
        alert("Failed to read PDF file.");
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  const handleSubmit = () => {
    if (!pdfText.trim() || !localQuestionCount || !questionType) {
      setShowDialog(true);
      return;
    }

    setQuestionCount(localQuestionCount);
    navigate("/result");
  };

  return (
    <div className="pdf-container">
      <h2>📄 Generate Quiz Using PDF or Text</h2>

      <div className="input-group-inline">
        <div className="input-wrapper">
          <label>Choose PDF</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <div className="input-wrapper">
          <label>Number of Questions</label>
          <input
            type="number"
            min="1"
            max="20"
            value={localQuestionCount}
            onChange={(e) => setLocalQuestionCount(parseInt(e.target.value))}
            className="question-count-input"
            required
          />
        </div>

        <div className="input-wrapper">
          <label>Question Type</label>
          <select
            required
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="question-type-select"
          >
            <option value="">-- Select Type --</option>
            <option value="single">MCQ (Single Option)</option>
            <option value="multiple">MCQ (Multiple Options)</option>
            <option value="fill">Fill in the Blank</option>
            <option value="truefalse">True / False</option>
          </select>
        </div>
      </div>

      <textarea
        rows={15}
        value={pdfText}
        onChange={(e) => setPdfText(e.target.value)}
        placeholder="Extracted text will appear here..."
        required
      />

      <button onClick={handleSubmit}>Submit</button>

      {/* Custom Dialog Box */}
      {showDialog && (
        <div className="dialog-backdrop">
          <div className="dialog-box">
            <h3>Missing Information</h3>
            <p>Please make sure all fields are filled:</p>
            <ul>
              {!pdfText.trim() && <li>📝 PDF/Text area must not be empty</li>}
              {!localQuestionCount && <li>🔢 Please enter number of questions</li>}
              {!questionType && <li>❓ Please select a question type</li>}
            </ul>
            <button onClick={() => setShowDialog(false)}>Okay</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
