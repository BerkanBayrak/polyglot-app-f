import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
    
// Global colors for the application
export const Colors = {
  primary: '#007ACC',
  background: '#A9D1FE',
  text: 'black',
  white: 'white',
};
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
// Global styles for the application
export const GlobalStyles = StyleSheet.create({
          
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  levelText: {
    fontSize : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: screenWidth * 0.08,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 10,
    textAlign: 'center',

  },
  whiteBackgroundContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: '2%',
    marginVertical: '10%',
    borderRadius: 20,
    padding: 20
  },
  buttonContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20
  },
  languageButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    margin: 10,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginVertical: 6,
  },
  blueButton: { 
    width: screenWidth * 0.6, 
    height: screenHeight * 0.1,
    backgroundColor: 'white',
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000066',
    borderRadius: 10,
  },
  blueButtonText: {
    color: '#000066',
    fontSize: screenWidth * 0.06,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
  flagImage: {
    width: screenWidth * 0.15, 
    height: screenWidth * 0.15,
    resizeMode: 'contain',
  },
  box: {
    width: '100%',
    height: 100,
    marginVertical: 10,
  },
  settingsButton: {
    padding: 5,
  },  
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },    
  image: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,  
  },
  sentenceText: {
    fontSize: screenWidth * 0.1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grammarContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  grammarQuestion: {
    fontSize: screenWidth * 0.05,
    textAlign: 'center',
    marginVertical: 10,
  },
  grammarImage: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 30,
    },
  optionButton: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  optionText: {
    fontSize: screenWidth * 0.06,
    textAlign: 'center',  
    color: Colors.text,
    fontWeight: 'bold',
  },
}); 
