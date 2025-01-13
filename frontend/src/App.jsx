import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chatbot from "./pages/chatbot";
import "./index.css";
import React from "react";
import Test from "./components/test";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Chatbot />} />
                <Route path="/test" element={<Test />} />
            </Routes>
        </BrowserRouter>
    );
}
