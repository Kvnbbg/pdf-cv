import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, SafeAreaView } from 'react-native';

const DetailsScreen = ({ route, navigation }) => {
    const { stars, tips } = route.params || {};
    console.log('[DetailsScreen] Received params - Stars:', stars, 'Tips:', tips);

    if (typeof stars === 'undefined' || !tips) {
        console.warn('[DetailsScreen] Stars or Tips are missing in route params.');
    }

    const getStarEmoji = (count) => {
        return '⭐'.repeat(count || 0);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>CV Analysis Results</Text>

                {typeof stars === 'number' ? (
                    <Text style={styles.starsText}>
                        CV Quality: {getStarEmoji(stars)} ({stars} / 5)
                    </Text>
                ) : (
                    <Text style={styles.starsText}>CV Quality: Not available</Text>
                )}

                <Text style={styles.tipsHeader}>Improvement Tips:</Text>
                {tips && tips.length > 0 ? (
                    <FlatList
                        data={tips}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <Text style={styles.tipItem}>• {item}</Text>}
                        style={styles.tipsList}
                    />
                ) : (
                    <Text style={styles.noTipsText}>No specific tips available at the moment.</Text>
                )}

                <View style={styles.buttonContainer}>
                    <Button
                        title="Back to Home"
                        onPress={() => navigation.navigate('Home')}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    starsText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffc107', // Gold color for stars
        marginBottom: 20,
    },
    tipsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: '#444',
    },
    tipsList: {
        marginBottom: 20,
    },
    tipItem: {
        fontSize: 16,
        marginBottom: 8,
        lineHeight: 22, // For better readability
        color: '#555',
    },
    noTipsText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#777',
        marginTop: 10,
    },
    buttonContainer: {
        marginTop: 'auto', // Pushes the button to the bottom
        paddingTop: 20,
    }
});

export default DetailsScreen;