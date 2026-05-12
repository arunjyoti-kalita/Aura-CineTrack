const getUserKey = (username: string, dataType: string) => `cinetrack_${username}_${dataType}`;

export const saveUserData = (username: string, dataType: string, data: any) => {
  localStorage.setItem(getUserKey(username, dataType), JSON.stringify(data));
};

export const loadUserData = (username: string, dataType: string, defaultValue: any = []) => {
  const stored = localStorage.getItem(getUserKey(username, dataType));
  try {
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Error parsing ${dataType} for ${username}:`, e);
    return defaultValue;
  }
};

export const clearUserSession = () => {
  sessionStorage.removeItem('cinetrack_current_user');
};

export const setUserSession = (username: string) => {
  sessionStorage.setItem('cinetrack_current_user', username);
};

export const getUserSession = () => {
  return sessionStorage.getItem('cinetrack_current_user');
};
