import { useQuery } from '@tanstack/react-query';
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

  const [id, setId] = useState<string | undefined>();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch(`${host}/api/oauth/access-token`, {
        method: 'POST',

        body: JSON.stringify({ id }),
      });
      return await response.json();
    },
    refetchInterval: 500,
    enabled: accessToken == undefined,
  });

  useEffect(() => {
    setId(uuid());
  }, []);

  useEffect(() => {
    if (data?.data?.access_token) {
      setAccessToken(data.data.access_token);
    }
  }, [data]);

  console.log({ data });

  return (
    <div>
      <p> CID:{client_id}</p>
      <p> CS:{client_secret}</p>
      <p> host:{host}</p>
      <p> id:{id}</p>
      {/* <p>chall:{pkce}</p>
      <p>veri:{pkce?.codeVerifier}</p> */}
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
                pluginMessage: { type: 'saveAccessToken', accessToken },
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
