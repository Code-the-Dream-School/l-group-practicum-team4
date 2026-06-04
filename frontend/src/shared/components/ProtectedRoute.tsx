import { Navigate } from "react-router";
import { useAuth } from "../../features/auth/context/useAuth";

type Props = {
	children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
	const { state } = useAuth();

	if (!state.isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
