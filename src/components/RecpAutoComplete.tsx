import React, { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native"
import Color from "../theme/Color"
import LinearGradient from "react-native-linear-gradient";
import { ListItem } from "react-native-elements";
import { UserPayload } from "../models/RecepModels";

const RecepAutocomplete = () => {
    const uData:UserPayload[]=[
        {token:'123',userid:'amal'},
        {token:'124',userid:'anu'},
        {token:'125',userid:'ram'},
        {token:'126',userid:'athul'}
    ]
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<UserPayload[]>([]);
    const [inData,setInData] = useState<UserPayload[]>([])
    useEffect(()=>{
        setSuggestions(uData)
        setInData(uData.slice())
    },[])
    const handleChange = (event:any) => {
      const value = event.target.value;
      setInputValue(value);
    };
  
    const handleSelect = (value:any) => {
      setInputValue(value);
      setSuggestions([]);
    };
    const filterNames = (item:any) => {
        // 1.
        let search = inputValue.toLowerCase().replace(/ /g,"_"); 
        //2.
        if(item.userid.startsWith(search, 14)){
           //3.
           return formatNames(item);
        }else{ 
           //4.
           suggestions.splice(suggestions.indexOf(item), 1);
           return null;
        }
     }
     

    const formatNames = (item:any) => {
        let heroName = item.userid.charAt(14).toUpperCase() + item.userid.slice(15);
        heroName = heroName.replace(/_/g, " ");
        return heroName;
     }
     
    
    return (
        <View style={{width:'100%'}}>
            <TextInput
                style={styles.input} 
                value={inputValue}
                onChange={handleChange}
                placeholderTextColor={Color.blackRecColor}
                placeholder='Name of Vistor' autoCapitalize='none' />
            <FlatList data={suggestions} keyExtractor = {(i)=>i.token.toString()}
            extraData = {inputValue} 
            renderItem = {({item}) =>
                <Text style={styles.flatList}>{formatNames(item)}
                </Text>} 
            />
        </View>
    )

}

const styles = StyleSheet.create({
    flatList:{
        paddingLeft: 15, 
        marginTop:15, 
        paddingBottom:15,
        fontSize: 20,
        borderBottomColor: '#26a69a',
        borderBottomWidth:1
    },
    input:{
        height: 40,
        paddingHorizontal: 20,
        borderColor: Color.blackRecColor,
        color: Color.blackRecColor,
        borderBottomWidth: 1,
        borderRadius: 50,
    },
})

export default RecepAutocomplete