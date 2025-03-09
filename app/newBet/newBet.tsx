import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Example user groups data - this would come from your API in production
interface UserGroup {
  id: string;
  name: string;
}

interface ImageInfo {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
  fileName?: string;
}

const mockUserGroups: UserGroup[] = [
  { id: "1", name: "Football Club" },
  { id: "2", name: "Poker Night" },
  { id: "3", name: "Office Pool" },
  { id: "4", name: "Fantasy League" },
  { id: "5", name: "Other" }
];

export default function NewBet() {
  const navigation = useNavigation();
  const [betTitle, setBetTitle] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [betDescription, setBetDescription] = useState("");
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  
  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload an image!');
      }
    })();
  }, []);
  
  // Fetch user's groups - simulated with timeout
  useEffect(() => {
    const fetchUserGroups = async () => {
      setLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, this would be an API call like:
        // const response = await fetch('api/user/groups');
        // const data = await response.json();
        
        setUserGroups(mockUserGroups);
        
        // Set the first group as default selected
        if (mockUserGroups.length > 0) {
          setSelectedGroup(mockUserGroups[0].id);
        }
      } catch (error) {
        console.error("Error fetching user groups:", error);
        // Fallback to empty array if fetch fails
        setUserGroups([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserGroups();
  }, []);
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const pickImage = async () => {
    setImageLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    } catch (err) {
      console.error("Error picking image:", err);
      alert("Failed to select image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };
  
  const takePhoto = async () => {
    setImageLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to take a photo!');
        setImageLoading(false);
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    } catch (err) {
      console.error("Error taking photo:", err);
      alert("Failed to take photo. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };
  
  const removeImage = () => {
    setImage(null);
  };
  
  const handleCreateBet = () => {
    // Get the selected group name for submission
    const selectedGroupName = userGroups.find(group => group.id === selectedGroup)?.name;
    
    // Create the bet object to submit
    const newBet = {
      title: betTitle,
      amount: betAmount,
      description: betDescription,
      groupId: selectedGroup,
      groupName: selectedGroupName,
      imageUri: image?.uri
    };
    
    console.log("Creating new bet:", newBet);
    
    // Here you would submit to your API
    // Example: 
    // const formData = new FormData();
    // formData.append('title', betTitle);
    // formData.append('amount', betAmount);
    // formData.append('description', betDescription);
    // formData.append('groupId', selectedGroup);
    // 
    // if (image) {
    //   const imageName = image.uri.split('/').pop();
    //   const imageType = 'image/' + (imageName?.split('.').pop()?.toLowerCase() === 'png' ? 'png' : 'jpeg');
    //   
    //   formData.append('image', {
    //     uri: image.uri,
    //     type: imageType,
    //     name: imageName
    //   } as any);
    // }
    //
    // await fetch('api/bets', { 
    //   method: 'POST', 
    //   body: formData,
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   }
    // });
    
    // Navigate back after creation
    navigation.goBack();
  };
  
  return (
    <LinearGradient
      colors={['#161638', '#714F60', '#B85B44']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Bet</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={betTitle}
            onChangeText={setBetTitle}
            placeholder="Enter Title"
            placeholderTextColor="#999"
          />
          
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={betAmount}
            onChangeText={setBetAmount}
            placeholder="Enter Price"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          
          <Text style={styles.label}>Image</Text>
          <View style={styles.imageContainer}>
            {imageLoading ? (
              <View style={styles.imagePlaceholder}>
                <ActivityIndicator size="large" color="white" />
              </View>
            ) : image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <Ionicons name="close-circle" size={26} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imageButtonsContainer}>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <Ionicons name="images-outline" size={24} color="white" />
                  <Text style={styles.imageButtonText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <Ionicons name="camera-outline" size={24} color="white" />
                  <Text style={styles.imageButtonText}>Camera</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <Text style={styles.label}>Group</Text>
          {loading ? (
            <ActivityIndicator color="white" style={styles.loader} />
          ) : userGroups.length > 0 ? (
            <View style={styles.categoriesContainer}>
              {userGroups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.categoryBadge,
                    selectedGroup === group.id && styles.categoryActive
                  ]}
                  onPress={() => setSelectedGroup(group.id)}
                >
                  <Text 
                    style={[
                      styles.categoryText,
                      selectedGroup === group.id && styles.categoryTextActive
                    ]}
                  >
                    {group.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noGroupsContainer}>
              <Text style={styles.noGroupsText}>You are not a member of any groups yet</Text>
              <TouchableOpacity style={styles.joinGroupButton}>
                <Text style={styles.joinGroupButtonText}>Browse Groups</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={betDescription}
            onChangeText={setBetDescription}
            placeholder="Enter Description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[
              styles.createButton,
              (!selectedGroup || !betTitle || !betAmount) && styles.createButtonDisabled
            ]} 
            onPress={handleCreateBet}
            disabled={!selectedGroup || !betTitle || !betAmount}
          >
            <Text style={styles.createButtonText}>Create Bet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  imageContainer: {
    marginBottom: 16,
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
  },
  imageButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "45%",
  },
  imageButtonText: {
    color: "white",
    marginTop: 8,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreviewContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  categoryBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 10,
    marginBottom: 10,
  },
  categoryActive: {
    backgroundColor: "white",
  },
  categoryText: {
    color: "#ccc",
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#312C60",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#6F8AAB",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  createButtonDisabled: {
    backgroundColor: "rgba(111, 138, 171, 0.5)",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
  noGroupsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginVertical: 10,
  },
  noGroupsText: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
  },
  joinGroupButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinGroupButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});