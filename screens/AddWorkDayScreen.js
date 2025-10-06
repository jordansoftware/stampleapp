import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimePicker } from '../components/DateTimePicker';
import { addWorkDay, calculateHours } from '../services/workService';

export const AddWorkDayScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const calculateTotalHours = (start, end) => calculateHours(start, end);

  const handleSave = async () => {
    const totalHours = calculateTotalHours(startTime, endTime);
    
    if (totalHours <= 0) {
      Alert.alert('Fehler', 'Die Endzeit muss nach der Startzeit liegen.');
      return;
    }

    // Éviter les problèmes de fuseau horaire en construisant la date manuellement
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateISO = `${year}-${month}-${day}`;
    let start = startTime?.toTimeString() || '';
    start = start.split(' ')[0];
    start = start.length >= 5 ? start.substring(0, 5) : start;
    
    let end = endTime?.toTimeString() || '';
    end = end.split(' ')[0];
    end = end.length >= 5 ? end.substring(0, 5) : end;

    try {
      await addWorkDay(dateISO, start, end);
      Alert.alert('Erfolg', 'Arbeitstag wurde gespeichert!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Fehler', String(e?.message || e));
    }
  };

  const totalHours = calculateTotalHours(startTime, endTime);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Neuer Arbeitstag</Text>
        </View>

        <View style={styles.form}>
          <DateTimePicker
            date={selectedDate}
            onDateChange={setSelectedDate}
            label="Datum"
            mode="date"
          />

          <DateTimePicker
            time={startTime}
            onTimeChange={setStartTime}
            label="Ankunftszeit"
            mode="time"
          />

          <DateTimePicker
            time={endTime}
            onTimeChange={setEndTime}
            label="Endzeit"
            mode="time"
          />

          <View style={styles.totalHoursContainer}>
            <Text style={styles.totalHoursLabel}>Gesamtstunden:</Text>
            <Text style={styles.totalHoursValue}>
              {totalHours.toFixed(2)} Stunden
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Speichern</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  form: {
    padding: 20,
  },
  totalHoursContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  totalHoursLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalHoursValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
