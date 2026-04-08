/**
 * Helper to resolve an avatar URL from a user object or raw avatar path.
 * Handles: null, external URLs (http), and local storage paths (avatars/xxx.png).
 *
 * Usage:
 *   import { getAvatarUrl } from '@/Helpers/avatar';
 *   const src = getAvatarUrl(user);  // from model with avatar_url or avatar field
 *   const src = getAvatarUrl('avatars/xxx.png');  // raw path
 */
export function getAvatarUrl(userOrPath) {
    if (!userOrPath) return null;

    // If it's a user-like object with avatar_url
    if (typeof userOrPath === 'object') {
        if (userOrPath.avatar_url) return userOrPath.avatar_url;
        userOrPath = userOrPath.avatar;
    }

    if (!userOrPath) return null;
    if (userOrPath.startsWith('http')) return userOrPath;

    return `/storage/${userOrPath}`;
}
