import useMe from 'hooks/auth';
import React from 'react';

type Props = {
  readonly accessToken?: string
  readonly customText?: React.ReactNode
}

export const AuthGuard: React.FC<Props> = (
  {
    children,
    accessToken,
    customText
  }
) => {
  const {user, loading} = useMe(accessToken);

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
