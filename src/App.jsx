import { StyleSheet, View, Text, StatusBar } from 'react-native';

import { colors } from './theme';

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <Text style={styles.title}>OfficePocket</Text>
            <Text style={styles.subtitle}>Финанси, документи и отпуски на едно място</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        color: colors.primary,
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 15,
        marginTop: 8,
        textAlign: 'center',
    },
});