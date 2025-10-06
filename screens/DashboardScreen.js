import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/StorageService';
import { ReportService } from '../services/ReportService';
import { getWorkDays as getWorkDaysApi, deleteWorkDay as deleteWorkDayApi } from '../services/workService';

export const DashboardScreen = ({ navigation }) => {
  const [workDays, setWorkDays] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, week, month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11

  const loadWorkDays = async () => {
    try {
      const days = await getWorkDaysApi();
      setWorkDays(days);
      setTotalHours(days.reduce((sum, d) => sum + (d.totalHours || 0), 0));
    } catch (error) {
      console.error('Fehler beim Laden der Arbeitstage:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWorkDays();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWorkDays();
    });
    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateString) => {
    // Utiliser la fonction parseIsoDateToLocal pour éviter les problèmes de fuseau horaire
    const date = StorageService.parseIsoDateToLocal(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const handleDeleteWorkDay = (id) => {
    Alert.alert(
      'Löschen bestätigen',
      'Möchten Sie diesen Arbeitstag wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWorkDayApi(id);
              loadWorkDays();
            } catch (e) {
              Alert.alert('Fehler', 'Fehler beim Löschen des Arbeitstags.');
            }
          },
        },
      ]
    );
  };

  const getFilteredWorkDays = () => {
    if (filter === 'week') {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      return StorageService.getWorkDaysByWeek(workDays, startOfWeek);
    } else if (filter === 'month') {
      return StorageService.getWorkDaysByMonth(workDays, selectedYear, selectedMonth);
    }
    return workDays;
  };

  const renderWorkDayItem = ({ item }) => (
    <View style={styles.workDayItem}>
      <View style={styles.workDayInfo}>
        <Text style={styles.workDayDate}>{formatDate(item.date)}</Text>
        <Text style={styles.workDayTime}>
          {formatTime(item.startTime)} - {formatTime(item.endTime)}
        </Text>
        <Text style={styles.workDayHours}>
          {item.totalHours.toFixed(2)} Stunden
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteWorkDay(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredWorkDays = getFilteredWorkDays();
  const filteredTotalHours = StorageService.calculateTotalHours(filteredWorkDays);

  const getCurrentPeriodLabel = () => {
    if (filter === 'week') {
      const now = new Date();
      const start = new Date(now.setDate(now.getDate() - now.getDay()));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('de-DE')} – ${end.toLocaleDateString('de-DE')}`;
    }
    if (filter === 'month') {
      return new Date(selectedYear, selectedMonth, 1).toLocaleDateString('de-DE', {
        month: 'long',
        year: 'numeric',
      });
    }
    return 'Alle Einträge';
  };

  const getCurrentFileName = () => {
    if (filter === 'week') {
      const now = new Date();
      const start = new Date(now.setDate(now.getDate() - now.getDay()));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const s = start.toISOString().slice(0,10);
      const e = end.toISOString().slice(0,10);
      return `bericht_${s}_bis_${e}.pdf`;
    }
    if (filter === 'month') {
      const ym = new Date(selectedYear, selectedMonth, 1)
        .toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit' })
        .replace('.', '-')
        .replace(' ', '');
      // ym ex: "09-2025" en de-DE, on reformate en 2025-09
      const [mm, yyyy] = ym.split('-');
      return `bericht_${yyyy}-${mm}.pdf`;
    }
    return `bericht_alle.pdf`;
  };

  const handleGeneratePdf = async () => {
    const periodLabel = getCurrentPeriodLabel();
    try {
      const fileName = getCurrentFileName();
      const { uri, html } = await ReportService.generatePdf({
        title: 'Arbeitszeit Bericht',
        periodLabel,
        workDays: filteredWorkDays,
        fileName,
      });
      navigation.navigate('PdfViewer', { uri, html, title: 'Arbeitszeit Bericht', fileName });
    } catch (e) {
      Alert.alert('Fehler', 'PDF konnte nicht erstellt werden.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Arbeitszeit Konto</Text>
        <Text style={styles.subtitle}>
          Gesamt: {filteredTotalHours.toFixed(2)} Stunden
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            Alle
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'week' && styles.filterButtonActive]}
          onPress={() => setFilter('week')}
        >
          <Text style={[styles.filterButtonText, filter === 'week' && styles.filterButtonTextActive]}>
            Woche
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'month' && styles.filterButtonActive]}
          onPress={() => setFilter('month')}
        >
          <Text style={[styles.filterButtonText, filter === 'month' && styles.filterButtonTextActive]}>
            Monat
          </Text>
        </TouchableOpacity>
      </View>

      {filter === 'month' && (
        <View style={styles.monthPickerRow}>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={() => {
              const prev = new Date(selectedYear, selectedMonth - 1, 1);
              setSelectedYear(prev.getFullYear());
              setSelectedMonth(prev.getMonth());
            }}
          >
            <Text style={styles.monthNavText}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {new Date(selectedYear, selectedMonth, 1).toLocaleDateString('de-DE', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={() => {
              const next = new Date(selectedYear, selectedMonth + 1, 1);
              setSelectedYear(next.getFullYear());
              setSelectedMonth(next.getMonth());
            }}
          >
            <Text style={styles.monthNavText}>{'›'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredWorkDays}
        renderItem={renderWorkDayItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Keine Arbeitstage gefunden</Text>
            <Text style={styles.emptySubtext}>
              Tippen Sie auf "+" um einen neuen Arbeitstag hinzuzufügen
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddWorkDay')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pdfButton} onPress={handleGeneratePdf}>
        <Text style={styles.pdfButtonText}>PDF-Bericht</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 15,
  },
  monthPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavText: {
    fontSize: 20,
    color: '#333',
  },
  workDayItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workDayInfo: {
    flex: 1,
  },
  workDayDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  workDayTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  workDayHours: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pdfButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  pdfButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
