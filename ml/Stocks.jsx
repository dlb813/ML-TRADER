import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import { useEffect, useState } from 'react';
import CardStack, { Card } from 'react-native-card-stack-swiper-stek';
import { Symbols, Names } from "./Data";
import { Cache } from "react-native-cache";
import AsyncStorage from '@react-native-async-storage/async-storage';
var _symbols = [];
var _names = [];
var _pred0 = [];
var _pred1 = [];
function chooseRandomStocks(symbols, names, num) {
  const res = [];
  _symbols = [];
  _names = [];
  for (let i = 0; i < num;) {
    const random = Math.floor(Math.random() * symbols.length);
    if (res.indexOf(symbols[random]) !== -1) {
      continue;
    };
    var rn = random;
    if (names[rn].length >= 60) {
      _names.push(names[rn].substring(0, 60) + "...");
    }
    else {
      _names.push(names[rn]);
    }
    _symbols.push(symbols[rn]);
    i++;
  };
};

export function Stocks(props) {
  const [Cards, setCards] = useState([]);
  var index = 0;
  useEffect(() => {
    load();
  }, [])
  async function addFavorite(name, symbol, report, decision) {
    const cache = new Cache({
      namespace: "Favorites",
      policy: {
        stdTTL: 0
      },
      backend: AsyncStorage
    });
    var data = [name, symbol, report, decision];
    await cache.set(name, data);
    console.log("Set " + name + " as Favorite");
  }
  async function addHistory(name, symbol, report, decision) {
    const cache = new Cache({
      namespace: "History",
      policy: {
        stdTTL: 0
      },
      backend: AsyncStorage
    });
    var data = [name, symbol, report, decision];
    await cache.set(name, data);
    console.log("Set " + name + " as History");
  }
  async function load() {
    _pred0=[];
    _pred1=[];
    chooseRandomStocks(Symbols, Names, 4);
    var tCards = [];
    tCards.push(...Cards);
    for (let sym of _symbols) {
      var prediction = await props.makePrediction(_names[index]);
      _pred0.push(prediction);
      console.log(prediction);
      var pred = prediction[1].replace(/\n/g, '');
      _pred1.push(pred);
      let i =index;
      tCards.push(
        <Card style={styles.card} key={sym} loop={false} onSwiped={()=>addHistory(_names[index],_symbols[index],prediction[0],pred)}>
          <Text style={styles.label} pointerEvents="none">{_names[index]}</Text>
          <Text style={styles.label2} pointerEvents="none">{_symbols[index]}</Text>
          <br></br>
          <Text style={styles.decision} pointerEvents="none">{prediction[0]}</Text>
          <br></br>
          <Text style={styles.report} pointerEvents="none">{pred}</Text>
          <Button
            onPress={() => { addFavorite(_names[i], _symbols[i], pred, prediction[0]) }}
            title="Add to Favorites"
            color="#4E1584"
            accessibilityLabel="Add to favorites"
          />
        </Card>)
      index++;
      if (index == _symbols.length) {
        console.log("done");
        var c = Cards.push.apply(Cards, tCards);
        setCards(tCards);
      }
    }
  }
  var ind = 0;
  return (
    <View style={{ flex: 1 }}>

      <CardStack
        style={styles.content}
        renderNoMoreCards={() => <Text style={{ fontWeight: '700', fontSize: 18, color: 'gray' }}>Loading Cards</Text>}
        onSwiped={() => console.log('onSwiped')}
        outputRotationRange={['-15deg', '0deg', '15deg']}
        onSwiped={() => {
          addHistory(_names[ind],_symbols[ind],_pred0[ind],_pred1[ind]);
          ind++;
          if (ind >= _symbols.length) {
            console.log('swipedihhioAll');
            setCards([]);
            load();
            ind = 0;
          }
        }}
        loop={false}
        onSwipedAll={() => { console.log('swipedAll'); load(); }}
      >
        {Cards}
      </CardStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
  },
  content: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 260,
    height: 400,
    backgroundColor: '#413563',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    padding: 10,
    outlineColor: "#000000",
    outlineStyle: "solid",
    outlineWidth: 4,
    shadowOpacity: 0.5,
  },
  card1: {

    padding: 10,
  },
  card2: {
    backgroundColor: '#FEB12C',
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  label2: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  report: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  decision: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    width: 220,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  orange: {
    width: 55,
    height: 55,
    borderWidth: 6,
    borderColor: 'rgb(246,190,66)',
    borderRadius: 55,
    marginTop: -15
  },
  green: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 75,
    borderWidth: 6,
    borderColor: '#01df8a',
  },
  red: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 75,
    borderWidth: 6,
    borderColor: '#fd267d',
  }
});