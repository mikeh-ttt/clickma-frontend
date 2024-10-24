import { GetTaskByIDType, GetTeamsType } from './types/responses';
import { api } from './utils/api';
import { KEY } from './utils/key';
const { widget } = figma;
const { useEffect, useSyncedState, AutoLayout, Input, Text } = widget;

function Widget() {
  const [inputValue, setInputValue] = useSyncedState<string>('inputValue', '');

  const [storedValue, setStoredValue] = useSyncedState<string | undefined>(
    'storedValue',
    undefined
  );
  const [isLoading, setIsLoading] = useSyncedState<boolean>('isLoading', false);

  const [workspaceList, setWorkpaceList] = useSyncedState<
    GetTeamsType | undefined
  >('workspaceList', undefined);

  const [workspaceId, setWorkspaceId] = useSyncedState<string | undefined>(
    'workspaceId',
    undefined
  );

  const [taskInputValue, setTaskInputValue] = useSyncedState<string>(
    'taskInputValue',
    ''
  );

  const [taskList, setTaskList] = useSyncedState<GetTaskByIDType[]>(
    'taskList',
    []
  );

  const fetchWorkspaceList = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await api<GetTeamsType>('/team', token);

      if (!response) {
        throw new Error('Error occurred during data fetching');
      }

      setWorkpaceList(response);
      figma.notify('API call successful!');
    } catch (error) {
      console.error('Error:', error);
      figma.notify('Error occurred during data fetching');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!storedValue) {
      figma.clientStorage.getAsync(KEY.AUTH_TOKEN).then((token) => {
        if (!token) return;
        setStoredValue(token);
      });
    }

    if (storedValue && !workspaceList) {
      // fetchWorkspaceList(storedValue);
    }
  });

  const saveAuthToken = async (token: string) => {
    setIsLoading(true);
    try {
      await figma.clientStorage.setAsync(KEY.AUTH_TOKEN, token);
      if (inputValue) {
        setStoredValue(token);
        figma.notify('Token saved successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      figma.notify('Error occurred during save');
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorkspaceId = async (id: string) => {
    setWorkspaceId(id);
  };

  const searchTask = async () => {
    if (!storedValue || !workspaceId) return;

    setIsLoading(true);

    try {
      const response = await api<GetTaskByIDType>(
        `/task/${taskInputValue}?team_id=${workspaceId}&custom_task_ids=true`,
        storedValue
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

        if (type === 'saveAccessToken') {
          const { accessToken } = data;
          await saveAuthToken(accessToken);
          figma.notify('Successfully authorized');
          figma.closePlugin();
        }
      });
    });
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
      {!storedValue && (
        <AutoLayout
          onClick={openAuthWidget}
          fill={isLoading ? '#CCCCCC' : '#4CAF50'}
          cornerRadius={4}
          padding={{ vertical: 8, horizontal: 16 }}
        >
          <Text fill='#FFFFFF'>Login</Text>
        </AutoLayout>
      )}

      {storedValue && (
        <Text fontSize={12} fill='#666666'>
          Stored value: {storedValue}
        </Text>
      )}

      {!workspaceId && workspaceList !== undefined && workspaceList.teams ? (
        <AutoLayout
          direction='vertical'
          verticalAlignItems='start'
          horizontalAlignItems='start'
        >
          <Text fontSize={12}>Workspace</Text>
          {workspaceList.teams.map((team) => (
            <AutoLayout
              key={team.id}
              direction='vertical'
              fill={'#4CAF50'}
              cornerRadius={4}
              padding={{ vertical: 8, horizontal: 16 }}
              onClick={() => saveWorkspaceId(team.id)}
            >
              <Text>{team.name}</Text>
              <Text>ID: {team.id}</Text>
            </AutoLayout>
          ))}
        </AutoLayout>
      ) : null}

      {workspaceId ? (
        <>
          <Input
            value={taskInputValue}
            placeholder='Enter task ID'
            onTextEditEnd={(e) => setTaskInputValue(e.characters)}
          />
          <AutoLayout
            onClick={searchTask}
            fill={isLoading ? '#CCCCCC' : '#4CAF50'}
            cornerRadius={4}
            padding={{ vertical: 8, horizontal: 16 }}
          >
            <Text fill='#FFFFFF'>{isLoading ? 'Loading...' : 'Search'}</Text>
          </AutoLayout>
        </>
      ) : null}

      {taskList && Array.isArray(taskList)
        ? taskList.map((task) => (
            <AutoLayout
              key={task.id}
              direction='vertical'
              fill={'#4CAF50'}
              cornerRadius={4}
              padding={{ vertical: 8, horizontal: 16 }}
            >
              <Text>
                {task.custom_id} - {task.name}
              </Text>
              <Text>{task.description}</Text>
            </AutoLayout>
          ))
        : null}
    </AutoLayout>
  );
}

widget.register(Widget);
