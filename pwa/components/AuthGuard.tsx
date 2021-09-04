import useMe from 'data/auth';
import React, { useEffect } from 'react';
import {
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from 'recoil';
import { authTokenState, loadingState, meSelector, meState } from 'state/auth';
import { User } from 'types/User';
import { setAuthorization } from 'adapters/axios';

type Props = {
  // readonly role?: 'admin'
  readonly accessToken?: string
  readonly customText?: React.ReactNode
}

export const AuthGuard: React.FC<Props> = ({
                                             children,
                                             accessToken,
                                             customText
                                           }) => {
  const {user,loading} = useMe(accessToken);

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
