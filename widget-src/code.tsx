import Button from './components/Button';
import Checkbox from './components/Checkbox';
import { TaskCard } from './components/TaskCard/index';
import { GetTaskByIDType } from './types/responses';
import { api } from './utils/api';
import { KEY } from './utils/key';
const { widget } = figma;
const { useEffect, useSyncedState, AutoLayout, Input, Text } = widget;

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

  const [isCustomId, setIsCustomId] = useSyncedState<boolean>(
    'isCustomId',
    false
  );

  const [taskList, setTaskList] = useSyncedState<GetTaskByIDType[]>(
    'taskList',
    []
  );

  useEffect(() => {
    // console.clear();

    if (!storedToken || !storedWorkspace) {
      figma.clientStorage.getAsync(KEY.CREDENTIALS).then((value) => {
        if (!value) return;

        setStoredToken(value.token);
        setStoredWorkspace(value.workspace);
      });
    }

    // if (storedToken && !storedWorkspace) {
    //   console.log('inside 2nd hook', { storedToken, storedWorkspace });

    //   figma.clientStorage.getAsync(KEY.WORKSPACE_ID).then((ws) => {
    //     if (!ws) return;

    //     console.log({ ws });
    //     setStoredWorkspace(ws);
    //   });
    // }
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
      await figma.clientStorage.setAsync(KEY.CREDENTIALS, { token, workspace });
      setStoredToken(token);
      setStoredWorkspace(workspace);
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
        `/task/${storedWorkspace}/${taskInputValue}?custom_task_ids=${isCustomId}`,
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

      if (!response) {
        throw new Error('Error occurred during data fetching');
      }

      setTaskList((prev) => prev.map((e, i) => (i === index ? response : e)));

      figma.notify('Synced task successfully!');
    } catch (error) {
      console.error('Error:', error);
      figma.notify('Error occurred during data fetching');
    } finally {
      setIsLoading(false);
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
          <Checkbox
            defaultChecked={isCustomId}
            label={'Custom ID'}
            onChange={(e) => {
              setIsCustomId(e);
            }}
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
