import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

const SHAKE_THRESHOLD = 1.1;
const UPDATE_INTERVAL = 300;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 110,
        fontWeight: 'bold',
    }
});

export default function App() {
    const [mySound, setMySound] = useState();
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [shakeDetected, setShakeDetected] = useState(false);

    async function playSound() {
        try {
            const soundfile = require('./shake1.wav');
            const { sound } = await Audio.Sound.createAsync(soundfile);
            setMySound(sound);
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    }

    const handleAccelerometerData = ({ x, y, z }) => {
        setData({ x, y, z });
        const totalMovement = Math.sqrt(x * x + y * y + z * z);
        if (totalMovement > SHAKE_THRESHOLD) {
            setShakeDetected(true);
            playSound();
        } else {
            setShakeDetected(false);
        }
    };

    useEffect(() => {
        Accelerometer.setUpdateInterval(UPDATE_INTERVAL);

        const subscription = Accelerometer.addListener(handleAccelerometerData);

        return () => {
            subscription && subscription.remove();
        };
    }, []);

    useEffect(() => {
        return mySound
            ? () => {
                console.log('Unloading Sound');
                mySound.unloadAsync();
            }
            : undefined;
    }, [mySound]);

    return (
        <View style={styles.container}>
            <StatusBar />
            <Text>Try shaking your phone!</Text>
            <Text style={styles.text}>{shakeDetected ? "SHAKE!" : ""}</Text>
        </View>
    );
}
