import Link from "next/link";
import React from "react";
import { Services } from "../services/services";
import useAuthStore from "../store/useAuthStore";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const setToken = useAuthStore((state) => state.setToken);

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const { access_token, refresh_token } = (
        await Services.login({ email, password })
      )?.data;
      setToken({ accessToken: access_token, refreshToken: refresh_token });
      router.push("/");
    } catch (error) {
      console.log(error?.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Log in</button>
      </form>
      <style jsx>{`
        input {
          height: 20px;
          display: block;
        }
      `}</style>
    </>
  );
};

export default LoginPage;
