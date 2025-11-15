
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from './Icons';

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-10 p-4 flex justify-between items-center bg-[#121212] bg-opacity-80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <button onClick={() => navigate(-1)} className="bg-black rounded-full p-1.5">
                    <ChevronLeft size={28} />
                </button>
                <button onClick={() => navigate(1)} className="bg-black rounded-full p-1.5">
                    <ChevronRight size={28} />
                </button>
            </div>
            <div>
                <button className="bg-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                    A
                </button>
            </div>
        </header>
    );
};

export default Header;