import { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with real reset (Supabase)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <View style={[styles.successIcon, { backgroundColor: theme.card }]}>
            <Text style={styles.successEmoji}>✉️</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Check Your Email</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            We sent a password reset link to:
          </Text>
          <Text style={[styles.email, { color: theme.gold }]}>{email}</Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Back to Sign In"
              onPress={() => router.replace('/(auth)/login')}
              variant="outline"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={[styles.backText, { color: theme.gold }]}>← Back</Text>
          </TouchableOpacity>

          <Text style={[styles.title, { color: theme.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Enter your email and we'll send you a link to reset your password.
          </Text>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button title="Send Link" onPress={handleReset} loading={loading} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.xl,
  },
  backText: {
    fontSize: 16,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 80,
    marginBottom: spacing.xl,
  },
  successEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  buttonContainer: {
    marginTop: spacing.xl,
  },
});
