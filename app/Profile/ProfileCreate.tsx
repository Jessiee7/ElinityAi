import { EvilIcons, Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const mockProfile = {
  displayName: "Jessica Parker",
  age: "28",
  location: "San Francisco, CA",
  relationshipStatus: "Single",
  aboutMe: "",
  personalityType: "",
  strength: "",
  growthAreas: "",
  coreValues: [],
  lifePrinciple: "",
  decisionMaking: "",
  achievements: "",
  bucketList: "",
  favouriteBooks: "",
  favouriteAnecdotes: "",
  photoGallery: [
    { uri: "https://randomuser.me/api/portraits/women/1.jpg" },
    { uri: "https://randomuser.me/api/portraits/women/2.jpg" },
    { uri: "https://randomuser.me/api/portraits/women/3.jpg" },
  ],
  socialLinks: ["@Jessica.parker", "@Jessica.parker", "@Jessica.parker"],
};

const relationshipOptions = [
  "Single",
  "In a Relationship",
  "Married",
  "Divorced",
  "Widowed",
  "Prefer not to say",
];

// Spacing constant
const SPACING = 16;

// Profile data type
interface ProfileData {
  displayName: string;
  age: string;
  location: string;
  relationshipStatus: string;
  aboutMe: string;
  personalityType: string;
  strength: string;
  growthAreas: string;
  coreValues: string[];
  lifePrinciple: string;
  decisionMaking: string;
  achievements: string;
  bucketList: string;
  favouriteBooks: string;
  favouriteAnecdotes: string;
  photoGallery: { uri: string }[];
  socialLinks: string[];
}

// Validation interface
interface ValidationErrors {
  displayName?: string;
  age?: string;
  location?: string;
  aboutMe?: string;
  coreValues?: string;
  socialLinks?: string;
}

// ProfileCard component
const ProfileCard = React.memo(
  ({
    title,
    isEditing,
    onEdit,
    children,
    icon,
  }: {
    title: string;
    isEditing: boolean;
    onEdit: () => void;
    children: React.ReactNode;
    icon?: string;
  }) => (
    // <View style={styles.card}>
    <ImageBackground
      source={require("@/assets/images/Rectangle.png")}
      style={{ padding: 15, margin: 13 }}
      imageStyle={{ borderRadius: 12 }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <TouchableOpacity
          onPress={onEdit}
          style={styles.editBtn}
          hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
          accessibilityLabel={isEditing ? "Save" : "Edit"}
        >
          {isEditing ? (
            <Feather name={"check-square"} size={25} color="#ccc" />
          ) : (
            <Image
              source={require("@/assets/images/icons/edit.png")}
              style={{ width: 25, height: 25 }}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </ImageBackground>
    // </View>
  )
);

// ProfileInput component
const ProfileInput = React.memo(
  ({
    label,
    value,
    onChangeText,
    editable = true,
    onPress,
    showDropdown = false,
    ...props
  }: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    editable?: boolean;
    onPress?: () => void;
    showDropdown?: boolean;
    [key: string]: any;
  }) => (
    <View style={{ marginBottom: SPACING }}>
      <Text style={styles.inputLabel}>{label}</Text>
      {showDropdown ? (
        <TouchableOpacity
          style={[
            styles.input,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
          onPress={onPress}
          activeOpacity={editable ? 0.7 : 1}
          disabled={!editable}
        >
          <Text style={{ color: value ? "#fff" : "#A0A0A0", fontSize: 15 }}>
            {value || `Select ${label}`}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholderTextColor="#A0A0A0"
          {...props}
        />
      )}
    </View>
  )
);

type SocialLinkRowProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  onRemove: () => void;
};

const SocialLinkRow = React.memo(
  ({ label, value, onChange, onRemove }: SocialLinkRowProps) => (
    <View style={styles.socialLinkRow}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.socialLinkText, { flex: 1, color: "#fff" }]}
        value={value}
        placeholder="@yourhandle"
        placeholderTextColor="#A0A0A0"
        onChangeText={onChange}
      />
      <TouchableOpacity style={styles.socialLinkRemove} onPress={onRemove}>
        <Ionicons name="close" size={14} color="#fff" />
      </TouchableOpacity>
    </View>
  )
);

const CreateProfileScreen = () => {
  const [profile, setProfile] = useState(mockProfile);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  );
  const [profileImage, setProfileImage] = useState(
    "https://randomuser.me/api/portraits/women/44.jpg"
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [newSocialLink, setNewSocialLink] = useState("");

  // Load profile from AsyncStorage on mount (no async/await)
  //   useEffect(() => {
  //     AsyncStorage.getItem("userProfile").then((saved) => {
  //       if (saved) setProfile(JSON.parse(saved));
  //     });
  //   }, []);

  // Validation functions
  const validateDisplayName = (name: string): string | undefined => {
    if (!name.trim()) return "Display name is required";
    if (name.length < 2) return "Display name must be at least 2 characters";
    if (name.length > 50) return "Display name must be less than 50 characters";
    return undefined;
  };

  const validateAge = (age: string): string | undefined => {
    if (!age.trim()) return "Age is required";
    const numAge = parseInt(age);
    if (isNaN(numAge)) return "Age must be a number";
    if (numAge < 18 || numAge > 100) return "Age must be between 18 and 100";
    return undefined;
  };

  const validateLocation = (location: string): string | undefined => {
    if (!location.trim()) return "Location is required";
    return undefined;
  };

  const validateAboutMe = (about: string): string | undefined => {
    if (about.length > 500) return "About Me must be less than 500 characters";
    return undefined;
  };

  const validateCoreValues = (values: string[]): string | undefined => {
    if (values.length > 10) return "Maximum 10 core values allowed";
    return undefined;
  };

  const validateSocialLinks = (links: string[]): string | undefined => {
    for (const link of links) {
      if (link && !link.startsWith("@")) {
        return "Social links must start with @";
      }
    }
    return undefined;
  };

  // Validate all fields
  const validateProfile = (): boolean => {
    const errors: ValidationErrors = {};

    errors.displayName = validateDisplayName(profile.displayName);
    errors.age = validateAge(profile.age);
    errors.location = validateLocation(profile.location);
    errors.aboutMe = validateAboutMe(profile.aboutMe);
    errors.coreValues = validateCoreValues(profile.coreValues);
    errors.socialLinks = validateSocialLinks(profile.socialLinks);

    setValidationErrors(errors);

    return !Object.values(errors).some((error) => error !== undefined);
  };

  // Save handler with validation (no async/await)
  const handleSaveProfile = useCallback(() => {
    // if (validateProfile()) {
    //   AsyncStorage.setItem("userProfile", JSON.stringify(profile)).then(() => {
    //     Alert.alert("Profile saved!");
    //   });
    // } else {
    //   Alert.alert("Please fix the validation errors before saving.");
    // }
  }, [profile]);

  // Helper to update profile fields with validation
  const updateProfile = useCallback((field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // Helper for array fields (e.g., coreValues)
  const updateProfileArray = useCallback((field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value.split(",").map((v) => v.trim()),
    }));
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // Dropdown handlers
  const showDropdown = (dropdownType: string) => {
    setActiveDropdown(dropdownType);
    setDropdownVisible(true);
  };

  const hideDropdown = () => {
    setDropdownVisible(false);
    setActiveDropdown(null);
  };

  const getDropdownOptions = (type: string) => {
    switch (type) {
      case "relationship":
        return relationshipOptions;

      default:
        return [];
    }
  };

  const getDropdownValue = (type: string) => {
    switch (type) {
      case "relationship":
        return profile.relationshipStatus;
      default:
        return "";
    }
  };

  const updateDropdownValue = (type: string, value: string) => {
    switch (type) {
      case "relationship":
        updateProfile("relationshipStatus", value);
        break;
    }
    hideDropdown();
  };

  // Handler for picking images (expo-image-picker, no async/await)
  const handlePickImage = useCallback((type: "cover" | "profile") => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    }).then((result) => {
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (type === "cover") setCoverImage(uri);
        if (type === "profile") setProfileImage(uri);
      }
    });
  }, []);

  // Handler to add image to gallery (expo-image-picker, no async/await)
  const handleAddGalleryImage = useCallback(() => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    }).then((result) => {
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setProfile((prev) => ({
          ...prev,
          photoGallery: [...prev.photoGallery, { uri }],
        }));
      }
    });
  }, []);

  // Handler to remove image from gallery
  const handleRemoveGalleryImage = useCallback((idx: number) => {
    setProfile((prev) => ({
      ...prev,
      photoGallery: prev.photoGallery.filter((_, i) => i !== idx),
    }));
  }, []);

  const handleUpdateSocialLink = useCallback((idx: number, value: string) => {
    setProfile((p) => {
      const newLinks = [...p.socialLinks];
      newLinks[idx] = value;
      return { ...p, socialLinks: newLinks };
    });
  }, []);

  const handleRemoveSocialLink = useCallback((idx: number) => {
    setProfile((p) => {
      const newLinks = p.socialLinks.filter((_, i) => i !== idx);
      return { ...p, socialLinks: newLinks };
    });
  }, []);

  const handleAddSocialLink = useCallback(() => {
    if (newSocialLink.trim()) {
      setProfile((p) => ({
        ...p,
        socialLinks: [...p.socialLinks, newSocialLink.trim()],
      }));
      setNewSocialLink("");
    }
  }, [newSocialLink]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#181A36" }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#181A36" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Profile</Text>
          </View>

          {/* Cover Image + Profile Image */}
          <View style={styles.coverContainer}>
            <TouchableOpacity onPress={() => handlePickImage("cover")}>
              <Image source={{ uri: coverImage }} style={styles.coverImg} />
            </TouchableOpacity>
            <View style={styles.profileImgWrapper}>
              <TouchableOpacity onPress={() => handlePickImage("profile")}>
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImg}
                />
                <View style={styles.profileImgEdit}>
                  <Text style={{ color: "#fff", fontSize: 14 }}>📷</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Edit Profile */}
          <ProfileCard
            title="Edit Profile"
            isEditing={editSection === "editProfile"}
            onEdit={() =>
              setEditSection(
                editSection === "editProfile" ? null : "editProfile"
              )
            }
            icon="account-edit"
          >
            <ProfileInput
              label="Display Name"
              value={profile.displayName}
              onChangeText={(v) => updateProfile("displayName", v)}
              editable={editSection === "editProfile"}
            />
            {validationErrors.displayName && (
              <Text style={styles.errorText}>
                {validationErrors.displayName}
              </Text>
            )}

            <ProfileInput
              label="Age"
              value={profile.age}
              onChangeText={(v) => updateProfile("age", v)}
              keyboardType="numeric"
              editable={editSection === "editProfile"}
            />
            {validationErrors.age && (
              <Text style={styles.errorText}>{validationErrors.age}</Text>
            )}

            <ProfileInput
              label="Location"
              value={profile.location}
              onChangeText={(v) => updateProfile("location", v)}
              editable={editSection === "editProfile"}
            />
            {validationErrors.location && (
              <Text style={styles.errorText}>{validationErrors.location}</Text>
            )}

            <ProfileInput
              label="Relationship Status"
              value={profile.relationshipStatus}
              onChangeText={() => {}}
              editable={false}
              onPress={() => showDropdown("relationship")}
              showDropdown={true}
            />
          </ProfileCard>

          {/* About Me */}
          <ProfileCard
            title="About me"
            isEditing={editSection === "aboutMe"}
            onEdit={() =>
              setEditSection(editSection === "aboutMe" ? null : "aboutMe")
            }
            icon="account-question"
          >
            <ProfileInput
              label="About Me"
              value={profile.aboutMe}
              onChangeText={(v) => updateProfile("aboutMe", v)}
              multiline
              numberOfLines={3}
              editable={editSection === "aboutMe"}
            />
            {validationErrors.aboutMe && (
              <Text style={styles.errorText}>{validationErrors.aboutMe}</Text>
            )}
          </ProfileCard>

          {/* Core Personality */}
          <ProfileCard
            title="Core Personality"
            isEditing={editSection === "corePersonality"}
            onEdit={() =>
              setEditSection(
                editSection === "corePersonality" ? null : "corePersonality"
              )
            }
            icon="emoticon-cool"
          >
            <ProfileInput
              label="Personality Type"
              value={profile.personalityType}
              onChangeText={(v) => updateProfile("personalityType", v)}
              editable={editSection === "corePersonality"}
            />
            <ProfileInput
              label="Strength"
              value={profile.strength}
              onChangeText={(v) => updateProfile("strength", v)}
              editable={editSection === "corePersonality"}
            />
            <ProfileInput
              label="Growth Areas"
              value={profile.growthAreas}
              onChangeText={(v) => updateProfile("growthAreas", v)}
              editable={editSection === "corePersonality"}
            />
          </ProfileCard>

          {/* Values & Beliefs */}
          <ProfileCard
            title="Values & Beliefs"
            isEditing={editSection === "valuesBeliefs"}
            onEdit={() =>
              setEditSection(
                editSection === "valuesBeliefs" ? null : "valuesBeliefs"
              )
            }
            icon="lightbulb-on"
          >
            <ProfileInput
              label="Core Values"
              value={profile.coreValues.join(", ")}
              onChangeText={(v) => updateProfileArray("coreValues", v)}
              editable={editSection === "valuesBeliefs"}
            />
            {validationErrors.coreValues && (
              <Text style={styles.errorText}>
                {validationErrors.coreValues}
              </Text>
            )}
            <ProfileInput
              label="Life Principle"
              value={profile.lifePrinciple}
              onChangeText={(v) => updateProfile("lifePrinciple", v)}
              editable={editSection === "valuesBeliefs"}
            />
            <ProfileInput
              label="Decision Making"
              value={profile.decisionMaking}
              onChangeText={(v) => updateProfile("decisionMaking", v)}
              editable={editSection === "valuesBeliefs"}
            />
          </ProfileCard>

          {/* Achievements & Milestone */}
          <ProfileCard
            title="Achievements & Milestone"
            isEditing={editSection === "achievements"}
            onEdit={() =>
              setEditSection(
                editSection === "achievements" ? null : "achievements"
              )
            }
          >
            <ProfileInput
              label="Achievements"
              value={profile.achievements}
              onChangeText={(v) => updateProfile("achievements", v)}
              multiline
              numberOfLines={2}
            />
          </ProfileCard>

          {/* Unfiltered & Authentic */}
          <ProfileCard
            title="Unfiltered & Authentic"
            isEditing={editSection === "bucketList"}
            onEdit={() =>
              setEditSection(editSection === "bucketList" ? null : "bucketList")
            }
          >
            <ProfileInput
              label="Bucket List & Life Goals"
              value={profile.bucketList}
              onChangeText={(v) => updateProfile("bucketList", v)}
              multiline
              numberOfLines={2}
            />
          </ProfileCard>

          {/* Favourite Books & Anecdotes */}
          <ProfileCard
            title="Favourite Books & Anecdotes"
            isEditing={editSection === "favouriteBooks"}
            onEdit={() =>
              setEditSection(
                editSection === "favouriteBooks" ? null : "favouriteBooks"
              )
            }
          >
            <ProfileInput
              label="Favourite Books"
              value={profile.favouriteBooks}
              onChangeText={(v) => updateProfile("favouriteBooks", v)}
            />
            <ProfileInput
              label="Favourite Anecdotes"
              value={profile.favouriteAnecdotes}
              onChangeText={(v) => updateProfile("favouriteAnecdotes", v)}
            />
          </ProfileCard>

          {/* Photo Gallery */}
          <ProfileCard
            title="Photo Gallery"
            isEditing={false}
            onEdit={() => {}}
          >
            <FlatList
              data={[...profile.photoGallery, { add: true }]}
              horizontal
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item, index }) => {
                if ("add" in item && item.add) {
                  return (
                    <TouchableOpacity
                      style={styles.photoAdd}
                      onPress={handleAddGalleryImage}
                    >
                      <EvilIcons name="plus" size={28} color="#4B5AF7" />
                    </TouchableOpacity>
                  );
                } else if ("uri" in item) {
                  return (
                    <View style={{ position: "relative" }}>
                      <Image source={{ uri: item.uri }} style={styles.photo} />
                      <TouchableOpacity
                        style={styles.photoRemoveBtn}
                        onPress={() => handleRemoveGalleryImage(index)}
                      >
                        <Ionicons name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  return null;
                }
              }}
              contentContainerStyle={{ gap: 12 }}
              showsHorizontalScrollIndicator={false}
            />
          </ProfileCard>

          {/* Social Media Links */}
          <ProfileCard
            title="Social Media Links"
            isEditing={editSection === "socialLinks"}
            onEdit={() =>
              setEditSection(
                editSection === "socialLinks" ? null : "socialLinks"
              )
            }
            icon="at"
          >
            <View>
              {editSection === "socialLinks" ? (
                <>
                  {profile.socialLinks.map((link, idx) => (
                    <SocialLinkRow
                      key={idx}
                      label={`Social Media Link ${idx + 1}`}
                      value={link}
                      onChange={(v) => handleUpdateSocialLink(idx, v)}
                      onRemove={() => handleRemoveSocialLink(idx)}
                    />
                  ))}
                  <View style={styles.socialLinkRow}>
                    <Text style={styles.inputLabel}>
                      Add New Social Media Link
                    </Text>
                    <TextInput
                      style={[
                        styles.socialLinkText,
                        { flex: 1, color: "#fff" },
                      ]}
                      value={newSocialLink}
                      placeholder="Add new link..."
                      placeholderTextColor="#A0A0A0"
                      onChangeText={setNewSocialLink}
                      onSubmitEditing={handleAddSocialLink}
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      onPress={handleAddSocialLink}
                      style={{ marginLeft: 8 }}
                    >
                      <Ionicons name="add-circle" size={24} color="#4B5AF7" />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <FlatList
                  data={profile.socialLinks}
                  keyExtractor={(_, idx) => idx.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.socialLinkRow}>
                      <Text style={styles.inputLabel}>
                        Social Media Link {index + 1}
                      </Text>
                      <TextInput
                        style={[
                          styles.socialLinkText,
                          { flex: 1, color: "#fff" },
                        ]}
                        value={item}
                        placeholder="@yourhandle"
                        placeholderTextColor="#A0A0A0"
                        onChangeText={(v) => handleUpdateSocialLink(index, v)}
                      />
                      <TouchableOpacity
                        style={styles.socialLinkRemove}
                        onPress={() => handleRemoveSocialLink(index)}
                      >
                        <Ionicons name="close" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                  ListFooterComponent={
                    <View style={styles.socialLinkRow}>
                      <Text style={styles.inputLabel}>
                        Add New Social Media Link
                      </Text>
                      <TextInput
                        style={[
                          styles.socialLinkText,
                          { flex: 1, color: "#fff" },
                        ]}
                        value={newSocialLink}
                        placeholder="Add new link..."
                        placeholderTextColor="#A0A0A0"
                        onChangeText={setNewSocialLink}
                        onSubmitEditing={handleAddSocialLink}
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        onPress={handleAddSocialLink}
                        style={{ marginLeft: 8 }}
                      >
                        <Ionicons name="add-circle" size={24} color="#4B5AF7" />
                      </TouchableOpacity>
                    </View>
                  }
                />
              )}
            </View>
          </ProfileCard>

          {/* Customize Button */}
          <TouchableOpacity style={styles.customizeBtn}>
            <Text style={styles.customizeBtnText}>Customize Your Profile</Text>
          </TouchableOpacity>
          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.customizeBtn,
              {
                backgroundColor: Object.keys(validationErrors).some(
                  (key) => validationErrors[key as keyof ValidationErrors]
                )
                  ? "#666"
                  : "#43C463",
                marginTop: 10,
              },
            ]}
            onPress={handleSaveProfile}
            disabled={Object.keys(validationErrors).some(
              (key) => validationErrors[key as keyof ValidationErrors]
            )}
          >
            <Text style={[styles.customizeBtnText, { color: "#fff" }]}>
              Save
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Dropdown Modal - only for Relationship Status */}
        <Modal
          visible={dropdownVisible}
          transparent
          animationType="fade"
          onRequestClose={hideDropdown}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={hideDropdown}
            activeOpacity={1}
          >
            <View style={styles.dropdownModal}>
              {relationshipOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownOption}
                  onPress={() => updateDropdownValue("relationship", option)}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      profile.relationshipStatus === option && {
                        fontWeight: "bold",
                        color: "#fff",
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A36",
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: "#181A36",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    top: 24,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#23244A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  backBtnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  coverContainer: {
    width: "100%",
    height: 180,
    marginBottom: 64,
    position: "relative",
  },
  coverImg: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    resizeMode: "cover",
  },
  profileImgWrapper: {
    position: "absolute",
    left: width / 2 - 60,
    bottom: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#23244A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  profileImg: {
    width: 108,
    height: 108,
    borderRadius: 54,
  },
  profileImgEdit: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#4B5AF7",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  card: {
    borderRadius: 22,
    marginHorizontal: 12,
    marginBottom: 22,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.13)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  cardHeaderIcon: {
    marginRight: 10,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    letterSpacing: 0.4,
  },
  editBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "rgba(75,90,247,0.12)",
  },
  cardBody: {
    // Add cardBody styles if needed
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "rgba(40, 20, 80, 0.98)",
    borderRadius: 18,
    paddingVertical: 8,
    width: "80%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.10)",
  },
  dropdownOption: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  dropdownOptionText: {
    color: "#fff",
    fontSize: 16,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: "#23244A",
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.13)",
  },
  photoAdd: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: "#4B5AF7",
  },
  photoRemoveBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#4B5AF7",
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  socialLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(24,26,54,0.85)",
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  socialLinkText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
  },
  socialLinkRemove: {
    marginLeft: 8,
    backgroundColor: "#4B5AF7",
    borderRadius: 10,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  customizeBtn: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: "#4B5AF7",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  customizeBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  inputLabel: {
    color: "#ccc",
    fontWeight: "bold",
    fontSize: 12,
    marginVertical: 9,
    // marginBottom: 8,
    // marginTop: 8,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default CreateProfileScreen;
