import { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import { ArrowsRightLeftIcon } from "react-native-heroicons/outline";
// @ts-ignore
const { iso6392 } = require("iso-639-2");

interface TranslateModalProps {
  visible: boolean;
  onClose: () => void;
  language: string; // Puede ser ISO 639-1 o 639-2
}

export const TranslateModal = ({
  visible,
  onClose,
  language,
}: TranslateModalProps) => {
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phrase, setPhrase] = useState("");
  const [toEnglish, setToEnglish] = useState(false);
  const [match, setMatch] = useState<number | null>(null);

  // Convierte a ISO 639-1 si es necesario
  const isoLang = useMemo(() => {
    if (!language) return "es";
    if (language.length === 2) return language;
    const found = iso6392.find(
      (l: any) => l.iso6392B === language || l.iso6392T === language
    );
    return found?.iso6391 || language;
  }, [language]);

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
    setMatch(null);
    try {
      // Añade un espacio al final si no lo hay
      let phraseToSend = phrase.endsWith(" ") ? phrase : phrase + " ";
      const from = toEnglish ? isoLang : "en";
      const to = toEnglish ? "en" : isoLang;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        phraseToSend
      )}&langpair=${from}|${to}`;
      const response = await fetch(url);
      const data = await response.json();
      let bestTranslation = null;
      let bestMatch = null;

      if (
        data.matches &&
        Array.isArray(data.matches) &&
        data.matches.length > 0
      ) {
        // Usa siempre el primer match
        const best = data.matches[0];
        let translation = best.translation;
        if (translation.includes("%")) {
          translation = decodeURIComponent(translation);
        }
        bestTranslation = translation;
        bestMatch = best.match;
      } else if (data.responseData && data.responseData.translatedText) {
        let translation = data.responseData.translatedText;
        if (translation.includes("%")) {
          translation = decodeURIComponent(translation);
        }
        bestTranslation = translation;
        bestMatch = null;
      } else {
        setError("Translation failed.");
      }

      setTranslated(bestTranslation);
      setMatch(bestMatch);
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
              backgroundColor: "#fff",
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
                  backgroundColor: "#f0f0f0",
                  borderRadius: 20,
                  paddingVertical: 6,
                  paddingHorizontal: 16,
                }}
              >
                <Text style={{ fontWeight: "600", marginRight: 8 }}>
                  {toEnglish ? `${isoLang} → EN` : `EN → ${isoLang}`}
                </Text>
                <ArrowsRightLeftIcon size={20} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            {/* Input */}
            <Text style={{ fontSize: 16, color: "#666", marginBottom: 8 }}>
              {toEnglish
                ? `Translate from ${isoLang} to English`
                : `Translate from English to ${isoLang}`}
            </Text>
            <TextInput
              placeholder={
                toEnglish
                  ? `Enter phrase in ${isoLang}`
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
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Translate
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
                  {translated}
                </Text>
                {match !== null && (
                  <Text style={{ fontSize: 14, color: "#888" }}>
                    Match: {(match * 100).toFixed(0)}%
                  </Text>
                )}
              </View>
            )}

            {error && (
              <Text style={{ color: "red", marginTop: 8, textAlign: "center" }}>
                {error}
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
