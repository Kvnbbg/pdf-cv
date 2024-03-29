// Import React and necessary components
import React from 'react';
import { View } from 'react-native';
import { Button, Card, Input, Avatar } from 'react-native-elements';
const UserProfile = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Avatar
          rounded
          size="large"
          source={{ uri: 'https://example.com/user-avatar.jpg' }}
        />
        <Card>
          <Card.Title>User Profile</Card.Title>
          <Card.Divider />
          <Input placeholder="Username" />
          <Input placeholder="Email" keyboardType="email-address" />
          <Button title="Update Profile" onPress={() => console.log("Profile Updated")} />
        </Card>
      </View>
    );
  };
  
  export default UserProfile;
  