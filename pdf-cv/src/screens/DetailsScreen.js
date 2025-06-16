import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useTheme } from '../../../context/ThemeContext'; // Import useTheme

const DetailsScreen = ({ route, navigation }) => {
    const { theme } = useTheme(); // Consume theme context
    const styles = getStyles(theme); // Get dynamic styles
    const { stars, tips } = route.params || {};
    console.log('[DetailsScreen] Received params - Stars:', stars, 'Tips:', tips);

    if (typeof stars === 'undefined' || !tips) {
        console.warn('[DetailsScreen] Stars or Tips are missing in route params.');
    }

    const getStarEmoji = (count) => {
        return '⭐'.repeat(count || 0);
    };

    const renderTipItem = ({ item }) => (
        <View style={styles.tipItemContainer}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>{item}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>CV Analysis Results</Text>

                <View style={styles.starsContainer}>
                    {typeof stars === 'number' ? (
                        <Text style={styles.starsText}>
                            Overall Quality: {getStarEmoji(stars)} ({stars} / 5)
                        </Text>
                    ) : (
                        <Text style={styles.starsText}>Overall Quality: Not available</Text>
                    )}
                </View>

                <Text style={styles.tipsHeader}>Here are some suggestions for improvement:</Text>
                {tips && tips.length > 0 ? (
                    <FlatList
                        data={tips}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderTipItem}
                        style={styles.tipsList}
                        contentContainerStyle={styles.tipsListContent}
                    />
                ) : (
                    <Text style={styles.noTipsText}>Great CV! No specific improvement tips at the moment.</Text>
                )}

                <View style={styles.buttonContainer}>
                    <Button
                        title="Back to Home"
                        onPress={() => navigation.navigate('Home')}
                        color={theme.PRIMARY_COLOR}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

// Styles are now a function of the theme
const getStyles = (theme) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.BACKGROUND_COLOR,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10, // Reduced top padding
        paddingBottom: 20,
    },
    header: {
        fontSize: 26, // Slightly larger
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25, // Increased margin
        color: theme.TEXT_COLOR,
    },
    starsContainer: { // Added container for stars section
        padding: 15,
        backgroundColor: theme.CARD_BACKGROUND_COLOR,
        borderRadius: 8,
        marginBottom: 25, // Increased margin
        alignItems: 'center', // Center stars text
        borderWidth: 1,
        borderColor: theme.BORDER_COLOR,
    },
    starsText: {
        fontSize: 20, // Maintained size
        fontWeight: 'bold',
        color: theme.STAR_COLOR,
        // marginBottom: 20, // Removed as now part of starsContainer
    },
    tipsHeader: {
        fontSize: 20, // Increased size
        fontWeight: '600', // Slightly less than bold
        marginTop: 10,
        marginBottom: 15, // Increased margin
        color: theme.TEXT_COLOR,
        textAlign: 'center', // Center the header for tips
    },
    tipsList: {
        // marginBottom: 20, // Handled by contentContainerStyle or container paddingBottom
    },
    tipsListContent: {
        paddingBottom: 10, // Ensure space for the last item if scrolling
    },
    tipItemContainer: { // New style for each tip item
        backgroundColor: theme.CARD_BACKGROUND_COLOR,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 12, // Increased margin between tips
        flexDirection: 'row',
        alignItems: 'flex-start', // Align icon with the start of the text
        borderWidth: 1,
        borderColor: theme.BORDER_COLOR,
        elevation: 1, // Subtle shadow for Android
        shadowColor: theme.mode === 'dark' ? '#000' : '#000', // Shadow color
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: theme.mode === 'dark' ? 0.2 : 0.1,
        shadowRadius: 1.5,
    },
    tipIcon: { // Style for the tip icon/emoji
        fontSize: 16,
        marginRight: 10,
        color: theme.PRIMARY_COLOR, // Use primary color for icon
        lineHeight: 24, // Align with tipText lineHeight
    },
    tipText: { // Renamed from tipItem
        fontSize: 16,
        lineHeight: 24, // Increased for better readability
        color: theme.TEXT_COLOR,
        flex: 1, // Allow text to wrap
    },
    noTipsText: {
        fontSize: 17, // Slightly larger
        fontStyle: 'italic',
        textAlign: 'center',
        color: theme.PLACEHOLDER_TEXT_COLOR, // Use placeholder color for less emphasis
        marginTop: 10,
    },
    buttonContainer: {
        marginTop: 'auto',
        paddingTop: 20,
    }
});

export default DetailsScreen;