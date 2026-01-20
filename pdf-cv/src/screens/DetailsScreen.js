import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

const DetailsScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { stars, tips } = route.params || {};
  console.log('[DetailsScreen] Received params - Stars:', stars, 'Tips:', tips);

  if (typeof stars === 'undefined' || !tips) {
    console.warn('[DetailsScreen] Stars or Tips are missing in route params.');
  }

  const getStarEmoji = (count) => {
    return '⭐'.repeat(count || 0);
  };

  const summaryCards = [
    { label: 'Overall quality', value: typeof stars === 'number' ? `${stars} / 5` : 'N/A' },
    { label: 'Insights delivered', value: Array.isArray(tips) ? `${tips.length}` : '0' },
    { label: 'Resume status', value: typeof stars === 'number' && stars >= 4 ? 'Strong' : 'Needs polish' },
  ];

  const renderTipItem = ({ item }) => (
    <View style={styles.tipItemContainer}>
      <Text style={styles.tipIcon}>💡</Text>
      <Text style={styles.tipText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CV Analysis Results</Text>
          <Text style={styles.headerSubtitle}>Your personalized breakdown and next actions.</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Quality score</Text>
          <Text style={styles.heroScore}>
            {typeof stars === 'number' ? `${getStarEmoji(stars)} ${stars} / 5` : 'Not available'}
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          {summaryCards.map((card) => (
            <View key={card.label} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{card.label}</Text>
              <Text style={styles.summaryValue}>{card.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsHeader}>Suggestions for improvement</Text>
          {tips && tips.length > 0 ? (
            <FlatList
              data={tips}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTipItem}
              style={styles.tipsList}
              contentContainerStyle={styles.tipsListContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noTipsText}>Great CV! No specific improvement tips at the moment.</Text>
          )}
        </View>

        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const buildShadow = (theme) => ({
  shadowColor: theme.SHADOW_COLOR,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: theme.mode === 'dark' ? 0.35 : 0.12,
  shadowRadius: 12,
  elevation: 4,
});

const getStyles = (theme) => {
  const shadow = buildShadow(theme);
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
    },
    header: {
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.TEXT_COLOR,
    },
    headerSubtitle: {
      marginTop: 6,
      color: theme.MUTED_TEXT_COLOR,
    },
    heroCard: {
      padding: 18,
      borderRadius: 18,
      backgroundColor: theme.CARD_BACKGROUND_COLOR,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      ...shadow,
    },
    heroLabel: {
      fontSize: 14,
      color: theme.MUTED_TEXT_COLOR,
      marginBottom: 6,
    },
    heroScore: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.STAR_COLOR,
    },
    summaryGrid: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
      marginBottom: 16,
    },
    summaryCard: {
      flex: 1,
      padding: 12,
      borderRadius: 14,
      backgroundColor: theme.SECONDARY_SURFACE_COLOR,
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      alignItems: 'center',
    },
    summaryLabel: {
      fontSize: 12,
      color: theme.MUTED_TEXT_COLOR,
      textAlign: 'center',
    },
    summaryValue: {
      marginTop: 6,
      fontSize: 15,
      fontWeight: '700',
      color: theme.TEXT_COLOR,
      textAlign: 'center',
    },
    tipsSection: {
      flex: 1,
    },
    tipsHeader: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
      color: theme.TEXT_COLOR,
    },
    tipsList: {
      flexGrow: 0,
    },
    tipsListContent: {
      paddingBottom: 12,
    },
    tipItemContainer: {
      backgroundColor: theme.CARD_BACKGROUND_COLOR,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 15,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
      ...shadow,
    },
    tipIcon: {
      fontSize: 16,
      marginRight: 10,
      color: theme.PRIMARY_COLOR,
      lineHeight: 24,
    },
    tipText: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.TEXT_COLOR,
      flex: 1,
    },
    noTipsText: {
      fontSize: 15,
      fontStyle: 'italic',
      textAlign: 'center',
      color: theme.MUTED_TEXT_COLOR,
      marginTop: 10,
    },
    primaryButton: {
      marginTop: 12,
      backgroundColor: theme.PRIMARY_COLOR,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: theme.BUTTON_TEXT_COLOR,
      fontWeight: '700',
      fontSize: 15,
    },
    buttonPressed: {
      transform: [{ scale: 0.98 }],
    },
  });
};

export default DetailsScreen;
