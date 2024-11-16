import React, { useState, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const AnimatedSpeedometer = ({ value, label, color = "#D1D1D1FF" }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const animatedValue = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    animatedValue.addListener(({ value: v }) => {
      setCurrentValue(Math.floor(v));
    });

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [value]);
  
  // SVG parameters
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Calculate angles for the gauge (adjusted for upward orientation)
  const startAngle = 180; // Start from bottom right
  const endAngle = 0;    // End at bottom left
  const angleRange = endAngle - startAngle;
  const currentAngle = startAngle + (angleRange * currentValue) / 100;
  
  // Calculate needle angle (in radians)
  const needleAngleRad = (((180-currentAngle) * Math.PI) / 180);
  
  // Calculate coordinates for gauge
  const startX = center - radius * Math.cos((startAngle * Math.PI) / 180);
  const startY = center - radius * Math.sin((startAngle * Math.PI) / 180);
  const endX = center + radius * Math.cos((currentAngle * Math.PI) / 180);
  const endY = center - radius * Math.sin((currentAngle * Math.PI) / 180);
  
  // Calculate needle endpoint
  const needleLength = radius - 10;
  const needleEndX = center - needleLength * Math.cos(needleAngleRad);
  const needleEndY = center - needleLength * Math.sin(needleAngleRad);
  
  // Create arc paths
  const backgroundArc = [
    `M ${startX} ${startY}`,
    `A ${radius} ${radius} 0 1 0 ${center - radius} ${center}`
  ].join(" ");

  const valueArc = [
    `M ${startX} ${startY}`,
    `A ${radius} ${radius} 0 ${Math.abs(currentAngle - startAngle) <= 180 ? "0" : "1"} 0 ${endX} ${endY}`
  ].join(" ");

  // Generate tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const tickAngle = ((startAngle - (angleRange * i) / 10) * Math.PI) / 180;
    const tickLength = i % 5 === 0 ? 10 : 5; // Longer ticks for multiples of 50
    const outerRadius = radius;
    const innerRadius = radius - tickLength;
    
    return {
      x1: center - innerRadius * Math.cos(tickAngle),
      y1: center + innerRadius * Math.sin(tickAngle),
      x2: center - outerRadius * Math.cos(tickAngle),
      y2: center + outerRadius * Math.sin(tickAngle),
    };
  });



  return (
    <View style={{
      padding: 16,
      backgroundColor: '#FFFFFFFF',
      borderRadius: 20,
      width: 130,
      height: 170,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: 'black',
      paddingTop: 20,
    //   shadowColor: '#000',
    //   shadowOffset: { width: 0, height: 4 },
    //   shadowOpacity: 0.1,
    //   shadowRadius: 8,
    //   elevation: 5,
    }}>
      <Svg
        width={size}
        height={size/1.6}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background arc */}
        <Path
          d={backgroundArc}
          fill="none"
          stroke="#f9e587"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Value arc */}
        <Path
          d={valueArc}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {ticks.map((tick, i) => (
          <Line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="#666"
            strokeWidth={i % 5 === 0 ? 2 : 1}
          />
        ))}

        <Line
          x1={center}
          y1={center}
          x2={needleEndX}
          y2={needleEndY}
          stroke="red"
          strokeWidth={2}
        />
        
        {/* Center point */}
        <Circle
          cx={center}
          cy={center}
          r={4}
          fill="red"
        />
      </Svg>
      
      <View style={{ marginTop: 4, alignItems: 'center' }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold',
          color: '#'
        }}>
          {currentValue}%
        </Text>
        <Text style={{ 
          fontSize: 14,
          fontWeight: '500',
          color: '#000'
        }}>
          {label}
        </Text>
      </View>
    </View>
  );
};

export default AnimatedSpeedometer;