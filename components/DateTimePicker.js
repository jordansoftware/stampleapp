import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export const DateTimePicker = ({ 
  date, 
  onDateChange, 
  time, 
  onTimeChange, 
  label, 
  mode = 'date' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (value) => value.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });

  const formatTime = (value) => value.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentValue = mode === 'date' ? date : time;

  const onChange = (event, selected) => {
    if (Platform.OS === 'android') setIsOpen(false);
    if (selected) {
      if (mode === 'date') onDateChange(selected);
      else onTimeChange(selected);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.pickerButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.pickerText}>
          {mode === 'date' ? formatDate(currentValue) : formatTime(currentValue)}
        </Text>
      </TouchableOpacity>
      {(isOpen || Platform.OS === 'ios') && (
        <RNDateTimePicker
          value={currentValue}
          mode={mode}
          is24Hour
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onChange}
          locale={'de-DE'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
});
