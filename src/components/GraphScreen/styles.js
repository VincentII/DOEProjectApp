import { StyleSheet, Platform } from 'react-native'
import { responsiveWidth, responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions'
import { Colors } from '../../utils/constant-styles'

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        justifyContent:"center",
        backgroundColor:Colors.bgLight
       },
    titleContainer: {
        padding: 20,
        backgroundColor:Colors.bgLight
    },
    subContainer: {
        flex: 1,
        padding: 20,
        backgroundColor:Colors.bgLight
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:Colors.bgLight,
    },
    clearButton:{
        marginTop:10,
        marginBottom:10,
        backgroundColor:"transparent",
        borderWidth:2,
        borderColor:Colors.text
    },
    clearButtonText:{
        
        color:Colors.text
    },
    inputStyle:{
        color:Colors.text,
        padding:2,
     
    },
    clickableText:{
        color:Colors.text,
        padding:20,
        textDecorationLine:"underline"
        
    },
       
    errorMessage:{
        color:"red",
    
    },

    title:{
        fontWeight:"300",
        fontSize:50,
        textAlign:"center"
    },
    header:{
        fontWeight:"400",
        fontSize:20,
        textAlign:"center"
    },
    item:{
        fontWeight:"100",
        fontSize:12,
        textAlign:"center"
    }
})
