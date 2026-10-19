import { useActionState, useContext, useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import { UserContext } from './UserContext';
import { registerUser } from './api';
import { CustomInput } from './CustomInput';

// React 19 Feature: useFormStatus
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn-primary" disabled={pending}>
            {pending ? 'Registering...' : 'Register'}
        </button>
    );
}

export function RegistrationForm() {
    const { setUser } = useContext(UserContext);

    // React 19 Feature: Ref as a Prop — callback ref to auto-focus the Name input
    const nameInputRef = useCallback((element) => {
        if (element) element.focus();
    }, []);

    // React 19 Feature: useActionState
    const [state, action] = useActionState(async (prevState, formData) => {
        const result = await registerUser(formData);
        if (result.success) {
            // Brief delay so user sees the success message before transition
            setTimeout(() => setUser(result.user), 1200);
            return { success: true, message: 'Registration successful! Redirecting...' };
        }
        return { success: false, error: result.error };
    }, null);

    return (
        <div className="form-container">
            <h2>Create an Account</h2>
            {state?.error && <p className="error-text">{state.error}</p>}
            {state?.success && <p className="success-text">{state.message}</p>}

            {/* React 19 Feature: Form Actions */}
            <form action={action}>
                {/* React 19 Feature: ref passed as a regular prop (no forwardRef needed) */}
                <CustomInput label="Name" name="name" type="text" ref={nameInputRef} />
                <CustomInput label="Email" name="email" type="email" />
                <CustomInput label="Password" name="password" type="password" />
                <SubmitButton />
            </form>
        </div>
    );
}