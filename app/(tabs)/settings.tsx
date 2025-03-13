import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useLocationPermissions } from '@/hooks/useLocationPermissions';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SettingsScreen() {
  const locationPermissions = useLocationPermissions();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [backgroundTrackingEnabled, setBackgroundTrackingEnabled] =
    React.useState(true);

  const containerStyle = {
    backgroundColor: useThemeColor({}, 'background'),
  };

  const sectionStyle = {
    backgroundColor: useThemeColor({}, 'card'),
    borderTopColor: useThemeColor({}, 'border'),
    borderBottomColor: useThemeColor({}, 'border'),
  };

  const sectionTitleStyle = {
    color: useThemeColor({}, 'text'),
  };

  const settingTitleStyle = {
    color: useThemeColor({}, 'text'),
  };

  const settingDescriptionStyle = {
    color: useThemeColor({}, 'text'),
  };

  return (
    <ScrollView style={[styles.container, containerStyle]}>
      <View style={[styles.section, sectionStyle]}>
        <Text style={[styles.sectionTitle, sectionTitleStyle]}>Permissions</Text>
        <View style={styles.setting}>
          <View>
            <Text style={[styles.settingTitle, settingTitleStyle]}>Location Access</Text>
            <Text style={[styles.settingDescription, settingDescriptionStyle]}>
              Allow access to your location while using the app
            </Text>
          </View>
          <Switch
            value={locationPermissions.foreground}
            disabled={true}
          />
        </View>
        <View style={styles.setting}>
          <View>
            <Text style={[styles.settingTitle, settingTitleStyle]}>Background Location</Text>
            <Text style={[styles.settingDescription, settingDescriptionStyle]}>
              Allow location tracking while app is in background
            </Text>
          </View>
          <Switch
            value={locationPermissions.background}
            disabled={true}
          />
        </View>
      </View>

      <View style={[styles.section, sectionStyle]}>
        <Text style={[styles.sectionTitle, sectionTitleStyle]}>Notifications</Text>
        <View style={styles.setting}>
          <View>
            <Text style={[styles.settingTitle, settingTitleStyle]}>Push Notifications</Text>
            <Text style={[styles.settingDescription, settingDescriptionStyle]}>
              Receive alerts when near task locations
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </View>

      <View style={[styles.section, sectionStyle]}>
        <Text style={[styles.sectionTitle, sectionTitleStyle]}>Location Tracking</Text>
        <View style={styles.setting}>
          <View>
            <Text style={[styles.settingTitle, settingTitleStyle]}>Background Tracking</Text>
            <Text style={[styles.settingDescription, settingDescriptionStyle]}>
              Continue tracking location when app is closed
            </Text>
          </View>
          <Switch
            value={backgroundTrackingEnabled}
            onValueChange={setBackgroundTrackingEnabled}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTitle: {
    fontSize: 17,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    maxWidth: '80%',
  },
});