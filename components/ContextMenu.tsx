import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { ChevronRight } from './Icons';

export interface ContextMenuItem {
    label: string;
    action?: () => void;
    submenu?: ContextMenuItem[];
    link?: string;
}

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    items: ContextMenuItem[];
}

const Menu: React.FC<{ items: ContextMenuItem[], isSubmenu?: boolean }> = ({ items, isSubmenu = false }) => {
    const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
    
    return (
        <div className={`bg-[#282828] text-white rounded-md shadow-2xl p-1 min-w-[180px] ${isSubmenu ? 'absolute left-full -top-1' : ''}`}>
            {items.map((item, index) => {
                 const content = (
                    <button
                        key={item.label}
                        onClick={item.action}
                        onMouseEnter={() => item.submenu && setActiveSubmenu(index)}
                        onMouseLeave={() => item.submenu && setActiveSubmenu(null)}
                        className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-[#3e3e3e] flex justify-between items-center"
                    >
                        <span>{item.label}</span>
                        {item.submenu && <ChevronRight size={16} />}
                        {activeSubmenu === index && item.submenu && <Menu items={item.submenu} isSubmenu />}
                    </button>
                );

                return item.link ? <Link to={item.link} key={item.label} className="w-full">{content}</Link> : content;
            })}
        </div>
    );
};


export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, items }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const style: React.CSSProperties = {
        top: y,
        left: x,
        position: 'fixed',
        zIndex: 1000,
    };

    return ReactDOM.createPortal(
        <div ref={menuRef} style={style}>
            <Menu items={items} />
        </div>,
        document.body
    );
};