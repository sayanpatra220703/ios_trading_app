import { Redirect } from 'expo-router';

export default function Index() {
  // For demo purposes, redirect to login
  // In a real app, you'd check authentication status here
  return <Redirect href="/(auth)/login" />;
}