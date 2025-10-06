import AsyncStorage from "@react-native-async-storage/async-storage";

const WORK_DAYS_KEY = "work_days";

export class StorageService {
  static parseIsoDateToLocal(dateString) {
    // Évite les problèmes de fuseau horaire avec 'YYYY-MM-DD'
    // en construisant la date en local
    if (!dateString) return new Date(NaN);
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }
  // Sauvegarder un jour de travail
  static async saveWorkDay(workDay) {
    try {
      const existingDays = await this.getWorkDays();
      const updatedDays = [...existingDays, workDay];
      await AsyncStorage.setItem(WORK_DAYS_KEY, JSON.stringify(updatedDays));
      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      return false;
    }
  }

  // Récupérer tous les jours de travail
  static async getWorkDays() {
    try {
      const data = await AsyncStorage.getItem(WORK_DAYS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
      return [];
    }
  }

  // Supprimer un jour de travail
  static async deleteWorkDay(id) {
    try {
      const existingDays = await this.getWorkDays();
      const updatedDays = existingDays.filter(day => day.id !== id);
      await AsyncStorage.setItem(WORK_DAYS_KEY, JSON.stringify(updatedDays));
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      return false;
    }
  }

  // Mettre à jour un jour de travail
  static async updateWorkDay(id, updatedWorkDay) {
    try {
      const existingDays = await this.getWorkDays();
      const updatedDays = existingDays.map(day => 
        day.id === id ? { ...updatedWorkDay, id } : day
      );
      await AsyncStorage.setItem(WORK_DAYS_KEY, JSON.stringify(updatedDays));
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return false;
    }
  }

  // Calculer les heures totales
  static calculateTotalHours(workDays) {
    return workDays.reduce((total, day) => total + day.totalHours, 0);
  }

  // Filtrer par semaine
  static getWorkDaysByWeek(workDays, weekStart) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return workDays.filter(day => {
      const dayDate = this.parseIsoDateToLocal(day.date);
      return dayDate >= weekStart && dayDate <= weekEnd;
    });
  }

  // Filtrer par mois
  static getWorkDaysByMonth(workDays, year, month) {
    return workDays.filter(day => {
      const dayDate = this.parseIsoDateToLocal(day.date);
      return (
        dayDate.getFullYear() === year && dayDate.getMonth() === month
      );
    });
  }
}
