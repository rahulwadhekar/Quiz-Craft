import React from 'react';
import "../CSSFiles/About.css"; 
import { FaFilePdf, FaRobot, FaDownload, FaGithub, FaReact, FaUserTie } from 'react-icons/fa';

function About() {
  return (
    <div className="container text-center about-page">
      <h1 className="mt-4 animated-title">About QuizCraft 🧠</h1>

      <div className="project-section mt-4 fade-in">
        <h3>📌 Project Overview</h3>
        <p>
          <strong>QuizCraft</strong> is an AI-powered quiz generator that extracts text from PDF files 
          and uses Google Gemini AI to generate smart quiz questions. It helps educators, learners, and 
          professionals convert documents into quizzes quickly and easily.
        </p>
      </div>

      <div className="features-section mt-4 fade-in">
        <h3>🚀 Key Features</h3>
        <ul className="text-start feature-list">
          <li><FaFilePdf /> Upload any PDF document</li>
          <li><FaRobot /> Generate quiz questions using Gemini AI</li>
          <li><FaReact /> Preview and take AI-generated quizzes</li>
          <li><FaDownload /> Download generated quizzes as PDF</li>
          <li>⚛️ Built using React & Google Generative API</li>
        </ul>
      </div>

      <div className="dev-info mt-5 fade-in">
        <h3><FaUserTie /> Developer Info</h3>
        <p><strong>Team Name:</strong> CodeAce</p>
        <p><strong>Name:</strong> Rahul Wadhekar</p>
        <p><strong>Role:</strong> Full Stack Developer (Java + React)</p>
        <p><strong>Email:</strong> <a href="mailto:wadhekarrahul1818@gmail.com">wadhekarrahul1818@gmail.com</a></p>
        <p><strong>GitHub:</strong> <a href="https://github.com/rahulwadhekar/Quiz-Craft" target="_blank" rel="noopener noreferrer"><FaGithub /> github.com/rahulwadhekar</a></p>
        <p><strong>Location:</strong> Pune, Maharashtra, India</p>
      </div>
    </div>
  );
}

export default About;
