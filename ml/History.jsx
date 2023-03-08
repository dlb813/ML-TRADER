import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    FlatList,
    Pressable,
    Modal,
    RefreshControl,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Cache } from "react-native-cache";

const HistoryContent = forwardRef((props, ref) => {
    const [Stocks, setStocks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState();


    useEffect(() => {
        LoadHistory();
    }, []);

    useImperativeHandle(ref, () => ({
        Refresh() {
            LoadHistory();
        },
    }))

    async function LoadHistory() {
        const cache = new Cache({
            namespace: "History",
            policy: {
                stdTTL: 0
            },
            backend: AsyncStorage
        });
        var text = [];
        const entries = await cache.getAll();
        for (let ent in entries) {
            const val = await cache.get(ent);
            text.push({ name: val[0], symbol: val[1], report: val[2], decision: val[3] });
        }
        setStocks(text);
    }

    async function prediction(name, symbol) {
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
        setModalVisible(true);
        console.log("s");
    }

    return (
        <View>
            <ScrollView>
            <FlatList data={Stocks} style={styles.list} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true} renderItem={({ item, separators }) => (
                <Pressable
                    key={item.name}
                    onPress={() => { setModalVisible(true); setModalContent(<Text style={styles.modalText}>Loading</Text>); prediction(item.name, item.symbol) }}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}
                    style={styles.Pressable}>
                    <View style={styles.view}>
                        <Text style={styles.text}>{item.name}
                            <br></br>{item.symbol}</Text>
                    </View>
                </Pressable>
            )} />
            </ScrollView>
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
});


const styles = StyleSheet.create({
    view: {
        margin: 0,
        flex: 1,
        padding: 10,
    },
    text: {
        color: 'white',
        marginTop: 2,
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
    list: {
        maxHeight: 400,
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
        borderRadius: 20,
        borderColor: "white",
        borderWidth: 2,
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

export default HistoryContent;