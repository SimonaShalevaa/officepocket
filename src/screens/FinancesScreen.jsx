import { StyleSheet, View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import { CommonActions } from '@react-navigation/native';

import { colors } from '../theme';

export default function FinancesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Финанси</Text>
            <Text style={styles.subtitle}>Тук ще е списъкът с приходи и разходи</Text>

            <Button action={CommonActions.goBack()} variant="tinted" color={colors.primary}>
                Назад към таблото
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingHorizontal: 24,
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 15,
        marginBottom: 12,
    },
});