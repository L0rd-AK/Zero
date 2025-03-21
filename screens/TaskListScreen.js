import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, StyleSheet, Text } from 'react-native';
import TaskItem from './TaskItem';
import AddTaskModal from './AddTaskModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = process.env.API_URL || 'http://192.168.186.109:5000';

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

const TaskListScreen = ({ route }) => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(route?.params?.status || 'all');

  useEffect(() => {
    if (route?.params?.status) {
      setStatus(route.params.status);
    }
    fetchTasks();
  }, [route?.params?.status]);

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      let url = `${API_BASE_URL}/tasks`;
      if (status !== 'all') {
        url += `?status=${status}`;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  // Delete a task
    // Delete a task
    const handleDeleteTask = async (id) => {
      try {
        console.log('Handling delete for task ID:', id); // Using the id parameter
        const token = await AsyncStorage.getItem('token');
        
        // Make sure we're using the correct ID format
        // MongoDB ObjectId is passed as a string from the client
        const taskId = id.toString();
        
        // Update the task status to 'deleted'
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'deleted' }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server error:', errorData);
          return;
        }
        
        console.log('Task marked as deleted successfully');
        fetchTasks(); // Refresh the list after updating
      } catch (error) {
        console.error('Error marking task as deleted:', error);
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
      console.log('Handling complete for task ID:', id);
      const token = await AsyncStorage.getItem('token');
      
      // Make sure we're using the correct ID format
      const taskId = id.toString();
      
      // Update the task status to 'completed' and set end_time
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: 'completed',
          end_time: new Date().toISOString() 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        return;
      }
      
      console.log('Task marked as completed successfully');
      fetchTasks(); // Refresh the list after updating
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };

  const handleEditTask = async (task) => {
    // This would typically open an edit modal
    // For now, just log the task
    console.log('Edit task:', task);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{status === 'all' ? 'All Tasks' : `${status} Tasks`}</Text>
      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={(item) => (item._id ? item._id.toString() : Math.random().toString())}
        renderItem={({ item }) => (
          <TaskItem 
            task={item} 
            onComplete={handleCompleteTask} 
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        )}
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
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default TaskListScreen;