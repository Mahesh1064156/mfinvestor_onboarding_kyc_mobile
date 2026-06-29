import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

type FormType = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role_id: string;
};

const RegisterScreen = ({ navigation }: any) => {
  const { register, loading } = useAuth();

  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role_id: "1",
  });

  const handleChange = (key: keyof FormType, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    // Validate empty fields
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim() || !form.password.trim()) {
      Alert.alert('Validation Error', 'All fields, including Password, are required to register.');
      return;
    }

    try {
      const res = await register(form);
      Alert.alert('Success', res.message || 'Registered successfully', [
        {
          text: 'OK',
          onPress: () => navigation?.navigate('PanScreen'),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.error || err.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={(v) => handleChange("name", v)}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        onChangeText={(v) => handleChange("email", v)}
      />

      <TextInput
        placeholder="Mobile"
        style={styles.input}
        keyboardType="phone-pad"
        onChangeText={(v) => handleChange("mobile", v)}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(v) => handleChange("password", v)}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation?.navigate('Login')} style={{ marginTop: 20 }}>
        <Text style={{ color: '#007BFF', textAlign: 'center', fontWeight: '600' }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
