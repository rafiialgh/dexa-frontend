import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUser, completeInitialization } from '@/store/authSlice';
import SplashScreen from '@/components/SplashScreen';
import { useMe } from '@/hooks/useAuth';
import { type RootState } from '@/store';

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state: RootState) => state.auth);
  const hasInitialized = useRef(false);

  const isStaging = import.meta.env.MODE === 'staging';

  const { data, isLoading, isSuccess, isError } = useMe();

  useEffect(() => {
    if (isSuccess && data?.data) {
      const userData = data.data;

      if (userData?.id) {
        dispatch(setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status || 'active',
        }));

        hasInitialized.current = true;
      } else {
        dispatch(completeInitialization());
      }
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      console.log('Failed to fetch user data, clearing auth');
      dispatch(clearUser());
      hasInitialized.current = true;
    }
  }, [isError, dispatch]);

  if (isLoading || isInitializing) return <SplashScreen />;

  return (
    <>
      {isStaging && (
        <div className="w-full bg-yellow-100 text-yellow-900 text-center py-1 text-xs font-bold uppercase tracking-widest border border-yellow-200 z-50">
          Staging - Testing Environment
        </div>
      )}
      {children}
    </>
  )
};

export default AppInitializer;