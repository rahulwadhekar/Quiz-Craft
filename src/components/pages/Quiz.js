import React, { useEffect, useState } from "react";
import { usePDF } from "../../context/PdfContext";
import { useNavigate } from "react-router-dom";
import "../CSSFiles/Quiz.css";
import jsPDF from "jspdf";



function Quiz() {
  const { questionList, questionType } = usePDF();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(questionType === "multiple" ? [] : "");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (questionList.length === 0) navigate("/");
  }, [questionList, navigate]);

  useEffect(() => {
    if (showResult || showModal) return;
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          submitAnswerAndNext();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [currentIndex, showResult, showModal]);

  const current = questionList[currentIndex];

  const handleOptionClick = (opt) => {
    if (questionType === "multiple") {
      setSelected((prev) =>
        prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
      );
    } else {
      setSelected(opt);
    }
  };

  const isCorrectAnswer = (selected, correct) => {
    if (questionType === "multiple") {
      const correctArray = correct.split(",").map((s) => s.trim());
      return (
        selected.length === correctArray.length &&
        selected.every((val) => correctArray.includes(val))
      );
    }
    return selected?.toString().trim().toLowerCase() === correct?.toString().trim().toLowerCase();
  };

  const submitAnswerAndNext = () => {
    const currentQ = questionList[currentIndex];
    const correct = currentQ.correct;
    const isCorrect = isCorrectAnswer(selected, correct);

    const updatedUserAnswers = [
      ...userAnswers,
      {
        ...currentQ,
        selected,
        isCorrect,
      },
    ];

    setUserAnswers(updatedUserAnswers);
    if (isCorrect) setScore((prev) => prev + 1);
    setSelected(questionType === "multiple" ? [] : "");

    if (currentIndex + 1 < questionList.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimer(30);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (
      (questionType === "multiple" && selected.length === 0) ||
      (questionType !== "multiple" && !selected)
    ) {
      alert("Please select or enter an answer before proceeding.");
      return;
    }
    submitAnswerAndNext();
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("QuizCraft - Score Report", 20, 20);
    let y = 30;
    userAnswers.forEach((q, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`Q${idx + 1}: ${q.question}`, 10, y);
      y += 7;

      if (questionType === "fill" || questionType === "truefalse") {
        doc.text(`✅ Correct: ${q.correct}`, 12, y);
        y += 6;
        doc.text(`🧠 Your Answer: ${q.selected || "Not Answered"}`, 12, y);
        y += 10;
      } else {
        ["A", "B", "C", "D"].forEach((opt) => {
          if (q[opt]) {
            const prefix =
              opt === q.correct ? "✔️" : Array.isArray(q.selected) && q.selected.includes(opt) ? "❌" : q.selected === opt ? "❌" : " ";
            doc.text(`${prefix} ${opt}) ${q[opt]}`, 12, y);
            y += 6;
          }
        });
        doc.text(`✅ Correct: ${q.correct} | 🧠 Your Answer: ${Array.isArray(q.selected) ? q.selected.join(", ") : q.selected || "Not Answered"}`, 12, y);
        y += 10;
      }
    });
    doc.save("QuizCraft_Score_Report.pdf");
  };

  if (showResult) {
    return (
      <div className="quiz-container">
        <h2>🎉 Quiz Completed</h2>
        <p className="score">Your Score: {score} / {questionList.length}</p>
        <div className="scorecard">
          {userAnswers.map((q, index) => (
            <div key={index} className={`question-card ${q.isCorrect ? "correct" : "wrong"}`}>
              <p><strong>Q{index + 1}:</strong> {q.question}</p>
              {questionType === "fill" || questionType === "truefalse" ? (
                <p>✅ Correct: {q.correct} | 🧠 Your Answer: {q.selected || "Not Answered"}</p>
              ) : (
                <>
                  <ul>
                    {["A", "B", "C", "D"].map((opt) =>
                      q[opt] ? (
                        <li
                          key={opt}
                          className={
                            opt === q.correct
                              ? "correct-option"
                              : Array.isArray(q.selected) && q.selected.includes(opt)
                              ? "selected-option"
                              : q.selected === opt
                              ? "selected-option"
                              : ""
                          }
                        >
                          {opt}) {q[opt]}
                        </li>
                      ) : null
                    )}
                  </ul>
                  <p>
                    ✅ Correct: {q.correct} | 🧠 Your Answer: {Array.isArray(q.selected) ? q.selected.join(", ") : q.selected || "Not Answered"}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="button-group">
          <button onClick={() => navigate("/")} className="download-button">Go to Home</button>
          <button onClick={handleDownloadReport} className="download-button">Download Report</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>📝 Quiz</h2>
      <p><strong>Time Left:</strong> {timer}s</p>
      {current ? (
        <>
          <p><strong>Q{currentIndex + 1}:</strong> {current.question}</p>
          {questionType === "fill" ? (
            <input
              type="text"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              placeholder="Type your answer"
              className="text-answer-input"
            />
          ) : questionType === "truefalse" ? (
            <div className="options">
              {["True", "False"].map((opt) => (
                <button
                  key={opt}
                  className={`option-btn ${selected === opt ? "selected" : ""}`}
                  onClick={() => setSelected(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="options">
              {["A", "B", "C", "D"].map((opt) =>
                current[opt] ? (
                  <button
                    key={opt}
                    className={`option-btn ${
                      questionType === "multiple"
                        ? selected.includes(opt)
                          ? "selected"
                          : ""
                        : selected === opt
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleOptionClick(opt)}
                  >
                    {opt}) {current[opt]}
                  </button>
                ) : null
              )}
            </div>
          )}
          <button
            onClick={handleNext}
            className="next-btn"
          >
            {currentIndex + 1 === questionList.length ? "Finish" : "Next"}
          </button>
        </>
      ) : (
        <p>⚠️ No questions found</p>
      )}
    </div>
  );
}

export default Quiz;
