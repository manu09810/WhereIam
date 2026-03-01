import React, { useState, useMemo } from "react";
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import { ArrowsRightLeftIcon } from "react-native-heroicons/outline";
import { useLocation } from "@/context/LocationContext";
import { getReadableTextColor } from "@/constants/functions";
import {
  ALPHA,
  FONT_SIZE,
  LINE_HEIGHT,
  MODAL,
  RADIUS,
  SIZE,
  SPACING,
} from "@/constants/theme";
// @ts-ignore
const { iso6392 } = require("iso-639-2");

interface TranslateModalProps {
  visible: boolean;
  onClose: () => void;
  language: string;
  textLanguage: string;
}

export const TranslateModal = ({
  visible,
  onClose,
  language,
  textLanguage,
}: TranslateModalProps) => {
  const { themeColors } = useLocation();

  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phrase, setPhrase] = useState("");
  const [toEnglish, setToEnglish] = useState(false);

  const sheetBg = themeColors?.[0] || "#ffffff";
  const textColor = getReadableTextColor(sheetBg);
  const isLight = textColor === "#111111";
  const cardBg = isLight ? ALPHA.lightCard : ALPHA.darkCard;
  const cardBorder = isLight ? ALPHA.lightCardBorder : ALPHA.darkCardBorder;
  const dimText = isLight ? ALPHA.lightDimText : ALPHA.darkDimText;
  const inputBg = isLight ? ALPHA.lightInput : ALPHA.darkInput;
  const inputBorder = isLight ? ALPHA.lightInputBorder : ALPHA.darkInputBorder;
  const btnBg = textColor;
  const btnText = isLight ? "#ffffff" : "#111111";

  const isoLang = useMemo(() => {
    if (!language) return "es";
    if (language.length === 2) return language;
    const found = iso6392.find(
      (l: any) => l.iso6392B === language || l.iso6392T === language
    );
    return found?.iso6391 || language;
  }, [language]);

  const GOOGLE_TRANSLATE_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_TRANSLATION_KEY;

  async function translateText(
    text: string,
    targetLang: string,
    sourceLang?: string
  ) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    const body: any = { q: text, target: targetLang };
    if (sourceLang) body.source = sourceLang;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data.data.translations[0].translatedText;
  }

  const handleTranslate = async () => {
    if (!isoLang) {
      setError("Please enter a valid language.");
      return;
    }
    if (!phrase) {
      setError("Please enter a phrase.");
      return;
    }
    setLoading(true);
    setError(null);
    setTranslated(null);
    try {
      const target = toEnglish ? "en" : isoLang;
      const source = toEnglish ? isoLang : "en";
      const translatedText = await translateText(phrase, target, source);
      setTranslated(translatedText);
    } catch (e) {
      setError("Error fetching translation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: ALPHA.overlayBg,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: sheetBg,
              borderTopLeftRadius: RADIUS.sheet,
              borderTopRightRadius: RADIUS.sheet,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: isLight ? ALPHA.lightBorder : ALPHA.darkBorder,
              padding: SPACING.sheet,
              paddingBottom: Platform.OS === "ios" ? SPACING.iosBottom : SPACING.sheet,
              minHeight: MODAL.minHeight,
            }}
          >
            {/* Drag handle */}
            <View
              style={{
                width: SIZE.handleWidth,
                height: SIZE.handleHeight,
                borderRadius: RADIUS.handle,
                backgroundColor: isLight ? ALPHA.lightHandle : ALPHA.darkHandle,
                alignSelf: "center",
                marginBottom: SPACING.xxxl,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: SPACING.xxxl,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: FONT_SIZE.title, fontWeight: "800", color: textColor }}
                >
                  Translate
                </Text>
                <Text style={{ fontSize: FONT_SIZE.errorText, color: dimText, marginTop: 2 }}>
                  {textLanguage}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: isLight ? ALPHA.lightBorder : ALPHA.darkBorder,
                  borderRadius: RADIUS.closeBtn,
                  padding: SPACING.md,
                }}
              >
                <XMarkIcon size={SIZE.icon} color={textColor} />
              </TouchableOpacity>
            </View>

            {/* Direction toggle */}
            <TouchableOpacity
              onPress={() => {
                setToEnglish((v) => !v);
                setTranslated(null);
                setError(null);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: cardBorder,
                borderRadius: RADIUS.card,
                paddingVertical: SPACING.lg,
                paddingHorizontal: SPACING.inner,
                marginBottom: SPACING.xxxl,
                alignSelf: "center",
                gap: SPACING.lg,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: FONT_SIZE.body,
                  color: textColor,
                  letterSpacing: 0.5,
                }}
              >
                {toEnglish
                  ? `${isoLang.toUpperCase()} → EN`
                  : `EN → ${isoLang.toUpperCase()}`}
              </Text>
              <ArrowsRightLeftIcon size={SIZE.switchIcon} color={textColor} />
            </TouchableOpacity>

            {/* Label */}
            <Text
              style={{
                fontSize: FONT_SIZE.label,
                color: dimText,
                fontWeight: "700",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: SPACING.md,
              }}
            >
              {toEnglish
                ? `Phrase in ${textLanguage}`
                : "Phrase in English"}
            </Text>

            {/* Input */}
            <TextInput
              placeholder={
                toEnglish
                  ? `Enter text in ${textLanguage}...`
                  : "Enter text in English..."
              }
              placeholderTextColor={dimText}
              value={phrase}
              onChangeText={setPhrase}
              style={{
                backgroundColor: inputBg,
                borderWidth: 1,
                borderColor: inputBorder,
                borderRadius: RADIUS.input,
                padding: SPACING.xl,
                fontSize: FONT_SIZE.subheading,
                fontWeight: "600",
                marginBottom: SPACING.xl,
                color: textColor,
              }}
            />

            {/* Translate button */}
            <TouchableOpacity
              onPress={handleTranslate}
              style={{
                backgroundColor: btnBg,
                borderRadius: RADIUS.input,
                padding: MODAL.convertPadding,
                alignItems: "center",
                marginBottom: SPACING.xl,
                opacity: loading ? ALPHA.loadingOpacity : 1,
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={btnText} />
              ) : (
                <Text
                  style={{
                    color: btnText,
                    fontWeight: "700",
                    fontSize: FONT_SIZE.input,
                    letterSpacing: 0.3,
                  }}
                >
                  Translate
                </Text>
              )}
            </TouchableOpacity>

            {/* Result */}
            {translated !== null && !loading && (
              <View
                style={{
                  backgroundColor: cardBg,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  borderRadius: RADIUS.card,
                  padding: SPACING.xxl,
                }}
              >
                <Text
                  style={{
                    fontSize: FONT_SIZE.caption,
                    color: dimText,
                    fontWeight: "700",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: SPACING.md,
                  }}
                >
                  Translation
                </Text>
                <Text
                  style={{
                    fontSize: FONT_SIZE.large,
                    color: textColor,
                    fontWeight: "600",
                    lineHeight: LINE_HEIGHT.loose,
                  }}
                >
                  {translated}
                </Text>
              </View>
            )}

            {error && (
              <Text
                style={{
                  color: dimText,
                  marginTop: SPACING.lg,
                  textAlign: "center",
                  fontSize: FONT_SIZE.error,
                }}
              >
                {error}
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
