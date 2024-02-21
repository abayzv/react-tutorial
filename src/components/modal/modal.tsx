import React from "react";
import "./modal.css";
import { IoClose } from "react-icons/io5";
import autoAnimate from "@formkit/auto-animate";

const Modal = ({ children, isOpen, onClose, title = '' }: { children: React.ReactNode, isOpen: boolean, onClose: () => void, title?: string }) => {
    const parent = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const renderModal = () => {
        return (
            <div className="modal" >
                <div className='modal-content'>
                    <div className='close' onClick={onClose}><IoClose /></div>
                    {title && (
                        <div className='modal-header'>
                            <div className='title'>{title}</div>
                        </div>
                    )}
                    <div className='modal-body'>
                        {children}
                    </div>
                </div>
            </div >
        )
    }

    return (
        <div ref={parent}>
            {isOpen && renderModal()}
        </div>
    );
}

export default Modal;