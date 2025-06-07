import React, { createContext, useContext, useState } from "react";

const PdfContext = createContext();

export const PdfProvider = ({ children }) => {
  const [pdfText, setPdfText] = useState("");
  const [questionCount, setQuestionCount] = useState(5); 
    const [questionList, setQuestionList] = useState([]); 
  const [questionType, setQuestionType] = useState("truefalse");


  return (
    <PdfContext.Provider value={{ pdfText, setPdfText, questionCount, setQuestionCount,questionList, setQuestionList,questionType, setQuestionType }}>
      {children}
    </PdfContext.Provider>
  );
};

export const usePDF = () => useContext(PdfContext);
