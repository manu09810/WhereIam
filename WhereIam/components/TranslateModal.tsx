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
  language: string; // Puede ser ISO 639-1 o 639-2
  textLanguage: string;
}

export const TranslateModal = ({
  visible,
  onClose,
  language,
  textLanguage,
}: TranslateModalProps) => {
  const { themeColors } = useLocation(); // <-- Obtiene los colores del contexto

  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phrase, setPhrase] = useState("");
  const [toEnglish, setToEnglish] = useState(false);

  // Convierte a ISO 639-1 si es necesario
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
    const body: any = {
      q: text,
      target: targetLang,
    };
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
      setError("Please enter a valid phrase.");
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
              backgroundColor: themeColors?.[0] || "#fff", // <-- Color del modal
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              minHeight: 320,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "700", color: "#1a1a1a" }}
              >
                Translate
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: 50,
                  padding: 8,
                }}
              >
                <XMarkIcon size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            {/* Switch button */}
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => setToEnglish((v) => !v)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: themeColors?.[1] || "#f0f0f0", // <-- Color del switch
                  borderRadius: 20,
                  paddingVertical: 6,
                  paddingHorizontal: 16,
                }}
              >
                <Text style={{ fontWeight: "600", marginRight: 8 }}>
                  {toEnglish
                    ? `${isoLang.toUpperCase()} → EN`
                    : `EN → ${isoLang.toUpperCase()}`}
                </Text>
                <ArrowsRightLeftIcon size={20} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            {/* Input */}
            <Text style={{ fontSize: 16, color: "#1a1a1a", marginBottom: 8 }}>
              {" "}
              {toEnglish
                ? `Translate from ${textLanguage} to English`
                : `Translate from English to ${textLanguage}`}
            </Text>
            <TextInput
              placeholder={
                toEnglish
                  ? `Enter phrase in ${textLanguage}`
                  : "Enter phrase in English"
              }
              value={phrase}
              onChangeText={setPhrase}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                fontSize: 18,
                marginBottom: 16,
                backgroundColor: "#fff",
                color: "#1a1a1a",
              }}
            />

            <TouchableOpacity
              onPress={handleTranslate}
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 8,
                padding: 14,
                alignItems: "center",
                marginBottom: 16,
              }}
              disabled={loading}
            >
              <Text
                style={{ color: "#ffff", fontWeight: "700", fontSize: 16 }}
              >
                {"Translate"}
              </Text>
            </TouchableOpacity>

            {loading && (
              <ActivityIndicator
                size="small"
                color="#1a1a1a"
                style={{ marginBottom: 12 }}
              />
            )}

            {translated !== null && !loading && (
              <View style={{ alignItems: "center", marginBottom: 8 }}>
                <Text style={{ fontSize: 18, color: "#1a1a1a" }}>
                  {" "}
                  {translated}
                </Text>
              </View>
            )}

            {error && (
              <Text
                style={{ color: "#1a1a1a", marginTop: 8, textAlign: "center" }}
              >
                {" "}
                {error}
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
