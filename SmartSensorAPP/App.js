
import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, RefreshControl, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTemperature0, faTint, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import * as Font from 'expo-font';
import logo from './assets/adaptive-icon.png';
import CircularProgress from 'react-native-circular-progress-indicator';
import axios from 'axios';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

export default function App() {

  const URL = 'https://smartsensor.onrender.com/'

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getData = async () => {
    setLoading(true);
    const response = await axios.get(URL + 'api/getAllData');
    setData(response.data.data);
    setLoading(false);
  }

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'space-mono-bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
        'space-mono-italic': require('./assets/fonts/SpaceMono-Italic.ttf'),
        'space-mono-bold-italic': require('./assets/fonts/SpaceMono-BoldItalic.ttf'),

      });
    };

    loadFonts().then(() => setFontsLoaded(true));
    getData();

  }, []);

  useEffect(() => {
    console.log(data);
  }
    , [data]);

  //arary of colors for the temperature only 4 colors form blue to red
  const colors = ['#73A4FE', '#7FFFD4', '#7FFFD4', '#FF5C0C', '#FF5C0C', '#FF5C0C'];


  const onRefresh = () => {
    // Perform the refresh action here
    // You can fetch new data or update existing data

    // Simulate a delay for demonstration purposes
    setRefreshing(true);
    getData();
    setRefreshing(false);
    setLoading(false);

  };

  const getlastTempHum = (data) => {
    let lastTemp = 0;
    let lastHum = 0;
    if (data.length > 0) {
      lastTemp = data[data.length - 1].temp;
      lastHum = data[data.length - 1].hum;
    }
    return [lastTemp, lastHum];
  }

  const get5lastTemp = (data) => {
    let lastTemp = [];
    if (data.length > 0) {
      for (let i = 0; i < 5; i++) {
        lastTemp.push(data[data.length - 1 - i].temp);
      }
    }
    return lastTemp;
  }

  const get5lasthour = (data) => {
    let lasthour = [];
    if (data.length > 0) {
      for (let i = 0; i < 5; i++) {
        lasthour.push(data[data.length - 1 - i].hour);
      }
    }
    return lasthour;
  }

  const SendEmail = async () => {

    try {
      const response = await axios.get(URL + 'api/sendEmail')
      ToastAndroid.show('Data  .xls file sent to your email !! ', ToastAndroid.SHORT);
    }
    catch (error) {
      console.log(error);
      ToastAndroid.show('Error Sending Email', ToastAndroid.SHORT);
    }
  

  }







  if (!fontsLoaded || loading) {
    // Render a loading indicator or an alternative component while fonts are loading
    return (

      <View style={{ flex: 1, backgroundColor: '#fff' }}>

        <Text style={{ color: '#000', fontSize: 14, marginBottom: 5 }}>Loading ...</Text>


      </View>
    )
  }


  return (

    <View style={{ flex: 1, backgroundColor: '#fff' }} key={refreshing}>
      <ScrollView contentContainerStyle={styles.container}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }


      >
        <View style={{ height: 150, backgroundColor: 'black', width: '100%', borderRadius: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'start', alignItems: 'center', padding: 10 }}>
            <Image source={logo} style={{ width: 40, height: 40, marginRight: 10 }} />
            <Text style={styles.title} >SMART SENSOR V1.0</Text>


          </View>

        </View>

        <View style={{
          flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 15
          , backgroundColor: 'white', width: Dimensions.get("window").width - 20, borderRadius: 10, marginTop: -30,
          shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faTemperature0} size={30} color={getlastTempHum(data)[0] < 20 ? colors[0] : getlastTempHum(data)[0] < 40 ? colors[1] : getlastTempHum(data)[0] < 60 ? colors[2] : getlastTempHum(data)[0] < 80 ? colors[3] : getlastTempHum(data)[0] < 90 ? colors[4] : colors[5]} />
            <Text style={{ color: getlastTempHum(data)[0] < 20 ? colors[0] : getlastTempHum(data)[0] < 40 ? colors[1] : getlastTempHum(data)[0] < 60 ? colors[2] : getlastTempHum(data)[0] < 80 ? colors[3] : getlastTempHum(data)[0] < 90 ? colors[4] : colors[5], fontSize: 26, fontFamily: 'space-mono' }}>{getlastTempHum(data)[0]}°C</Text>


          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faTint} size={30} color={'#73A4FE'} />
            <Text style={{ color: '#73A4FE', fontSize: 26, fontFamily: 'space-mono' }}>{getlastTempHum(data)[1]}% </Text>

          </View>
        </View>


        <SafeAreaView >


          <View style={styles.containerd}>
            <View style={styles.card}>
              <LineChart
                data={{
                  labels: get5lasthour(data),
                  datasets: [
                    {
                      data: get5lastTemp(data)
                    }
                  ]
                }}
                width={Dimensions.get("window").width - 40} // from react-native
                height={220}
                //yAxisLabel="$"
                yAxisSuffix="C"
                yAxisInterval={1} // optional, defaults to 1

                chartConfig={{
                  backgroundColor: "#FFF",
                  backgroundGradientFrom: "#ffff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 1, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = .1) => `rgba(0, 0, 0, .5)`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "3",
                    strokeWidth: "2",
                    stroke: "#000"
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
                withVerticalLines={false}
              />

            </View>

          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, width: Dimensions.get("window").width - 20, gap: 10 }}>

            <View style={[styles.smallCard, { width: '48%' }]}>
              <Text style={{
                color: '#000', fontSize: 14, fontFamily: 'space-mono', marginBottom: 5
              }}>Temperature C</Text>
              <CircularProgress
                value={getlastTempHum(data)[0]}
                radius={67}
                duration={2000}
                progressValueColor={getlastTempHum(data)[0] < 20 ? colors[0] : getlastTempHum(data)[0] < 40 ? colors[1] : getlastTempHum(data)[0] < 60 ? colors[2] : getlastTempHum(data)[0] < 80 ? colors[3] : getlastTempHum(data)[0] < 90 ? colors[4] : colors[5]}
                inActiveStrokeOpacity={0.2}
                activeStrokeColor={getlastTempHum(data)[0] < 20 ? colors[0] : getlastTempHum(data)[0] < 40 ? colors[1] : getlastTempHum(data)[0] < 60 ? colors[2] : getlastTempHum(data)[0] < 80 ? colors[3] : getlastTempHum(data)[0] < 90 ? colors[4] : colors[5]}
                maxValue={100}
              />
            </View>
            <View style={[styles.smallCard, { width: '48%' }]}>
              <Text style={{ color: '#000', fontSize: 14, fontFamily: 'space-mono' }}>Humidity</Text>
              <CircularProgress
                value={getlastTempHum(data)[1]}
                radius={67}
                duration={2000}
                progressValueColor={'#73A4FE'}
                inActiveStrokeOpacity={0.2}
                activeStrokeColor={'#73A4FE'}
                maxValue={100}
              />
            </View>
          </View>


          <View style={{ justifyContent: 'start', marginTop: 20, alignItems: 'center', width: Dimensions.get("window").width - 20, gap: 10, padding: 10, backgroundColor: '#fff', borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, height: 300, marginBottom: 20 }}>
            <ScrollView style={{ width: '100%', height: '100%' }} nestedScrollEnabled>

              <Text style={{ color: '#000', fontSize: 14, fontFamily: 'space-mono-bold', marginBottom: 5 }}>Historic Records : {data.length}</Text>




              {data.map((item, index) => {
                return (
                  <View key={index} style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottomColor: '#000', borderBottomWidth: 1, paddingBottom: 10 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                      <Text style={{ color: '#000', fontSize: 14, fontFamily: 'space-mono' }}>Date: {item.date}</Text>
                      <Text style={{ color: '#000', fontSize: 14, fontFamily: 'space-mono' }}>Time: {item.hour}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                      <Text style={{ color: '#000', fontSize: 14, fontFamily: 'space-mono' }}>Temp: {item.temp} C</Text>
                      <Text style={{ color: '#000', fontSize: 14, fontFamily: 'space-mono' }}>Hum: {item.hum}</Text>
                    </View>

                  </View>
                )
              })}






            </ScrollView>
          </View>



          <StatusBar style="light" />



        </SafeAreaView>

      </ScrollView>

      <TouchableOpacity style={styles.floatingButton}

        onPress={() => {

          SendEmail();


        }}

      >
        <FontAwesomeIcon icon={faPaperPlane} size={35} color={'#000'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'start',

  },
  title: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'space-mono-bold',
  },
  containerd: {
    width: '90%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'start',
    marginTop: 20

  },
  card: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'start',
    borderRadius: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
    padding: 10
  },
  smallCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'start',
    borderRadius: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
    padding: 10,
  },
  floatingButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
    padding: 10,
    position: 'absolute',
    bottom: 20,
    right: 20

  }


});
