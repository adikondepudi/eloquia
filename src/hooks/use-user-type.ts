import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export type UserType = 'therapist' | 'client' | null;

export function useUserType() {
  const { user } = useUser();
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectUserType = async () => {
      if (!user) {
        setUserType(null);
        setIsLoading(false);
        return;
      }

      try {
        // Check localStorage first
        const storedUserType = localStorage.getItem('userType') as UserType;
        if (storedUserType) {
          setUserType(storedUserType);
          setIsLoading(false);
          return;
        }

        // Fallback to client if no stored user type
        setUserType('client');
      } catch (error) {
        console.error('Error detecting user type:', error);
        setUserType('client'); // Default to client on error
      } finally {
        setIsLoading(false);
      }
    };

    detectUserType();
  }, [user]);

  return { userType, isLoading };
}