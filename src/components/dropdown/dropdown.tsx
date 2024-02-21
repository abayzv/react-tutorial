import React from "react";
import autoAnimate from "@formkit/auto-animate";
import "./dropdown.css";
import { IoClose } from "react-icons/io5";

const Dropdown = ({ children, className, icon, title }: { children: React.ReactNode, className?: string, icon?: React.ReactNode, title: string }) => {

    const parent = React.useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const onClose = () => {
        setIsOpen(false);
    }

    return (
        <>
            <div className="dropdown">
                <button className={className} onClick={() => setIsOpen(true)}>{icon} {title}</button>
                <div ref={parent}>
                    {isOpen && (
                        <div className="dropdown-content">
                            <div className='close' onClick={onClose}><IoClose /></div>
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
};

export default Dropdown;