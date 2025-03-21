import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet } from 'react-native';

const AddTaskModal = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');

  const handleSubmit = () => {
    onAdd(name, estimatedDuration ? parseInt(estimatedDuration) : null);
    setName('');
    setEstimatedDuration('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Task Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Estimated Duration (minutes)"
            value={estimatedDuration}
            onChangeText={setEstimatedDuration}
            keyboardType="numeric"
          />
          <View style={styles.button}>
            <Button
              title="Add Task"
              onPress={handleSubmit}
              color="#000"
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Cancel"
              onPress={onClose}
              color="#000"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default AddTaskModal;