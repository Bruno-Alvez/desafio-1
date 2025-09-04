import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'hypesoft',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'hypesoft-frontend',
};

export const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = async () => {
  try {
    console.log('Initializing Keycloak...');
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });

    console.log('Keycloak init result:', authenticated);
    console.log('Keycloak token exists:', !!keycloak.token);
    console.log('Keycloak authenticated:', keycloak.authenticated);

    if (authenticated) {
      console.log('User authenticated');
      if (typeof window !== 'undefined' && (window.location.hash.includes('code=') || window.location.hash.includes('session_state=') || window.location.hash.includes('state='))) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      }
    } else {
      console.log('User not authenticated');
    }

    return authenticated;
  } catch (error) {
    console.error('Failed to initialize Keycloak:', error);
    return false;
  }
};

export const login = () => {
  keycloak.login({
    redirectUri: window.location.href,
  });
};

export const logout = () => {
  keycloak.logout({
    redirectUri: window.location.origin + '/login',
  });
};

export const getToken = () => {
  return keycloak.token;
};

export const isAuthenticated = () => {
  return keycloak.authenticated;
};

export const hasRole = (role: string) => {
  return keycloak.hasRealmRole(role);
};

export const getUserInfo = () => {
  if (keycloak.authenticated && keycloak.tokenParsed) {
    return {
      id: keycloak.tokenParsed.sub || '',
      username: keycloak.tokenParsed.preferred_username || '',
      email: keycloak.tokenParsed.email || '',
      firstName: keycloak.tokenParsed.given_name || '',
      lastName: keycloak.tokenParsed.family_name || '',
      roles: keycloak.tokenParsed.realm_access?.roles || [],
    };
  }
  return null;
};
