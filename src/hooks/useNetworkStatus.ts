import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from './useAppSelector';
import { setNetworkStatus } from '../store/appSlice';

export const useNetworkStatus = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      dispatch(setNetworkStatus(state.isConnected ? 'online' : 'offline'));
    });

    return () => unsubscribe();
  }, [dispatch]);
}; 