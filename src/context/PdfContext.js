import React, { createContext, useContext, useState } from "react";

const PdfContext = createContext();

export const PdfProvider = ({ children }) => {
  const [pdfText, setPdfText] = useState("");
  const [questionCount, setQuestionCount] = useState(5); // default to 5
    const [questionList, setQuestionList] = useState([]); // ✅ new
  const [questionType, setQuestionType] = useState("single"); // new state


  return (
    <PdfContext.Provider value={{ pdfText, setPdfText, questionCount, setQuestionCount,questionList, setQuestionList,questionType, setQuestionType }}>
      {children}
    </PdfContext.Provider>
  );
};

export const usePDF = () => useContext(PdfContext);
