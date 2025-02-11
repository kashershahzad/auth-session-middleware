import { getSession } from 'next-auth/react';

export const auth = async () => {
  const session = await getSession();
  return session;
  
};
