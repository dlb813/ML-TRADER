import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentiment from "sentiment";
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState, useRef } from 'react';
import * as ml5 from "ml5";
import { getCompletion } from "gpt3";
import { Stocks } from "./Stocks";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FavoritesContent from "./Favorites";
import SearchContent from "./Search";
import HistoryContent from "./History";

async function Predict(name) {
  var res;

  console.log("predicting");
  var res = await fetch('http://localhost:3000/api/generate?q=Will%20' + name + '%20stock%20increase%20or%20decrease?%20Why?%20Give%20an%20opinionated%20answer.\n\n', { mode: 'cors' });
  var report = await res.text();
  var rep = report;

  var thought;
  var sentiment = new Sentiment();
  var options = {
    extras: {
      'amazing': 2,
      'positive': 2,
      'will be up': 2,
      'to be up': 2,
      'will decline': -3,
      'expect a negative return ': -6,
      'continue to rise': 2,
      'is under pressure': -7,
    }
  };
  var prediction = sentiment.analyze(rep, options);
  if (prediction.score > 0) {
    thought = "Buy!";
  }
  else if (prediction.score == 0) {
    thought = "Hold!";
  }
  else {
    thought = "Sell!";
  }
  var pred = [thought, rep];
  return pred;
}

function HomeScreen() {
  useEffect(() => {

  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stocks makePrediction={Predict} />
    </View>
  )
}

function AboutScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <Text style={{color:'white', marginHorizontal:'2rem', fontWeight:'bold', textAlign:'center'}}>
        This was a side project built over the span of around a month. By building it I expanded upon my knowledge of app development and full-stack development.
      </Text>
    </View>
  );
}
function Favorites({navigation}) {
  const favorites = useRef();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
     
      favorites.current.Refresh();
      
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FavoritesContent makePrediction={Predict} ref={favorites}/>
    </View>
  );
}
function History({navigation}) {
  const history = useRef();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      history.current.Refresh();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <HistoryContent makePrediction={Predict} ref={history}/>
    </View>
  );
}
function Search() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <SearchContent makePrediction={Predict}/>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Search" component={Search} options={{
        tabBarLabel: 'Search',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="card-search" color={color} size={26} />
        ),
      }}/>
      <Tab.Screen name="Favorites" component={Favorites} options={{
        tabBarLabel: 'Favorites',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="bookmark" color={color} size={26} />
        ),
      }}/>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
      }} />
      <Tab.Screen name="History" component={History} options={{
        tabBarLabel: 'History',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="history" color={color} size={26} />
        ),
      }}/>
       <Tab.Screen name="About" component={AboutScreen} options={{
        tabBarLabel: 'About',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="information" color={color} size={26} />
        ),
      }}/>
    </Tab.Navigator>
  );
}
const myTheme = DarkTheme;
myTheme.colors.text = 'rgb(256, 256, 256)';
myTheme.colors.background = DarkTheme.colors.border;
myTheme.colors.primary = DarkTheme.colors.primary;
export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <MyTabs />
    </NavigationContainer>
  );
}