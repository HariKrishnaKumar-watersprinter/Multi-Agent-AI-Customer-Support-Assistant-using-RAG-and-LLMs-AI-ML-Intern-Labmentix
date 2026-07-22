"use client";
import AuthForm from "../components/AuthForm";
import MainPage from "../pages/MainPage";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";

export default function Home() {
  const authState = useAuth();
  const chatState = useChat(authState.username);

  if (!authState.token) {
    return <AuthForm handleAuth={authState.handleAuth} authError={authState.authError} />;
  }

  return <MainPage chatState={chatState} authState={authState} />;
}