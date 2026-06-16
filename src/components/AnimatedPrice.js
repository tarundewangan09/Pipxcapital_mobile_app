import React, { useRef, useEffect, memo } from 'react';
import { View, Text, Animated, Platform, StyleSheet } from 'react-native';

// Per-digit rolling animation for live prices / PnL in the APK.
// Each digit is a vertical column of 0-9 stacked at fontSize-tall rows. The
// visible "window" is a single-row View with overflow: 'hidden'; we translateY
// to show the current digit. Animated.timing with useNativeDriver: true runs
// on the UI thread, so it stays smooth even at 10+ ticks/sec without blocking
// JS. Non-digit characters (., $, -, +, comma, space) render inline as-is.

const DIGIT_LANE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const AnimatedDigit = memo(function AnimatedDigit({ digit, charHeight, textStyle }) {
  const n = parseInt(digit, 10);
  const translateY = useRef(new Animated.Value(-n * charHeight)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: -n * charHeight,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [n, charHeight]);

  return (
    <View style={{ height: charHeight, overflow: 'hidden' }}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {DIGIT_LANE.map(d => (
          <Text
            key={d}
            allowFontScaling={false}
            style={[textStyle, styles.digit, { height: charHeight, lineHeight: charHeight }]}
          >
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
});

// Flatten array of styles to a single object so we can read fontSize.
function flattenStyle(style) {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...(s || {}) }), {});
  }
  return style;
}

export default function AnimatedPrice({
  value,
  decimals = 2,
  prefix = '',
  suffix = '',
  signed = false,
  style,
}) {
  const merged = flattenStyle(style);
  const fontSize = merged.fontSize || 14;
  // Slight overshoot so descenders on '-' / '$' aren't clipped on Android.
  const charHeight = Math.ceil(fontSize * (Platform.OS === 'android' ? 1.25 : 1.15));

  if (typeof value !== 'number' || isNaN(value)) {
    return <Text allowFontScaling={false} style={style}>{prefix}-{suffix}</Text>;
  }

  let body = Math.abs(value).toFixed(decimals);
  let signChar = '';
  if (signed) signChar = value >= 0 ? '+' : '-';
  else if (value < 0) signChar = '-';

  const full = `${signChar}${prefix}${body}${suffix}`;

  return (
    <View style={styles.row}>
      {Array.from(full).map((c, i) =>
        /\d/.test(c) ? (
          <AnimatedDigit key={i} digit={c} charHeight={charHeight} textStyle={style} />
        ) : (
          <Text
            key={i}
            allowFontScaling={false}
            style={[style, { height: charHeight, lineHeight: charHeight }]}
          >
            {c}
          </Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  digit: {
    textAlign: 'center',
  },
});
