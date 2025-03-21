import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';
import AddTaskModal from './AddTaskModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = process.env.API_URL || 'http://192.168.0.110:5000';

const getTasks = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json(); // { tasks: [...] }
};

const addTask = async (name, estimatedDuration) => {
  const token = await AsyncStorage.getItem('token');
  await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      start_time: new Date().toISOString(),
      estimated_duration: estimatedDuration,
    }),
  });
};

const updateTask = async (id, updates) => {
  const token = await AsyncStorage.getItem('token');
  await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
};

const TaskListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      console.log('Tasks response:', response);
      if (response && response.tasks) {
        setTasks(response.tasks);
      } else {
        console.error('Invalid response format:', response);
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    }
  };
// Delete a task
const handleDeleteTask = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const handleAddTask = async (name, estimatedDuration) => {
    try {
      await addTask(name, estimatedDuration);
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await updateTask(id, { end_time: new Date().toISOString() });
      fetchTasks();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={({ item }) => <TaskItem task={item} onComplete={handleCompleteTask} />}
      />
      
      <View style={styles.button}>
        <Button
          title="Add Task"
          onPress={() => setModalVisible(true)}
          color="#000"
        />
      </View>
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
  button: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default TaskListScreen;