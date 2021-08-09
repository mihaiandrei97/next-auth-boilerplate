import Link from "next/link";
import React from "react";
import { Services } from "../services/services";
import useAuthStore from "../store/useAuthStore";
import withAuth from "../guards/withAuth";
import useHasMounted from "../hooks/useHasMounted";
import { useRouter } from "next/router";

const IndexPage = () => {
  const hasMounted = useHasMounted();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const clearToken = useAuthStore((state) => state.clearToken)
  const router = useRouter()

  React.useEffect(() => {
    setUser();
  }, []);
  
  if (!hasMounted) return null;

  const getHello = async () => {
    try {
      const result = await Services.getHello();
      console.log(result?.data);
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const logout = () => {
    // call logout endpoint
    clearToken();
    router.replace('/login')
  }

  if(!user) return <div>Loading user...</div>

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <h1>HOME</h1>
      <button onClick={getHello}>Get Hello Endpoint</button>
      <button onClick={logout}>logout</button>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </>
  );
};

export default withAuth(IndexPage);
