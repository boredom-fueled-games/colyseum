import { useAuth } from 'context/AuthContext';
import React from 'react';

type Props = {
  readonly customText?: React.ReactNode
}

export const AuthGuard: React.FC<Props> = (
  {
    children,
    customText
  }
) => {
  const {user, loading} = useAuth();

  if (loading) {
    return <>loading...</>;
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <section>
      <h2 className="text-center">Unauthorized</h2>
      <div className="text-center">
        {customText ||
        'You don\'t have permission to access this page. Please contact an admin if you think something is wrong.'}
      </div>
    </section>
  );
};
