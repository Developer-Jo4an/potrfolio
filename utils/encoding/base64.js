export const encode = message => btoa(encodeURIComponent(message));
export const decode = message => decodeURIComponent(atob(message));