import Button from './components/Button';
import { TaskCard } from './components/TaskCard/index';
import { GetTaskByIDType } from './types/responses';
import { api } from './utils/api';
import { KEY } from './utils/key';
const { widget } = figma;
const { useEffect, useSyncedState, AutoLayout, Input, Text } = widget;

type FetchingState<T> = {
  isLoading: boolean;
  data: T | undefined;
  isError: boolean;
};

type WorkspaceState = FetchingState<string>;

function Widget() {
  const [storedToken, setStoredToken] = useSyncedState<string | undefined>(
    'storedTokenState',
    undefined
  );

  const [isLoading, setIsLoading] = useSyncedState<boolean>('isLoading', false);

  const [storedWorkspace, setStoredWorkspace] = useSyncedState<
    string | undefined
  >('storedWorkspaceState', undefined);

  const [taskInputValue, setTaskInputValue] = useSyncedState<string>(
    'taskInputValue',
    ''
  );

  const [taskList, setTaskList] = useSyncedState<GetTaskByIDType[]>(
    'taskList',
    []
  );

  useEffect(() => {
    if (!storedToken) {
      figma.clientStorage.getAsync(KEY.AUTH_TOKEN).then((token) => {
        if (!token) return;

        setStoredToken(token);
      });
    }

    if (storedToken && !storedWorkspace) {
      figma.clientStorage.getAsync(KEY.WORKSPACE_ID).then((ws) => {
        if (!ws) return;
        setStoredWorkspace(ws);
      });
    }
  });

  // const render = (components: ParsedComponent[]) => {
  //   return components.map((component) => {
  //     switch (component.type) {
  //       case 'h1':
  //         return <Typography variant='h1'>{component.content}</Typography>;
  //       case 'h2':
  //         return <Typography variant='h2'>{component.content}</Typography>;
  //       case 'h3':
  //         return <Typography variant='h3'>{component.content}</Typography>;
  //       case 'h4':
  //         return <Typography variant='h4'>{component.content}</Typography>;
  //       case 'h5':
  //         return <Typography variant='h5'>{component.content}</Typography>;
  //       case 'h6':
  //         return <Typography variant='h6'>{component.content}</Typography>;
  //       case 'p':
  //         return <Typography variant='body1'>{component.content}</Typography>;
  //       default:
  //         return null;
  //     }
  //   });
  // };

  const saveAuthTokenAndWorkspace = async (
    token: string,
    workspace: string
  ) => {
    setIsLoading(true);
    try {
      await figma.clientStorage.setAsync(KEY.AUTH_TOKEN, token);
      await figma.clientStorage.setAsync(KEY.WORKSPACE_ID, workspace);
      figma.notify('Token saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      figma.notify('Error occurred during save');
    } finally {
      setIsLoading(false);
    }
  };

  const searchTask = async () => {
    if (!storedToken || !storedWorkspace) return;

    setIsLoading(true);
    try {
      const response = await api<GetTaskByIDType>(
        `/task/${storedWorkspace}/${taskInputValue}`,
        storedToken
      );

      if (!response) {
        throw new Error('Error occurred during data fetching');
      }

      setTaskList((prev) => [...prev, response]);

      figma.notify('Added task successfully!');
    } catch (error) {
      console.error('Error:', error);
      figma.notify('Error occurred during data fetching');
    } finally {
      setIsLoading(false);
      setTaskInputValue('');
    }
  };

  const openAuthWidget = async () => {
    await new Promise((resolve) => {
      figma.showUI(__html__);
      figma.ui.on('message', async (data, props) => {
        const { type } = data;

        if (type === 'saveTokenAndWorkspace') {
          const { accessToken, workspaceId } = data;
          await saveAuthTokenAndWorkspace(accessToken, String(workspaceId));
          figma.notify('Successfully authorized');
          figma.closePlugin();
        }
      });
    });
  };

  const handleSyncTask = async (task: GetTaskByIDType, index: number) => {
    if (!storedToken || !storedWorkspace) return;

    setIsLoading(true);

    try {
      const response = await api<GetTaskByIDType>(
        `/task/${storedWorkspace}/${task.id}`,
        storedToken
      );

      console.log({ response });
      if (!response) {
        throw new Error('Error occurred during data fetching');
      }

      setTaskList((prev) => prev.map((e, i) => (i === index ? response : e)));

      figma.notify('Synced task successfully!');
    } catch (error) {
      console.error('Error:', error);
      figma.notify('Error occurred during data fetching');
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <AutoLayout
      direction='vertical'
      horizontalAlignItems='start'
      verticalAlignItems='center'
      height='hug-contents'
      padding={16}
      fill='#FFFFFF'
      cornerRadius={8}
      spacing={12}
    >
      {!storedToken && (
        <Button label='Login' variant='primary' onClick={openAuthWidget} />
      )}

      {storedWorkspace ? (
        <>
          <Input
            value={taskInputValue}
            placeholder='Enter task ID'
            onTextEditEnd={(e) => setTaskInputValue(e.characters)}
          />
          <Button label='Search' loading={isLoading} onClick={searchTask} />
        </>
      ) : null}

      {storedWorkspace && taskList && Array.isArray(taskList)
        ? taskList.map((task, index) => {
            return (
              <TaskCard
                key={task.id + index}
                onSync={handleSyncTask}
                workspace={storedWorkspace}
                task={task}
                index={index}
              />
            );
          })
        : null}
    </AutoLayout>
  );
}

widget.register(Widget);
