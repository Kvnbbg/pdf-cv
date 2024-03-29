import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Card, Input, Avatar } from 'react-native-elements';

const UserProfile = ({ name, initialAge = 25 }) => {
  const [age, setAge] = useState(initialAge);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Equivalent to componentDidMount and componentWillUnmount
  useEffect(() => {
    console.log('Component did mount');
    return () => {
      console.log('Component will unmount');
    };
  }, []);

  // Equivalent to componentDidUpdate for name prop
  useEffect(() => {
    console.log('Name has updated:', name);
  }, [name]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Avatar
        rounded
        size="large"
        source={{ uri: './assets/user-avatar.jpg' }} // Fixed path
      />
      <Card>
        <Card.Title>{name}'s Profile</Card.Title>
        <Card.Divider />
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <Input
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Age"
          value={age.toString()}
          onChangeText={(text) => setAge(Number(text))}
        />
        <Button title="Update Profile" onPress={() => console.log("Profile Updated")} />
      </Card>
    </View>
  );
};

export default UserProfile;
