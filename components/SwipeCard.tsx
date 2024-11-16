import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Animated, PanResponder, Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Crown, Sparkles } from 'lucide-react-native';
import { SvgUri } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const TinderCard = ({ data, onSwipeLeft, onSwipeRight }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageStates, setImageStates] = useState({});
    const position = useRef(new Animated.ValueXY()).current;
    const [swipeDirection, setSwipeDirection] = useState(null);

    const rotationValue = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp'
    });

    // Fetch images for current and next card
    useEffect(() => {
        const fetchImages = async () => {
            const indicesToFetch = [currentIndex, currentIndex + 1].filter(i => i < data.length);
            
            for (const index of indicesToFetch) {
                const item = data[index];
                if (!imageStates[item.text]) {
                    try {
                        const imageUrl = `https://api.cloudnouns.com/v1/pfp?name=${encodeURIComponent(item.text)}`;
                        
                        // Test if the URL is valid first
                        const response = await fetch(imageUrl);
                        if (!response.ok) throw new Error('Network response was not ok');
                        
                        // Store the direct URL
                        setImageStates(prev => ({
                            ...prev,
                            [item.text]: imageUrl
                        }));
                    } catch (error) {
                        console.error(`Error fetching image for ${item.text}:`, error);
                        setImageStates(prev => ({
                            ...prev,
                            [item.text]: null
                        }));
                    }
                }
            }
        };
        console.log(currentIndex)
        swipeDirection === 'right' ? onSwipeRight(currentIndex) : onSwipeLeft(currentIndex);
        fetchImages();
    }, [currentIndex, data]);

    useEffect(()=>{
      console.log("swipeDirection",swipeDirection)
    },[swipeDirection])

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
              // console.log("why")
                position.setValue({ x: gesture.dx, y: gesture.dy });
                if (gesture.dx > SWIPE_THRESHOLD) {
                  console.log("right")
                  setSwipeDirection("right");
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                  setSwipeDirection("left");
                  console.log("left")
                } else {
                  resetPosition();
                  setSwipeDirection("null");
                }
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                  // console.log("right")
                    forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                  // console.log("left")
                    forceSwipe('left');
                } else {
                    resetPosition();
                }
            }
        })
    ).current;

    const forceSwipe = useCallback((direction: 'left' | 'right') => {
      setSwipeDirection(direction);
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false,
        }).start(() => {onSwipeComplete()});
    }, [position]);

    const onSwipeComplete = useCallback(() => {
        // const item = data[currentIndex];
        // console.log("This is hte item right:", item)
        // direction === 'right' ? onSwipeRight(currentIndex) : onSwipeLeft(currentIndex);
        position.setValue({ x: 0, y: 0 });
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setSwipeDirection(null);
    }, [currentIndex, data, onSwipeLeft, onSwipeRight, position]);

    const resetPosition = useCallback(() => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
    }, [position]);

    const getCardStyle = () => {
        const rotate = rotationValue;
        return {
            ...position.getLayout(),
            transform: [{ rotate }],
        };
    };

    const renderCard = (item: { id: string, text: string, image: string, beauty: number, wealth: number }) => {
        const imageUrl = imageStates[item.text];
        
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <SvgUri
                        width="100%"
                        height="100%"
                        uri={item.image}
                      />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text>{"Loading..."}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.nounTitle}>{item.text}</Text>
                    </View>

                    <View style={styles.scoresContainer}>
                        <View style={styles.scoreItem}>
                            <Sparkles size={35} color="#000" />
                            <View style={{ alignItems: 'flex-start' }}>
                              <Text style={styles.scoreText}>{item.beauty}</Text>
                              <Text style={styles.scoreItem}>Beauty</Text>
                            </View>
                        </View>
                        <View style={styles.scoreItem}>
                            <Crown size={35} color="#000" />
                            <View style={{ alignItems: 'flex-start' }}>
                            <Text style={styles.scoreText}>{item.wealth}</Text>
                            <Text style={styles.scoreItem}>Wealth</Text>
                            </View>
                        </View>
                    </View>
                </View>


{/* Overlay for swipe direction */}
{swipeDirection === 'left' ? (
                    <View style={[styles.overlay, styles.overlayLeft]}>
                        <Text style={styles.overlayText}>{"Nahh"}</Text>
                    </View>
                ):null}
                {swipeDirection === 'right' ? (
                    <View style={[styles.overlay, styles.overlayRight]}>
                        <Text style={styles.overlayText}>{"Yaaah"}</Text>
                    </View>
                ):null}
                   {swipeDirection === 'null' ? (
                    <View >
                        
                    </View>
                ):null}

                

            </View>
        );
    };

    const renderCards = () => {
      if (currentIndex >= data.length) {
          return <Text style={styles.noMoreCards}>{"More matches coming soon..."}</Text>;
      }
  
      // Reaction container rendered only once outside the loop
      // const reactionComponent = (
          
      // );
  
      // Render the cards
      return (
          <>
              {/* This will be rendered once */}
  
              {data.map((item: { id: string, text: string, image: string, beauty: number, wealth: number }, index: number) => {
                  if (index < currentIndex) return null;
  
                  if (index === currentIndex) {
                      return (
                          <Animated.View
                              key={item.id}
                              style={[getCardStyle(), styles.cardStyle]}
                              {...panResponder.panHandlers}
                          >
                              {renderCard(item)}
                          </Animated.View>
                      );
                  }
  
                  return (
                      <Animated.View
                          key={item.id}
                          style={[styles.cardStyle, { top: -14 * (index - currentIndex), zIndex: -index, left: 5 * (index - currentIndex) }]}
                      >
                          {renderCard(item)}
                      </Animated.View>
                  );
              }).reverse()}

<View style={styles.reactionContainer}>
              <TouchableOpacity style={styles.reactionButton}>
                  <Ionicons name="heart-dislike-outline" size={30} color="#F44336" />
                  <Text style={[styles.reactionText, styles.down]}>{"<--------------"}</Text>
              </TouchableOpacity>



              <TouchableOpacity style={styles.reactionButton}>
                  <Ionicons name="heart-outline" size={30} color="#4CAF50" />
                  <Text style={[styles.reactionText,styles.up]}>{"-------------->"}</Text>
              </TouchableOpacity>
          </View>

          </>
      );
  };
  

    return <View style={styles.container1}>{renderCards()}</View>;
};

const styles = StyleSheet.create({
  up:{
    color: '#4CAF50',
  },
  down:{
    color: '#F44336',
  },
  container1: {
    flex: 1,
    marginTop: 100,

  },
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '85%',
    marginTop: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  reactionButton: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  reactionText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    fontWeight: '600',
  },
  // this is to give padding for the entire card
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.45,
    padding: 15,
    marginHorizontal: -5,
  },
  container: {
    backgroundColor: '#FFF5F1',
    borderRadius: 16,
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
borderBlockColor: 'black',
borderWidth: 3
  },
  imageContainer: {
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#000000FF',
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 1,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nounImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    gap: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nounTitle: {
    fontSize: 36,
    padding: 15,
    fontWeight: 'bold',
    fontFamily: 'Londrina',
  },
  scoresContainer: {
    flexDirection: 'row',
    gap: 96,
    padding: 15,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 5
  },
  scoreText: {
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
    color: '#000',
  },
  noMoreCards: {
    fontSize: 18,
    alignSelf: 'center',
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -40 }],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 1,
  },
  overlayLeft: {
    right: '20%',
    backgroundColor: '#FF3964FF',
  },
  overlayRight: {
    left: '20%',
    backgroundColor: '#88FF9EFF',
  },
  overlayText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TinderCard;