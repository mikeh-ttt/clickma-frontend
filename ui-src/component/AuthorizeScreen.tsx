import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

const AuthorizeScreen = ({
  client_id,
  client_secret,
  host,
}: {
  client_id: string;
  client_secret: string;
  host: string;
}) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  const [workspaceId, setWorkspaceId] = useState<string | undefined>();

  const [id, setId] = useState<string | undefined>();

  const { data: accessTokenResponse } = useQuery({
    queryKey: ['fetch-access-token'],
    queryFn: async () => {
      const response = await fetch(`${host}/api/oauth/access-token`, {
        method: 'POST',

        body: JSON.stringify({ id }),
      });
      return await response.json();
    },
    enabled: accessToken === undefined,
  });

  const fetchWorkspace = useMutation({
    mutationFn: async () => {
      // don't fetch until access token is available
      if (!accessToken) return;

      console.log({ accessToken });
      const response = await fetch(`https://api.clickup.com/api/v2/user`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: '*/*',
          Authorization: accessToken,
        },
      });
      return await response.json();
    },

    onSuccess: (data, variables, context) => {
      setWorkspaceId(data);
    },
  });

  useEffect(() => {
    setId(uuid());
  }, []);

  useEffect(() => {
    if (accessTokenResponse?.data?.access_token) {
      setAccessToken(accessTokenResponse.data.access_token);
      setWorkspaceId(accessTokenResponse.data.workspace);
    }
  }, [accessTokenResponse]);

  // useEffect(() => {
  //   if (accessToken) {
  //     fetchWorkspace.mutate();
  //   }
  // }, [accessToken]);

  return (
    <div>
      {workspaceId}
      {accessToken}
      {!accessToken && (
        <button
          onClick={() => {
            window.open(`${host}/api/oauth/clickup?id=${id}`);
          }}
        >
          Authorize
        </button>
      )}
      {accessToken && (
        <button
          onClick={() => {
            parent?.postMessage?.(
              {
                pluginMessage: {
                  type: 'saveTokenAndWorkspace',
                  accessToken,
                  workspaceId,
                },
              },
              '*'
            );
          }}
        >
          Close window
        </button>
      )}
    </div>
  );
};

export default AuthorizeScreen;
