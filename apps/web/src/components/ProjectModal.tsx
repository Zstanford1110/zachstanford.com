'use client';

import { useState, useEffect, useRef } from 'react';

interface ProjectModalProps {
  loadedDataUnitLabel: string;
}

export const ProjectModal = ({ loadedDataUnitLabel }: ProjectModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null)
  const dataUnitName = loadedDataUnitLabel.split('-')[1];

  // Configure browser history to close modal whenever navigating back on desktop or mobile
  useEffect(() => {
    // When modal opens, add a history entry
    if (isOpen) {
      window.history.pushState({ modal: true }, '');
    }

    // Handle back button
    const handlePopState = (event: PopStateEvent) => {
      // If modal is open and back button is pressed, prevent navigation
      if (isOpen) {
        // Prevent the default back action
        event.preventDefault();
        // Close the modal
        setIsOpen(false);
        // Push another state to replace the one we just popped
        window.history.pushState(null, '');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen]);

  // Close window when user presses escape (or back arrow on mobile)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus trap and management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div
            ref={modalRef}
            className="fixed left-[10%] right-[10%] top-[10%] bottom-[10%] z-50 flex flex-col overflow-auto bg-gray-700 text-white rounded-lg border-2 shadow-xl"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="relative p-4 border-b border-gray-600">
              <h2 id="modal-title" className="text-xl font-semibold">Log: {dataUnitName}</h2>
              <button
                className="absolute top-4 right-4 text-red-500 hover:text-red-300 p-2"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                X
              </button>
            </div>

            <div className="flex-grow p-4">
              {/* Your modal content goes here */}
            </div>

            <div className="border-t border-gray-600 p-4 flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Exit
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};