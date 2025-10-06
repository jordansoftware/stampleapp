import { ID } from 'appwrite';
import { appwriteDatabases, ids } from './appwrite';

const { DATABASE_ID, COLLECTION_ID } = ids;

export const calculateHours = (startDate, endDate) => {
  const diff = endDate.getTime() - startDate.getTime();
  return Math.max(0, diff / (1000 * 60 * 60));
};

const calculateMinutes = (startDate, endDate) => {
  const diff = endDate.getTime() - startDate.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60)));
};

export const addWorkDay = async (dateISO, startTimeStr, endTimeStr) => {
  // dateISO: 'YYYY-MM-DD', startTimeStr/endTimeStr: 'HH:mm'
  try {
    const start = new Date(`${dateISO}T${startTimeStr}:00`);
    const end = new Date(`${dateISO}T${endTimeStr}:00`);
    const totalMinutes = calculateMinutes(start, end);

    // Alignez ces clés avec votre schéma Appwrite.
    // Votre schéma: date (string), start (string), end (string), total (integer)
    const payload = {
      date: dateISO,
      start: startTimeStr,
      end: endTimeStr,
      total: totalMinutes,
    };

    const doc = await appwriteDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      payload
    );
    return doc;
  } catch (e) {
    // Renvoyer une erreur explicite pour l'UI
    const message = e?.message || e?.toString?.() || 'Unbekannter Fehler';
    const details = e?.response?.message || e?.response?.errors?.join?.(', ');
    throw new Error(details ? `${message} — ${details}` : message);
  }
};

export const getWorkDays = async () => {
  const res = await appwriteDatabases.listDocuments(DATABASE_ID, COLLECTION_ID);
  // Normaliser et trier par date desc
  const items = res.documents
    .map((d) => ({
      id: d.$id,
      date: d.date,
      // compatibilité: accepte startTime/start_time/start
      startTime: d.startTime || d.start_time || d.start,
      endTime: d.endTime || d.end_time || d.end,
      // compatibilité: accepte totalHours/total_hours/hours/total
      // Si "total" est un entier (minutes), on convertit en heures
      totalHours: (() => {
        if (typeof d.total === 'number') return d.total / 60;
        if (typeof d.hours === 'number') return d.hours; // déjà en heures
        if (typeof d.total_hours === 'number') return d.total_hours;
        if (typeof d.totalHours === 'number') return d.totalHours;
        return 0;
      })(),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return items;
};

export const deleteWorkDay = async (id) => {
  await appwriteDatabases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
  return true;
};


