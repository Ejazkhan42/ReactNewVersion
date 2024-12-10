import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Internal utility for demos
 * @ignore - internal component.
 */

const DUMMY_BASE = 'https://example.com';

/**
 * Hook to create a router for demos using react-router-dom, with state management.
 * @param {string} initialUrl - Initial URL path.
 * @returns {object} Router object with pathname, searchParams, navigate, and state.
 */
export function useDemoRouter(initialUrl = '/') {
  const location = useLocation();
  const navigate = useNavigate();

  const [url, setUrl] = React.useState(() => new URL(initialUrl, DUMMY_BASE));
  const [state, setState] = React.useState(null); // Store state

  const router = React.useMemo(() => {
    return {
      pathname: url.pathname,
      searchParams: url.searchParams,
      state, // Expose the state in the router object
      navigate: (newUrl, newState = {}) => {
        const nextUrl = new URL(newUrl, DUMMY_BASE);
        if (nextUrl.pathname !== url.pathname || nextUrl.search !== url.search || state !== newState) {
          // Use the navigate function from react-router-dom to push a new URL, along with state
          navigate(newUrl, { state: newState }); // Pass state when navigating
          setUrl(nextUrl); // Update the in-memory URL state
          setState(newState); // Update the in-memory state
        }
      },
      setState, // Optionally expose the setter to modify the state directly
    };
  }, [url.pathname, url.search, state, navigate]); // Memoize the router object

  return router;
}
