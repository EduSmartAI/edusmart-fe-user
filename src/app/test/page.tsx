"use client"
import { useSessionStore } from "EduSmart/stores/Test/sessionTestStore";
import { useEffect } from "react";

export default function SessionComponent() {
  const { session, isLoading, error, fetchSession } = useSessionStore();

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>User Session</h3>
      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      ) : (
        <p>No session found</p>
      )}
    </div>
  );
}
