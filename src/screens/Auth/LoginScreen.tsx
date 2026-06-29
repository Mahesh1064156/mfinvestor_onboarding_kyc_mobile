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
  emailOrMobile: string;
  password: string;
};

const LoginScreen = ({ navigation }: any) => {
  const { login, loading } = useAuth();

  const [form, setForm] = useState<FormType>({
    emailOrMobile: "",
    password: "",
  });

  const handleChange = (key: keyof FormType, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    if (!form.emailOrMobile.trim() || !form.password.trim()) {
      Alert.alert('Validation Error', 'Email/Mobile and Password are required to login.');
      return;
    }

    try {
      const res = await login(form);
      Alert.alert('Success', res.message || 'Logged in successfully', [
        {
          text: 'OK',
          onPress: () => navigation?.navigate('DashboardScreen'),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.error || err.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email or Mobile"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(v) => handleChange("emailOrMobile", v)}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(v) => handleChange("password", v)}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation?.navigate('Register')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E293B",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: "#007BFF",
    textAlign: "center",
    fontWeight: "600",
  },
});
