import { use } from 'react';
import { UserContext } from './UserContext';

// React 19 Feature: use() with Context — reads user info from UserContext
export function UserProfile() {
    const { user } = use(UserContext);

    if (!user) return null;

    return (
        <div className="user-profile">
            <p>Logged in as <strong className="username-highlight">{user.name}</strong></p>
            <p className="user-email">{user.email}</p>
        </div>
    );
}
