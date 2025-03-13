import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useTaskStore } from '@/hooks/useTaskStore';
import { Task } from '@/types/task';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask } = useTaskStore();
  const task = tasks.find((task) => task.id === id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [radius, setRadius] = useState('100');
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [isRecurring, setIsRecurring] = useState(false);
  const [triggerTime, setTriggerTime] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setRadius(String(task.location.radius));
      setLocation(task.location);
      setIsRecurring(task.isRecurring);
      setTriggerTime(task.triggerTime || '');
    }
  }, [task]);

  const handleUpdateTask = () => {
    if (!title || !description) return;

    updateTask(id, {
      title,
      description,
      priority,
      location: {
        ...location,
        radius: parseInt(radius, 10),
      },
      isRecurring,
      triggerTime,
    });

    router.back();
  };

  const containerStyle = {
    backgroundColor: useThemeColor({}, 'background'),
  };

  const formStyle = {
    backgroundColor: useThemeColor({}, 'card'),
  };

  const labelStyle = {
    color: useThemeColor({}, 'text'),
  };

  const inputStyle = {
    backgroundColor: useThemeColor({}, 'inputBackground'),
    borderColor: useThemeColor({}, 'inputBorder'),
    color: useThemeColor({}, 'inputTextColor'),
  };

  const priorityButtonTextStyle = {
    color: useThemeColor({}, 'text'),
  };

  const priorityButtonActiveStyle = {
    backgroundColor: useThemeColor({}, 'button'),
    borderColor: useThemeColor({}, 'button'),
  };

  const priorityButtonTextActiveStyle = {
    color: useThemeColor({}, 'buttonText'),
  };

  const switchStyle = {
    backgroundColor: useThemeColor({}, 'switchInactive'),
  };

  const switchActiveStyle = {
    backgroundColor: useThemeColor({}, 'switchActive'),
  };

  const switchHandleStyle = {
    backgroundColor: useThemeColor({}, 'card'),
  };

  const createButtonStyle = {
    backgroundColor: useThemeColor({}, 'button'),
  };

  const createButtonTextStyle = {
    color: useThemeColor({}, 'buttonText'),
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Task not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, containerStyle]}>
      <View style={[styles.form, formStyle]}>
        <Text style={[styles.label, labelStyle]}>Task Title</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          placeholderTextColor={useThemeColor({ light: '#8E8E93', dark: '#A9A9A9' }, 'text')}
        />

        <Text style={[styles.label, labelStyle]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, inputStyle]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description"
          placeholderTextColor={useThemeColor({ light: '#8E8E93', dark: '#A9A9A9' }, 'text')}
          multiline
          numberOfLines={4}
        />

        <Text style={[styles.label, labelStyle]}>Priority</Text>
        <View style={styles.priorityButtons}>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <Pressable
              key={p}
              style={[
                styles.priorityButton,
                priority === p && styles.priorityButtonActive,
                priority === p && priorityButtonActiveStyle,
              ]}
              onPress={() => setPriority(p)}>
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === p && styles.priorityButtonTextActive,
                  priorityButtonTextStyle,
                  priority === p && priorityButtonTextActiveStyle,
                ]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, labelStyle]}>Notification Radius (meters)</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          value={radius}
          onChangeText={setRadius}
          keyboardType="numeric"
          placeholder="Enter radius in meters"
          placeholderTextColor={useThemeColor({ light: '#8E8E93', dark: '#A9A9A9' }, 'text')}
        />

        <Text style={[styles.label, labelStyle]}>Location</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              ...location,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e: any) => setLocation(e.nativeEvent.coordinate)}>
            <Marker coordinate={location} draggable />
          </MapView>
        </View>

        <View style={styles.switchContainer}>
          <Text style={[styles.label, labelStyle]}>Recurring Task</Text>
          <Pressable
            style={[styles.switch, isRecurring && styles.switchActive, isRecurring && switchActiveStyle]}
            onPress={() => setIsRecurring(!isRecurring)}>
            <View
              style={[
                styles.switchHandle,
                isRecurring && styles.switchHandleActive,
                switchHandleStyle,
              ]}
            />
          </Pressable>
        </View>

        <Text style={[styles.label, labelStyle]}>Trigger Time (HH:MM)</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          value={triggerTime}
          onChangeText={setTriggerTime}
          placeholder="HH:MM"
          placeholderTextColor={useThemeColor({ light: '#8E8E93', dark: '#A9A9A9' }, 'text')}
        />

        <Pressable style={[styles.createButton, createButtonStyle]} onPress={handleUpdateTask}>
          <Text style={[styles.createButtonText, createButtonTextStyle]}>Update Task</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F8F9FA', // Removed hardcoded color
  },
  form: {
    padding: 16,
    // backgroundColor: '#FFF', // Removed hardcoded color
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    // color: '#000', // Removed hardcoded color
    marginBottom: 8,
  },
  input: {
    // backgroundColor: '#FFF', // Removed hardcoded color
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityButtonActive: {
    // backgroundColor: '#007AFF', // Removed hardcoded color
    borderColor: '#007AFF',
  },
  priorityButtonText: {
    // color: '#000', // Removed hardcoded color
    fontWeight: '600',
  },
  priorityButtonTextActive: {
    color: '#FFF',
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switch: {
    width: 51,
    height: 31,
    // backgroundColor: '#E5E5EA', // Removed hardcoded color
    borderRadius: 16,
    padding: 2,
  },
  switchActive: {
    // backgroundColor: '#34C759', // Removed hardcoded color
  },
  switchHandle: {
    width: 27,
    height: 27,
    // backgroundColor: '#FFF', // Removed hardcoded color
    borderRadius: 14,
  },
  switchHandleActive: {
    transform: [{ translateX: 20 }],
  },
  createButton: {
    // backgroundColor: '#007AFF', // Removed hardcoded color
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
