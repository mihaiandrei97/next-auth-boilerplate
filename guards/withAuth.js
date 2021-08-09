import { useRouter } from "next/router";
import useAuthStore from "../store/useAuthStore";

const withAuth = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== "undefined") {
        const Router = useRouter();
        const token = useAuthStore(state => state.token)

        const isLoggedIn = !!token

      if (!isLoggedIn) {
        Router.replace("/login");
        return null;
      }

      return <WrappedComponent {...props} />;
    }
    return null;
  };
};

export default withAuth;
