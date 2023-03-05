import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NodePage from './pages/NodePage';
import GatePage from './pages/GatePage';
import NoPage from './pages/NoPage';
import Home from './pages/Home';
import Layout from './pages/components/Layout';

function App() {
    return (
        <BrowserRouter>
            <Layout />
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/node" element={<NodePage />}/>
                    <Route path="/gate" element={<GatePage />}/>
                    <Route path="*" element={<NoPage />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;