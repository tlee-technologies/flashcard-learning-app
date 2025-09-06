import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Bell, 
  Moon, 
  Globe, 
  BookOpen, 
  Shield, 
  HelpCircle,
  ChevronRight,
  User,
  LogOut
} from "lucide-react-native";
import { useUser } from "@/providers/UserProvider";

export default function SettingsScreen() {
  const { user, updateSettings } = useUser();
  const [notifications, setNotifications] = useState(user?.settings?.notifications ?? true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  interface SettingItem {
    icon: React.ReactElement;
    label: string;
    type: "switch" | "navigation";
    value?: boolean | string;
    onToggle?: (value: boolean) => void;
  }

  interface SettingSection {
    title: string;
    items: SettingItem[];
  }

  const settingsSections: SettingSection[] = [
    {
      title: "Study Preferences",
      items: [
        {
          icon: <Bell size={20} color="#6B7280" />,
          label: "Daily Reminders",
          value: notifications,
          type: "switch",
          onToggle: (value: boolean) => {
            setNotifications(value);
            updateSettings({ notifications: value });
          },
        },
        {
          icon: <BookOpen size={20} color="#6B7280" />,
          label: "Cards per Session",
          value: "20 cards",
          type: "navigation",
        },
        {
          icon: <Globe size={20} color="#6B7280" />,
          label: "Sound Effects",
          value: soundEffects,
          type: "switch",
          onToggle: setSoundEffects,
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          icon: <Moon size={20} color="#6B7280" />,
          label: "Dark Mode",
          value: darkMode,
          type: "switch",
          onToggle: setDarkMode,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <HelpCircle size={20} color="#6B7280" />,
          label: "Help & FAQ",
          type: "navigation",
        },
        {
          icon: <Shield size={20} color="#6B7280" />,
          label: "Privacy Policy",
          type: "navigation",
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.7}>
          <View style={styles.profileAvatar}>
            <User size={32} color="#6366F1" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
            <Text style={styles.profileEmail}>{user?.email || "guest@example.com"}</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View 
                  key={itemIndex} 
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder
                  ]}
                >
                  <View style={styles.settingLeft}>
                    {item.icon}
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  {item.type === "switch" ? (
                    <Switch
                      value={item.value as boolean}
                      onValueChange={item.onToggle!}
                      trackColor={{ false: "#E5E7EB", true: "#C7D2FE" }}
                      thumbColor={item.value ? "#6366F1" : "#F3F4F6"}
                      ios_backgroundColor="#E5E7EB"
                    />
                  ) : item.type === "navigation" ? (
                    <TouchableOpacity style={styles.settingRight}>
                      {item.value && typeof item.value === "string" && (
                        <Text style={styles.settingValue}>{item.value}</Text>
                      )}
                      <ChevronRight size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} activeOpacity={0.7}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: "#111827",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: "#6B7280",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
  version: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 24,
  },
});