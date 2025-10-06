import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';

export const PdfViewerScreen = ({ route, navigation }) => {
  const { uri, title = 'PDF', html, fileName = 'bericht.pdf' } = route.params || {};

  const onShare = async () => {
    if (uri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
    }
  };

  const onSave = async () => {
    try {
      if (Platform.OS === 'android') {
        // Demande à l’utilisateur où sauvegarder
        const dest = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false, type: 'application/pdf' });
        // getDocumentAsync est limité; alternative: SAF via Storage Access Framework
        // On utilise SAF via FileSystem.StorageAccessFramework
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) return;
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const createdUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          'application/pdf'
        );
        await FileSystem.writeAsStringAsync(createdUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        Alert.alert('Gespeichert', 'PDF wurde gespeichert.');
      } else {
        // iOS: proposer la feuille de partage (enregistrement dans Fichiers possible)
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
        }
      }
    } catch (e) {
      Alert.alert('Fehler', 'Speichern fehlgeschlagen.');
    }
  };

  const openWithNativeViewer = async () => {
    if (!uri) return;
    if (Platform.OS === 'android') {
      try {
        const contentUri = await FileSystem.getContentUriAsync(uri);
        await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.VIEW, {
          data: contentUri,
          flags:
            IntentLauncher.IntentFlag.GRANT_READ_URI_PERMISSION |
            IntentLauncher.IntentFlag.ACTIVITY_NEW_TASK,
          type: 'application/pdf',
        });
        return;
      } catch {}
    }
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
      }
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Text style={styles.shareText}>Teilen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveText}>Speichern</Text>
        </TouchableOpacity>
      </View>
      {html ? (
        <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1 }} />
      ) : (
        <WebView source={{ uri }} style={{ flex: 1 }} onError={openWithNativeViewer} />
      )}
      {Platform.OS === 'android' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.openButton} onPress={openWithNativeViewer}>
            <Text style={styles.openText}>In externer App öffnen</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#333' },
  shareButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  shareText: { color: 'white', fontWeight: '600' },
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#607D8B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveText: { color: 'white', fontWeight: '600' },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  openButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  openText: { color: 'white', fontWeight: '600' },
});


