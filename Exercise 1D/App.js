import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {Barometer} from "expo-sensors";


const styles = StyleSheet.create({
    container: {

    },
});

export default function App() {

    // const [{x, y, z}, setData] = useState({x:0, y:0, z:0});
    const [{pressure, relativeAltitude}, setData] = useState({pressure: 0, relativeAltitude: 0});

    useEffect(() => {
        Barometer.setUpdateInterval(100);
        const subscription = Barometer.addListener(setData);
        return () => subscription.remove();
    }, []);

    return (
        <View>
            <StatusBar/>
            <Text>Pressure: {pressure}</Text>
            <Text>Relative Attitude: {relativeAltitude}</Text>
        </View>
    );
}


