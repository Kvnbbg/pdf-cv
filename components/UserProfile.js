import React from 'react';
import { View, Alert, Text } from 'react-native'; // Added Text for Card.Title
import { Button, Card, Input, Avatar } from 'react-native-elements';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const UserProfile = ({ firstName, email, contact, dispatch }) => {
  const { theme } = useTheme(); // Consume theme context

  const handleSubmit = () => {
    const profileData = { firstName, email, contact };
    console.log('[UserProfile] handleSubmit called. Profile data:', profileData);
    // Here, you could add validation before dispatching
    Alert.alert("Profile Submitted", `Name: ${profileData.firstName}\nEmail: ${profileData.email}\nContact: ${profileData.contact}`);
    // If you had a specific action for submitting/saving profile details:
    // dispatch({ type: 'SAVE_PROFILE_DETAILS', payload: profileData });
    // console.log('[UserProfile] Dispatched SAVE_PROFILE_DETAILS (simulated).');
  };

  return (
    <View style={{ width: '100%' }}>
      <Card containerStyle={{ backgroundColor: theme.CARD_BACKGROUND_COLOR, borderColor: theme.BORDER_COLOR }}>
        <Card.Title style={{ color: theme.TEXT_COLOR }}>Personal Details</Card.Title>
        <Card.Divider color={theme.BORDER_COLOR}/>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Avatar
            rounded // Avatar styling might need more specific props for theming if available
            size="large"
            source={require('../pdf-cv/src/assets/user-image.jpg')}
          />
        </View>
        <Input
          placeholder="First name"
          value={firstName}
          onChangeText={(text) => dispatch({ type: "SET_FIRST_NAME", payload: text })}
          inputStyle={{ color: theme.TEXT_COLOR }}
          placeholderTextColor={theme.PLACEHOLDER_TEXT_COLOR}
        />
        <Input
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => dispatch({ type: "SET_EMAIL", payload: text })}
          inputStyle={{ color: theme.TEXT_COLOR }}
          placeholderTextColor={theme.PLACEHOLDER_TEXT_COLOR}
        />
        <Input
          placeholder="Contact"
          value={contact}
          onChangeText={(text) => dispatch({ type: "SET_CONTACT", payload: text })}
          inputStyle={{ color: theme.TEXT_COLOR }}
          placeholderTextColor={theme.PLACEHOLDER_TEXT_COLOR}
          // keyboardType="phone-pad" // Optionally
        />
        <Button
          title="Submit Details"
          onPress={handleSubmit}
          buttonStyle={{ backgroundColor: theme.PRIMARY_COLOR }}
          // containerStyle={{ marginTop: 10 }} // Keep if needed
        />
      </Card>
    </View>
  );
};

export default UserProfile;
