import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import ErrorAlert from '../components/ErrorAlert';
import NotificationToast from '../components/NotificationToast';
import { useAuth } from '../context/AuthContext';

export const MainLayout = () => {
    const { errorMessage, clearErrorMessage } = useAuth();

    return (
        <>
            <Header />
            <ErrorAlert message={errorMessage} onClose={clearErrorMessage} />
            <NotificationToast />
            <Outlet />
        </>
    );
};
