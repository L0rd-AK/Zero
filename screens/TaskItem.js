import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Replace CheckBox with a simple TouchableOpacity for now
const TaskItem = ({ task, onComplete }) => {
  const [displayedTime, setDisplayedTime] = useState(calculateElapsedTime(task));

  useEffect(() => {
    let interval;
    if (!task?.end_time) {
      interval = setInterval(() => {
        setDisplayedTime(calculateElapsedTime(task));
      }, 1000);
    } else {
      setDisplayedTime(calculateElapsedTime(task));
    }
    return () => clearInterval(interval);
  }, [task?.end_time, task?.start_time]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{task?.name}</Text>
        <Text style={styles.time}>Elapsed: {formatTime(displayedTime)}</Text>
        {task?.estimated_duration && (
          <Text style={styles.estimated}>Estimated: {formatTime(task?.estimated_duration * 60000)}</Text>
        )}
      </View>
      <TouchableOpacity 
        style={[styles.checkbox, task?.end_time && styles.checkboxChecked]}
        onPress={() => !task?.end_time && onComplete(task?.id)}
        disabled={!!task?.end_time}
      >
        {task?.end_time && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
};

// Rest of your code remains the same
const calculateElapsedTime = (task) => {
  const now = Date.now();
  const start = new Date(task?.start_time).getTime();
  const end = task?.end_time ? new Date(task?.end_time).getTime() : now;
  return Math.max(0, end - start);
};

const formatTime = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return `${hours}h ${minutes}m ${seconds}s`;
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    time: {
      fontSize: 14,
      color: '#666',
    },
    estimated: {
      fontSize: 14,
      color: '#888',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: '#000',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#000',
    },
    checkmark: {
      color: '#fff',
      fontSize: 16,
    },
    taskInfo: {
      flex: 1,
    },
    taskName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    taskDuration: {
      fontSize: 14,
      color: '#666',
    },
  });

export default TaskItem;