import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const TaskItem = ({ task, onComplete, onDelete, onEdit }) => {
  const [displayedTime, setDisplayedTime] = useState(calculateElapsedTime(task));
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleActionPress = () => {
    setModalVisible(true);
  };

  const handleComplete = () => {
    setModalVisible(false);
    onComplete(task?.id);
  };

    // ... existing code ...
  
    const handleDelete = () => {
      setModalVisible(false);
      if (onDelete) {
        // Instead of deleting, we'll update the status to 'deleted'
        const updates = { status: 'deleted' };
        onDelete(task?.id, updates);
      }
    };
    
    // ... existing code ...

  const handleEdit = () => {
    setModalVisible(false);
    if (onEdit) onEdit(task);
  };

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
        style={styles.actionButton}
        onPress={handleActionPress}
      >
        <Text style={styles.actionButtonText}>Actions</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Task Actions</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleEdit}
            >
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>
            
            {!task?.end_time && (
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handleComplete}
              >
                <Text style={styles.modalButtonText}>Complete</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.deleteButton]} 
              onPress={handleDelete}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  actionButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  cancelButton: {
    backgroundColor: '#8e8e93',
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