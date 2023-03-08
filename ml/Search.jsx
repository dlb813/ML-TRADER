import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Pressable,
    Modal,
    Button,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Cache } from "react-native-cache";
import { Symbols, Names } from "./Data";
const stocksAndSymbols = Symbols.concat(Names);

export default function SearchContent(props) {
    const [search, setSearch] = useState("");
    const [modalContent, setModalContent] = useState();
    
    const [results, setResults] = useState([<Text style={styles.modalText}>Search for a stock name or symbol.</Text>]);

    const [modalVisible, setModalVisible] = useState(false);

    const updateSearch = async (search) => {
        setSearch(search);
        var content = [];
        var i = 0;
        var included = 0;
        for (let sym in Symbols) {
            let index =i;
            if (stocksAndSymbols[i].toUpperCase().includes(search.toUpperCase()) || stocksAndSymbols[i + Symbols.length].includes(search)) {
                content.push(<Pressable key={sym} style={styles.pressable} onPress={async () => {setModalVisible(true); setModalContent(<Text style={styles.modalText}>Loading</Text>);await prediction(Names[index],Symbols[index]); }}><Text key={"text:" + sym} style={styles.text}>{Symbols[i]}<br></br>{Names[i]}</Text></Pressable>)
                included++;
            }
            if (included >= 5) {
                break;
            }


            i++;
        }
        setResults(content);
    };

    async function prediction(name, symbol){
        var prediction = await props.makePrediction(name);

        var pred = prediction[1].replace(/\n/g, '');
        setModalContent(
            <View>
            <Text style={styles.modalText}>{name}</Text>
            <Text style={styles.modalText}>{symbol}</Text>
            <Text style={styles.modalText}>{prediction[0]}</Text>
            <Text style={styles.modalText}>{pred}</Text>
            </View>
        );

    }

    return (
        <View style={styles.view}>
            <SearchBar placeholder="Search..." onChangeText={updateSearch} value={search} />
            <ScrollView>{results}</ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {modalContent}
                        <Pressable
                            style={[styles.hideModal, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.modalText}>Hide Modal</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        margin: 0,
        flex: 1,
        padding: 10,
    },
    text: {
        color: 'white',
        marginTop: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: "#D8D8D8",
        borderRadius: 6,
        backgroundColor: "#291F3F",
        color: "#FFFFFF",
        textAlign: "left",
        fontSize: 12,
        fontWeight: "bold"
    },
    modalText: {
        textAlign: "center",
        color: "white"
    },
    hideModal: {
        textAlign: "center",
        color: "white",
        backgroundColor: "#625D72",
        padding: 4,
        paddingHorizontal: 50,
        borderRadius: 10,
        marginTop: 10,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#3A3441",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
});