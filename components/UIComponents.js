import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

export const Button = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// PropTypes can be used for prop validation in JavaScript if desired

export const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export const WorkDayCard = ({
  workDay,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Card style={styles.workDayCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{formatDate(workDay.date)}</Text>
        <View style={styles.cardActions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.actionText}>Bearbeiten</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Text style={[styles.actionText, styles.deleteText]}>Löschen</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.timeInfo}>
        <Text style={styles.timeText}>
          {workDay.startTime} - {workDay.endTime}
        </Text>
        <Text style={styles.hoursText}>
          {workDay.totalHours}h
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#007AFF",
  },
  secondary: {
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#C7C7CC",
  },
  danger: {
    backgroundColor: "#FF3B30",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#000000",
  },
  dangerText: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workDayCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: "#007AFF",
  },
  deleteText: {
    color: "#FF3B30",
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    color: "#666666",
  },
  hoursText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
});

