export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const payload = JSON.parse(decodedJson);

    /* 
       IMPORTANTE: ASP.NET Core suele guardar el rol en una claim con una URL larga:
       "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
       o en la propiedad estándar "role" / "roles".
    */
    const rolesData = 
      payload.role || 
      payload.roles || 
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
      [];

    const roles = Array.isArray(rolesData) ? rolesData : [rolesData];

    return {
      ...payload,
      roles
    };
  } catch (error) {
    console.error("Token inválido o expirado:", error);
    return null;
  }
};