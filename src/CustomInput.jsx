import React from 'react';

// React 19 Feature: Ref as a Prop & Ref Cleanup
export function CustomInput({ label, ref, ...props }) {

    const handleRef = (element) => {
        if (typeof ref === 'function') {
            ref(element);
        } else if (ref) {
            ref.current = element;
        }

        if (element) {
            const handleFocus = () => element.classList.add('focused');
            const handleBlur = () => element.classList.remove('focused');

            element.addEventListener('focus', handleFocus);
            element.addEventListener('blur', handleBlur);

            // React 19 Feature: Ref Cleanup Function
            return () => {
                element.removeEventListener('focus', handleFocus);
                element.removeEventListener('blur', handleBlur);
            };
        }
    };

    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <input ref={handleRef} className="input-field" {...props} />
        </div>
    );
}