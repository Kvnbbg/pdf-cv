import React from 'react';
import { View, Alert } from 'react-native';
import { Button, Card, Input, Avatar } from 'react-native-elements';

const UserProfile = ({ firstName, email, contact, dispatch }) => {
  // useEffect hooks removed for brevity as they are not core to the refactor's goal

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
    <View style={{ width: '100%' }}> // Ensure Card takes full width of its container
      <Card>
        <Card.Title>Personal Details</Card.Title>
        <Card.Divider />
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Avatar
            rounded
            size="large"
            source={require('../pdf-cv/src/assets/user-image.jpg')}
          />
        </View>
        <Input
          placeholder="First name"
          value={firstName}
          onChangeText={(text) => dispatch({ type: "SET_FIRST_NAME", payload: text })}
        />
        <Input
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => dispatch({ type: "SET_EMAIL", payload: text })}
        />
        <Input
          placeholder="Contact"
          value={contact}
          onChangeText={(text) => dispatch({ type: "SET_CONTACT", payload: text })}
          // keyboardType="phone-pad" // Optionally
        />
        <Button
          title="Submit Details"
          onPress={handleSubmit}
          // containerStyle={{ marginTop: 10 }}
        />
      </Card>
    </View>
  );
};

export default UserProfile;
