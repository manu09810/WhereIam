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
// @ts-ignore
const { iso6392 } = require("iso-639-2");

interface TranslateModalProps {
  visible: boolean;
  onClose: () => void;
  language: string;
  textLanguage: string;
}

const getReadableTextColor = (hex: string) => {
  if (!hex || hex.length < 7) return "#111111";
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
};

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
  const cardBg = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.12)";
  const cardBorder = isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.16)";
  const dimText = isLight ? "rgba(17,17,17,0.5)" : "rgba(255,255,255,0.55)";
  const inputBg = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)";
  const inputBorder = isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.22)";
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
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: sheetBg,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: isLight
                ? "rgba(0,0,0,0.08)"
                : "rgba(255,255,255,0.15)",
              padding: 24,
              paddingBottom: Platform.OS === "ios" ? 40 : 24,
              minHeight: 320,
            }}
          >
            {/* Drag handle */}
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: isLight
                  ? "rgba(0,0,0,0.15)"
                  : "rgba(255,255,255,0.3)",
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 22, fontWeight: "800", color: textColor }}
                >
                  Translate
                </Text>
                <Text style={{ fontSize: 13, color: dimText, marginTop: 2 }}>
                  {textLanguage}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: isLight
                    ? "rgba(0,0,0,0.08)"
                    : "rgba(255,255,255,0.15)",
                  borderRadius: 50,
                  padding: 8,
                }}
              >
                <XMarkIcon size={22} color={textColor} />
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
                borderRadius: 16,
                paddingVertical: 10,
                paddingHorizontal: 18,
                marginBottom: 20,
                alignSelf: "center",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 15,
                  color: textColor,
                  letterSpacing: 0.5,
                }}
              >
                {toEnglish
                  ? `${isoLang.toUpperCase()} → EN`
                  : `EN → ${isoLang.toUpperCase()}`}
              </Text>
              <ArrowsRightLeftIcon size={18} color={textColor} />
            </TouchableOpacity>

            {/* Label */}
            <Text
              style={{
                fontSize: 11,
                color: dimText,
                fontWeight: "700",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 8,
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
                borderRadius: 14,
                padding: 14,
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 14,
                color: textColor,
              }}
            />

            {/* Translate button */}
            <TouchableOpacity
              onPress={handleTranslate}
              style={{
                backgroundColor: btnBg,
                borderRadius: 14,
                padding: 15,
                alignItems: "center",
                marginBottom: 14,
                opacity: loading ? 0.6 : 1,
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
                    fontSize: 16,
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
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: dimText,
                    fontWeight: "700",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Translation
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: textColor,
                    fontWeight: "600",
                    lineHeight: 28,
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
                  marginTop: 10,
                  textAlign: "center",
                  fontSize: 14,
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
