import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTaskStore } from '@/hooks/useTaskStore';
import { Task } from '@/types/task';
import { MapPin, Clock, CircleAlert as AlertCircle, Edit, Trash2 } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TasksScreen() {
  const { tasks, completeTask, deleteTask } = useTaskStore();
  const router = useRouter(); 

  // Define theme colors outside the renderTask function
  const priorityColors = {
    low: useThemeColor({}, 'priorityLow'),
    medium: useThemeColor({}, 'priorityMedium'),
    high: useThemeColor({}, 'priorityHigh'),
  };

  const cardStyle = {
    backgroundColor: useThemeColor({}, 'card'), 
    shadowColor: useThemeColor({}, 'shadow'),
  };

  const taskCardPressableStyle = {
    backgroundColor: useThemeColor({}, 'taskCardPressable'),
  };

  const textStyle = {
    color: useThemeColor({}, 'text'),
  };

  const borderStyle = {
    borderColor: useThemeColor({}, 'border'),
  };

  const editButtonStyle = {
    backgroundColor: useThemeColor({}, 'editButtonBackground'),
  };

  const editButtonTextStyle = {
    color: useThemeColor({}, 'editButtonText'),
  };

  const deleteButtonStyle = {
    backgroundColor: useThemeColor({}, 'deleteButtonBackground'),
  };

  const deleteButtonTextStyle = {
    color: useThemeColor({}, 'deleteButtonText'),
  };

  const emptyStateTextStyle = {
    color: useThemeColor({}, 'emptyStateText'),
  };

  const emptyStateIconStyle = {
    color: useThemeColor({}, 'emptyStateIcon'),
  };

  const handleEditTask = (id: string) => {
    router.push(`../edit-task/${id}`);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const renderTask = ({ item }: { item: Task }) => {
    return (
      <View style={[styles.taskCard, item.isComplete && styles.completedTask, cardStyle]}>
        <Pressable
          style={[styles.taskCardPressable, taskCardPressableStyle]}
          onPress={() => !item.isComplete && completeTask(item.id)}
        >
          <View style={styles.taskHeader}>
            <Text style={[styles.taskTitle, textStyle]}>{item.title}</Text>
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: priorityColors[item.priority] },
              ]}
            />
          </View>
          <Text style={[styles.taskDescription, textStyle]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.taskFooter}>
            <View style={styles.taskInfo}>
              <MapPin size={16} color="#666" />
              <Text style={[styles.taskInfoText, textStyle]}>
                {item.location.radius}m radius
              </Text>
            </View>
            {item.isRecurring && (
              <View style={styles.taskInfo}>
                <Clock size={16} color="#666" />
                <Text style={[styles.taskInfoText, textStyle]}>Recurring</Text>
              </View>
            )}
          </View>
        </Pressable>

        <View style={styles.taskActions}>
          <Pressable
            style={[styles.editButton, editButtonStyle]}
            onPress={() => handleEditTask(item.id)}
          >
            <Edit size={16} color={useThemeColor({}, 'editButtonText')} />
            <Text style={[styles.editButtonText, editButtonTextStyle]}>Edit</Text>
          </Pressable>
          <Pressable
            style={[styles.deleteButton, deleteButtonStyle]}
            onPress={() => handleDeleteTask(item.id)}
          >
            <Trash2 size={16} color={useThemeColor({}, 'deleteButtonText')} />
            <Text style={[styles.deleteButtonText, deleteButtonTextStyle]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const containerStyle = {
    backgroundColor: useThemeColor({}, 'background'),
  };

  const headerStyle = {
    backgroundColor: useThemeColor({}, 'card'),
    borderBottomColor: useThemeColor({}, 'border'),
  };

  const titleStyle = {
    color: useThemeColor({}, 'text'),
  };

  const addButtonTextStyle = {
    color: useThemeColor({}, 'buttonText'),
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.header, headerStyle]}>
        <Text style={[styles.title, titleStyle]}>Location Tasks</Text>
      </View>
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <AlertCircle size={48} color={useThemeColor({}, 'emptyStateIcon')} />
          <Text style={[styles.emptyStateText, emptyStateTextStyle]}>
            No tasks yet. Create your first location-based task!
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.taskList}
        />
      )}
      <Link href="/new-task" asChild>
        <Pressable style={styles.addButton}>
          <Text style={[styles.addButtonText, addButtonTextStyle]}>+ New Task</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F8F9FA', // Removed hardcoded color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    // backgroundColor: '#FFF', // Removed hardcoded color
    borderBottomWidth: 1,
    // borderBottomColor: '#E5E5EA', // Removed hardcoded color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: '#000', // Removed hardcoded color
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  taskList: {
    padding: 16,
  },
  taskCard: {
    // backgroundColor: '#FFF', // Removed hardcoded color
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskCardPressable: {
    marginBottom: 12,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#E5F3FF', // Removed hardcoded color
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    // color: '#007AFF', // Removed hardcoded color
    fontSize: 14,
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#FFE5E5', // Removed hardcoded color
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButtonText: {
    // color: '#F44336', // Removed hardcoded color
    fontSize: 14,
    marginLeft: 4,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color: '#000', // Removed hardcoded color
    flex: 1,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  taskDescription: {
    fontSize: 14,
    // color: '#666', // Removed hardcoded color
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  taskInfoText: {
    fontSize: 12,
    // color: '#666', // Removed hardcoded color
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    // color: '#666', // Removed hardcoded color
    textAlign: 'center',
    marginTop: 16,
  },
  content: {
    flex: 1,
  },
});